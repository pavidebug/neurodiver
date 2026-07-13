import { FirebaseError } from 'firebase/app'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  Timestamp,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { runPostBookingIntegrations } from '@/lib/focus-session-integrations'
import { db } from '@/lib/firebase'
import { trackAnalyticsEvent } from '@/lib/product-analytics'
import type {
  FocusSession,
  SessionBooking,
  SessionBookingInput,
  SessionFeedbackInput,
} from '@/types/body-doubling'

const FOCUS_SESSIONS_COLLECTION = 'focusSessions'
const SESSION_BOOKINGS_COLLECTION = 'sessionBookings'
const SESSION_FEEDBACK_COLLECTION = 'sessionFeedback'

export class SessionFullError extends Error {
  constructor() {
    super('This session is full.')
    this.name = 'SessionFullError'
  }
}

export class AlreadyBookedError extends Error {
  constructor() {
    super('You already have a spot in this session.')
    this.name = 'AlreadyBookedError'
  }
}

export class SessionNotFoundError extends Error {
  constructor() {
    super('This session is no longer available.')
    this.name = 'SessionNotFoundError'
  }
}

function mapFocusSession(
  id: string,
  data: Record<string, unknown>,
  bookedCount = 0,
): FocusSession {
  const startsAt = data.startsAt as Timestamp

  return {
    id,
    title: String(data.title ?? 'Body Doubling Session'),
    startsAt: startsAt.toDate(),
    durationMinutes: Number(data.durationMinutes ?? 0),
    platform: data.platform as FocusSession['platform'],
    meetingLink: String(data.meetingLink ?? ''),
    capacity: Number(data.capacity ?? 0),
    isActive: data.isActive !== false,
    bookedCount,
  }
}

function mapSessionBooking(
  id: string,
  data: Record<string, unknown>,
): SessionBooking {
  const bookedAt = data.bookedAt as Timestamp

  return {
    id,
    userId: String(data.userId ?? ''),
    sessionId: String(data.sessionId ?? ''),
    bookedAt: bookedAt.toDate(),
    intention: typeof data.intention === 'string' ? data.intention : null,
    attendanceStatus: data.attendanceStatus as SessionBooking['attendanceStatus'],
  }
}

function buildBookingId(sessionId: string, userId: string): string {
  return `${sessionId}_${userId}`
}

function countBookingsBySession(
  docs: Array<{ data: () => Record<string, unknown> }>,
): Record<string, number> {
  const counts: Record<string, number> = {}

  for (const document of docs) {
    const data = document.data()
    if (data.attendanceStatus !== 'booked') continue

    const sessionId = String(data.sessionId ?? '')
    counts[sessionId] = (counts[sessionId] ?? 0) + 1
  }

  return counts
}

export function getFocusSessionsErrorMessage(error: unknown): string {
  if (error instanceof SessionFullError) return error.message
  if (error instanceof AlreadyBookedError) return error.message
  if (error instanceof SessionNotFoundError) return error.message

  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Could not complete your booking. Please try again or contact support.'
    }
  }

  return 'Something went wrong. Please try again.'
}

export function subscribeToUpcomingSessions(
  onData: (sessions: FocusSession[]) => void,
  onError: (error: Error) => void,
  bookingCounts: Record<string, number> = {},
  limit = 3,
): Unsubscribe {
  const sessionsQuery = query(
    collection(db, FOCUS_SESSIONS_COLLECTION),
    orderBy('startsAt', 'asc'),
  )

  return onSnapshot(
    sessionsQuery,
    (snapshot) => {
      const now = Date.now()
      const sessions = snapshot.docs
        .map((document) => {
          const data = document.data() as Record<string, unknown>
          return mapFocusSession(
            document.id,
            data,
            bookingCounts[document.id] ?? 0,
          )
        })
        .filter((session) => session.isActive && session.startsAt.getTime() >= now)
        .slice(0, limit)

      onData(sessions)
    },
    (error) => onError(error),
  )
}

export function subscribeToActiveBookingCounts(
  onData: (counts: Record<string, number>) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const bookingsQuery = query(
    collection(db, SESSION_BOOKINGS_COLLECTION),
    where('attendanceStatus', '==', 'booked'),
  )

  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      onData(countBookingsBySession(snapshot.docs))
    },
    (error) => onError(error),
  )
}

