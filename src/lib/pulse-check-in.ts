import {
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import type { BrainStatusType } from '@/lib/data'
import { getTodayString } from '@/lib/dates'
import { db } from '@/lib/firebase'
import { trackAnalyticsEvent } from '@/lib/product-analytics'
import {
  DuplicateWorkCheckInError,
  getUserRef,
  getWorkCheckInRef,
} from '@/lib/work-check-ins'
import type { WorkCheckIn } from '@/types/work-energy'
import type { DailyPulseInput, PulseMood } from '@/types/pulse-check-in'

function deriveBrainStatus(energy: number): BrainStatusType {
  if (energy >= 5) return 'high-energy'
  if (energy >= 4) return 'steady'
  if (energy >= 3) return 'steady'
  if (energy >= 2) return 'running-low'
  return 'recovery-needed'
}

export function getMonthlyCheckInCount(checkIns: WorkCheckIn[], date = new Date()): number {
  const month = date.getMonth()
  const year = date.getFullYear()

  return checkIns.filter((checkIn) => {
    const [y, m] = checkIn.date.split('-').map(Number)
    return y === year && m - 1 === month
  }).length
}

export function isPulseComplete(input: Partial<DailyPulseInput>): input is DailyPulseInput {
  return (
    typeof input.mood === 'string' &&
    typeof input.energy === 'number' &&
    input.energy >= 1 &&
    input.energy <= 5 &&
    typeof input.focus === 'number' &&
    input.focus >= 1 &&
    input.focus <= 5 &&
    typeof input.stress === 'number' &&
    input.stress >= 1 &&
    input.stress <= 5
  )
}

export async function submitDailyPulseCheckIn(
  userId: string,
  input: DailyPulseInput,
  options: { date?: string; isGuest?: boolean; organisationId?: string | null } = {},
): Promise<WorkCheckIn> {
  const date = options.date ?? getTodayString()
  const isGuest = options.isGuest ?? false
  const now = new Date().toISOString()
  const brainStatus = deriveBrainStatus(input.energy)
  const checkInRef = getWorkCheckInRef(userId, date)

  await setDoc(getUserRef(userId), { updatedAt: serverTimestamp() }, { merge: true })

  const payload = {
    type: 'daily' as const,
    userId,
    organisationId: options.organisationId ?? null,
    date,
    checkInTime: now,
    createdAt: serverTimestamp(),
    mood: input.mood as PulseMood,
    energy: input.energy,
    focus: input.focus,
    stress: input.stress,
    optionalNote: input.optionalNote?.trim() || null,
    energyTank: input.energy,
    maskingLoad: Math.max(1, 6 - input.stress),
    supportFelt: 3,
    drains: [],
    drainsOther: null,
    refills: [],
    refillsOther: null,
    mostDrainingTime: 'midday' as const,
    ableToAskNeeds: 'not-needed' as const,
    accommodationNeeds: [],
    accommodationNeedsOther: null,
    freeTextReflection: input.optionalNote?.trim() || null,
    wouldUseAgain: 3,
    brainStatus,
    isGuest,
  }

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(checkInRef)
    if (snapshot.exists()) {
      throw new DuplicateWorkCheckInError(date)
    }
    transaction.set(checkInRef, payload)
  })

  void trackAnalyticsEvent(userId, 'completed_check_in', { date, type: 'daily' })

  return {
    id: date,
    ...payload,
    createdAt: Timestamp.now(),
    focus: input.focus,
    stress: input.stress,
    mood: input.mood,
    optionalNote: input.optionalNote?.trim() || null,
    checkInType: 'daily',
  } as WorkCheckIn
}
