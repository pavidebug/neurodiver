import { FirebaseError } from 'firebase/app'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { WORK_CHECK_IN_QUESTIONS } from '@/data/work-check-in-questions'
import { getTodayString } from '@/lib/dates'
import { db } from '@/lib/firebase'
import type {
  UserWorkProfile,
  WorkCheckIn,
  WorkCheckInDocument,
  WorkCheckInInput,
} from '@/types/work-energy'
import { DEFAULT_USER_WORK_PROFILE } from '@/types/work-energy'

export class DuplicateWorkCheckInError extends Error {
  constructor(date = getTodayString()) {
    super(`You already completed your work check-in for ${date}.`)
    this.name = 'DuplicateWorkCheckInError'
  }
}

export class IncompleteWorkCheckInError extends Error {
  constructor() {
    super('Please answer all required work check-in questions.')
    this.name = 'IncompleteWorkCheckInError'
  }
}

function getUserRef(userId: string) {
  return doc(db, 'users', userId)
}

function getWorkCheckInRef(userId: string, date: string) {
  return doc(db, 'users', userId, 'workCheckIns', date)
}

function getWorkCheckInsCollection(userId: string) {
  return collection(db, 'users', userId, 'workCheckIns')
}

function mapWorkCheckIn(id: string, data: Record<string, unknown>): WorkCheckIn {
  return {
    id,
    userId: String(data.userId ?? ''),
    organisationId:
      typeof data.organisationId === 'string' ? data.organisationId : null,
    date: String(data.date ?? id),
    checkInTime: String(data.checkInTime ?? ''),
    createdAt: data.createdAt as Timestamp,
    energyTank: Number(data.energyTank ?? 0),
    maskingLoad: Number(data.maskingLoad ?? 0),
    supportFelt: Number(data.supportFelt ?? 0),
    biggestDrain: data.biggestDrain as WorkCheckIn['biggestDrain'],
    biggestDrainOther:
      typeof data.biggestDrainOther === 'string' ? data.biggestDrainOther : null,
    biggestRefill: data.biggestRefill as WorkCheckIn['biggestRefill'],
    biggestRefillOther:
      typeof data.biggestRefillOther === 'string' ? data.biggestRefillOther : null,
    mostDrainingTime: data.mostDrainingTime as WorkCheckIn['mostDrainingTime'],
    ableToAskNeeds: data.ableToAskNeeds as WorkCheckIn['ableToAskNeeds'],
    accommodationWish:
      typeof data.accommodationWish === 'string' ? data.accommodationWish : null,
    wouldUseAgain:
      typeof data.wouldUseAgain === 'number' ? data.wouldUseAgain : null,
    notes: typeof data.notes === 'string' ? data.notes : null,
  }
}

export function mapUserWorkProfile(data: unknown): UserWorkProfile {
  if (!data || typeof data !== 'object') {
    return DEFAULT_USER_WORK_PROFILE
  }

  const profile = data as Partial<UserWorkProfile>

  return {
    organisationId:
      typeof profile.organisationId === 'string' ? profile.organisationId : null,
    role: profile.role ?? DEFAULT_USER_WORK_PROFILE.role,
    timezone: profile.timezone ?? DEFAULT_USER_WORK_PROFILE.timezone,
    reminderEnabled:
      profile.reminderEnabled ?? DEFAULT_USER_WORK_PROFILE.reminderEnabled,
    reminderTime: profile.reminderTime ?? DEFAULT_USER_WORK_PROFILE.reminderTime,
  }
}

function isScaleValid(value: unknown): value is number {
  return typeof value === 'number' && value >= 1 && value <= 5
}

function isWorkCheckInComplete(input: WorkCheckInInput): boolean {
  if (!isScaleValid(input.energyTank)) return false
  if (!isScaleValid(input.maskingLoad)) return false
  if (!isScaleValid(input.supportFelt)) return false
  if (!input.biggestDrain || !input.biggestRefill) return false
  if (!input.mostDrainingTime || !input.ableToAskNeeds) return false
  if (input.biggestDrain === 'other' && !input.biggestDrainOther?.trim()) return false
  if (input.biggestRefill === 'other' && !input.biggestRefillOther?.trim()) return false

  return WORK_CHECK_IN_QUESTIONS.every((question) => {
    if (!question.required) return true

    const value = input[question.id as keyof WorkCheckInInput]
    return value !== undefined && value !== null && value !== ''
  })
}

