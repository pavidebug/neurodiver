import { FirebaseError } from 'firebase/app'
import {
  doc,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  type Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import {
  calculateBrainStatus,
  CHECK_IN_QUESTIONS,
  type BrainStatus,
  type BrainStatusType,
  type EnergyEntry,
} from '@/lib/data'
import { getTodayString } from '@/lib/dates'
import { db } from '@/lib/firebase'

export class DuplicateCheckInError extends Error {
  constructor(date = getTodayString()) {
    super(`You already completed your check-in for ${date}.`)
    this.name = 'DuplicateCheckInError'
  }
}

export class IncompleteCheckInError extends Error {
  constructor() {
    super('Please answer all check-in questions before submitting.')
    this.name = 'IncompleteCheckInError'
  }
}

export function getFirestoreErrorMessage(error: unknown): string {
  if (error instanceof DuplicateCheckInError) {
    return error.message
  }

  if (error instanceof IncompleteCheckInError) {
    return error.message
  }

  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Unable to access your check-in data. Make sure Firestore rules are deployed and you are signed in.'
    }

    if (error.code === 'unavailable') {
      return 'Firestore is temporarily unavailable. Check your connection and try again.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while saving your check-in. Please try again.'
}

export interface StoredCheckIn {
  answers: Record<string, number>
  status: BrainStatusType
  average: number
  completedAt: Timestamp
  intention?: string
}

export interface UserCheckInDocument {
  lastCheckIn: string | null
  checkIns: Record<string, StoredCheckIn>
}

export interface SubmitCheckInResult {
  brainStatus: BrainStatus
  entry: EnergyEntry
  date: string
}

function getUserRef(userId: string) {
  return doc(db, 'users', userId)
}

function calculateAverage(answers: Record<string, number>): number {
  const values = Object.values(answers)
  if (values.length === 0) return 0

  const sum = values.reduce((total, value) => total + value, 0)
  return Math.round((sum / values.length) * 10) / 10
}

function isCheckInComplete(answers: Record<string, number>): boolean {
  return CHECK_IN_QUESTIONS.every((question) => answers[question.id] !== undefined)
}

function toEnergyEntry(date: string, checkIn: StoredCheckIn): EnergyEntry {
  return {
    date,
    status: checkIn.status,
    average: checkIn.average,
  }
}

export function mapCheckInsToEnergyHistory(
  checkIns: Record<string, StoredCheckIn>,
): EnergyEntry[] {
  return Object.entries(checkIns)
    .map(([date, checkIn]) => toEnergyEntry(date, checkIn))
    .sort((a, b) => a.date.localeCompare(b.date))
}

export function getBrainStatusForDate(
  checkIns: Record<string, StoredCheckIn>,
  date: string,
): BrainStatus | null {
  const checkIn = checkIns[date]
  if (!checkIn) return null

  return calculateBrainStatus(checkIn.answers)
}

export function subscribeToUserCheckIns(
  userId: string,
  onData: (data: UserCheckInDocument) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    getUserRef(userId),
    (snapshot) => {
      const data = snapshot.data()
      onData({
        lastCheckIn: data?.lastCheckIn ?? null,
        checkIns: (data?.checkIns as Record<string, StoredCheckIn>) ?? {},
      })
    },
    (error) => {
      onError?.(error)
    },
  )
}

export async function submitDailyCheckIn(
  userId: string,
  answers: Record<string, number>,
  date = getTodayString(),
): Promise<SubmitCheckInResult> {
  if (!isCheckInComplete(answers)) {
    throw new IncompleteCheckInError()
  }

  const brainStatus = calculateBrainStatus(answers)
  const average = calculateAverage(answers)
  const userRef = getUserRef(userId)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(userRef)
    const existingCheckIn = snapshot.data()?.checkIns?.[date]

    if (existingCheckIn) {
      throw new DuplicateCheckInError(date)
    }

    transaction.set(
      userRef,
      {
        lastCheckIn: date,
        [`checkIns.${date}`]: {
          answers,
          status: brainStatus.type,
          average,
          completedAt: serverTimestamp(),
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  })

  return {
    brainStatus,
    entry: {
      date,
      status: brainStatus.type,
      average,
    },
    date,
  }
}

export function calculateStreak(
  energyHistory: EnergyEntry[],
  today = getTodayString(),
): number {
  const dates = new Set(energyHistory.map((entry) => entry.date))
  let streak = 0
  const cursor = new Date(`${today}T12:00:00`)

  while (true) {
    const dateStr = getTodayString(cursor)
    if (!dates.has(dateStr)) break
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

export async function saveDailyIntention(
  userId: string,
  intention: string,
  date = getTodayString(),
): Promise<void> {
  const trimmed = intention.trim()
  const userRef = getUserRef(userId)

  await setDoc(
    userRef,
    {
      [`checkIns.${date}.intention`]: trimmed,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