export function subscribeToUserBookings(
  userId: string,
  onData: (bookings: SessionBooking[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const bookingsQuery = query(
    collection(db, SESSION_BOOKINGS_COLLECTION),
    where('userId', '==', userId),
    orderBy('bookedAt', 'desc'),
  )

  return onSnapshot(
    bookingsQuery,
    (snapshot) => {
      const bookings = snapshot.docs.map((document) =>
        mapSessionBooking(document.id, document.data() as Record<string, unknown>),
      )
      onData(bookings)
    },
    (error) => onError(error),
  )
}

export async function createSessionBooking(
  input: SessionBookingInput,
): Promise<SessionBooking> {
  const sessionRef = doc(db, FOCUS_SESSIONS_COLLECTION, input.sessionId)
  const bookingRef = doc(
    db,
    SESSION_BOOKINGS_COLLECTION,
    buildBookingId(input.sessionId, input.userId),
  )

  const sessionSnap = await getDoc(sessionRef)
  if (!sessionSnap.exists()) {
    throw new SessionNotFoundError()
  }

  const sessionData = sessionSnap.data() as Record<string, unknown>
  if (sessionData.isActive === false) {
    throw new SessionNotFoundError()
  }

  const capacity = Number(sessionData.capacity ?? 0)

  const activeBookingsSnap = await getDocs(
    query(
      collection(db, SESSION_BOOKINGS_COLLECTION),
      where('sessionId', '==', input.sessionId),
      where('attendanceStatus', '==', 'booked'),
    ),
  )

  if (activeBookingsSnap.size >= capacity) {
    throw new SessionFullError()
  }

  const intention = input.intention?.trim() || null

  const booking = await runTransaction(db, async (transaction) => {
    const existingSnap = await transaction.get(bookingRef)
    if (
      existingSnap.exists() &&
      existingSnap.data()?.attendanceStatus === 'booked'
    ) {
      const data = existingSnap.data() as Record<string, unknown>
      const bookedAt = data.bookedAt as Timestamp | undefined

      return {
        id: bookingRef.id,
        userId: input.userId,
        sessionId: input.sessionId,
        bookedAt: bookedAt?.toDate() ?? new Date(),
        intention: typeof data.intention === 'string' ? data.intention : null,
        attendanceStatus: 'booked' as const,
      }
    }

    transaction.set(bookingRef, {
      userId: input.userId,
      sessionId: input.sessionId,
      bookedAt: serverTimestamp(),
      intention,
      attendanceStatus: 'booked',
      contactEmail: input.contactEmail?.trim() || null,
      reminderEnabled: input.reminderEnabled ?? true,
    })

    return {
      id: bookingRef.id,
      userId: input.userId,
      sessionId: input.sessionId,
      bookedAt: new Date(),
      intention,
      attendanceStatus: 'booked' as const,
    }
  })

  void runPostBookingIntegrations(booking)
  void trackAnalyticsEvent(input.userId, 'started_body_doubling', {
    sessionId: input.sessionId,
  })

  return booking
}

export async function submitSessionFeedback(
  input: SessionFeedbackInput,
): Promise<string> {
  const ref = await addDoc(collection(db, SESSION_FEEDBACK_COLLECTION), {
    userId: input.userId,
    sessionId: input.sessionId,
    bookingId: input.bookingId,
    sessionHelpful: input.sessionHelpful,
    completedPlan: input.completedPlan,
    wouldJoinAgain: input.wouldJoinAgain,
    notes: input.notes?.trim() || null,
    submittedAt: serverTimestamp(),
  })

  void trackAnalyticsEvent(input.userId, 'submitted_feedback', {
    sessionId: input.sessionId,
    rating: input.wouldJoinAgain,
  })

  return ref.id
}

export async function markBookingAttended(bookingId: string): Promise<void> {
  const bookingRef = doc(db, SESSION_BOOKINGS_COLLECTION, bookingId)

  await runTransaction(db, async (transaction) => {
    const snap = await transaction.get(bookingRef)
    if (!snap.exists()) return

    transaction.update(bookingRef, {
      attendanceStatus: 'attended',
    })
  })
}

export async function hasSessionFeedback(
  userId: string,
  bookingId: string,
): Promise<boolean> {
  const snapshot = await getDocs(
    query(
      collection(db, SESSION_FEEDBACK_COLLECTION),
      where('userId', '==', userId),
      where('bookingId', '==', bookingId),
    ),
  )

  return !snapshot.empty
}