export function getWorkCheckInErrorMessage(error: unknown): string {
  if (error instanceof DuplicateWorkCheckInError) {
    return error.message
  }

  if (error instanceof IncompleteWorkCheckInError) {
    return error.message
  }

  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Unable to access your work check-in data. Make sure Firestore rules are deployed and you are signed in.'
    }

    if (error.code === 'unavailable') {
      return 'Work check-ins are temporarily unavailable. Check your connection and try again.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while saving your work check-in.'
}

export function subscribeToWorkCheckIns(
  userId: string,
  onData: (checkIns: WorkCheckIn[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const checkInsQuery = query(
    getWorkCheckInsCollection(userId),
    orderBy('date', 'desc'),
  )

  return onSnapshot(
    checkInsQuery,
    (snapshot) => {
      onData(
        snapshot.docs.map((entry) =>
          mapWorkCheckIn(entry.id, entry.data() as Record<string, unknown>),
        ),
      )
    },
    (error) => onError?.(error),
  )
}

export function subscribeToUserWorkProfile(
  userId: string,
  onData: (profile: UserWorkProfile) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    getUserRef(userId),
    (snapshot) => {
      const data = snapshot.data()
      onData(mapUserWorkProfile(data?.workProfile))
    },
    (error) => onError?.(error),
  )
}

export async function submitWorkCheckIn(
  userId: string,
  input: WorkCheckInInput,
  date = getTodayString(),
): Promise<WorkCheckIn> {
  if (!isWorkCheckInComplete(input)) {
    throw new IncompleteWorkCheckInError()
  }

  const checkInRef = getWorkCheckInRef(userId, date)
  const now = new Date().toISOString()

  // Ensure parent user doc exists for subcollection writes
  await setDoc(getUserRef(userId), { updatedAt: serverTimestamp() }, { merge: true })

  const payload: Omit<WorkCheckInDocument, 'createdAt'> & {
    createdAt: ReturnType<typeof serverTimestamp>
  } = {
    userId,
    organisationId: input.organisationId ?? null,
    date,
    checkInTime: now,
    createdAt: serverTimestamp(),
    energyTank: input.energyTank,
    maskingLoad: input.maskingLoad,
    supportFelt: input.supportFelt,
    biggestDrain: input.biggestDrain,
    biggestDrainOther:
      input.biggestDrain === 'other'
        ? input.biggestDrainOther?.trim() || null
        : null,
    biggestRefill: input.biggestRefill,
    biggestRefillOther:
      input.biggestRefill === 'other'
        ? input.biggestRefillOther?.trim() || null
        : null,
    mostDrainingTime: input.mostDrainingTime,
    ableToAskNeeds: input.ableToAskNeeds,
    accommodationWish: input.accommodationWish?.trim() || null,
    wouldUseAgain: null,
    notes: null,
  }

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(checkInRef)

    if (snapshot.exists()) {
      throw new DuplicateWorkCheckInError(date)
    }

    transaction.set(checkInRef, payload)
  })

  return {
    id: date,
    userId,
    organisationId: input.organisationId ?? null,
    date,
    checkInTime: now,
    createdAt: Timestamp.now(),
    energyTank: input.energyTank,
    maskingLoad: input.maskingLoad,
    supportFelt: input.supportFelt,
    biggestDrain: input.biggestDrain,
    biggestDrainOther:
      input.biggestDrain === 'other'
        ? input.biggestDrainOther?.trim() || null
        : null,
    biggestRefill: input.biggestRefill,
    biggestRefillOther:
      input.biggestRefill === 'other'
        ? input.biggestRefillOther?.trim() || null
        : null,
    mostDrainingTime: input.mostDrainingTime,
    ableToAskNeeds: input.ableToAskNeeds,
    accommodationWish: input.accommodationWish?.trim() || null,
    wouldUseAgain: null,
    notes: null,
  }
}

export async function fetchWorkCheckInForDate(
  userId: string,
  date = getTodayString(),
): Promise<WorkCheckIn | null> {
  const snapshot = await getDoc(getWorkCheckInRef(userId, date))
  if (!snapshot.exists()) return null

  return mapWorkCheckIn(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export function getWorkCheckInForDate(
  checkIns: WorkCheckIn[],
  date: string,
): WorkCheckIn | null {
  return checkIns.find((checkIn) => checkIn.date === date) ?? null
}

export function hasWorkCheckInForDate(
  checkIns: WorkCheckIn[],
  date = getTodayString(),
): boolean {
  return checkIns.some((checkIn) => checkIn.date === date)
}

export function getCheckInsForDateRange(
  checkIns: WorkCheckIn[],
  startDate: string,
  endDate: string,
): WorkCheckIn[] {
  return checkIns
    .filter((checkIn) => checkIn.date >= startDate && checkIn.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))
}
