import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { getWeekId, getWeekStart, getTodayString } from '@/lib/dates'
import { db } from '@/lib/firebase'
import type {
  NextWeekIntentionId,
  WeeklyReflection,
  WeeklyReflectionInput,
  WeeklySummaryId,
} from '@/types/weekly-reflection'

function getWeeklyReflectionRef(userId: string, weekId: string) {
  return doc(db, 'users', userId, 'weeklyReflections', weekId)
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

function mapWeeklyReflectionDocument(
  id: string,
  data: Record<string, unknown>,
  userId: string,
): WeeklyReflection {
  const hasNewShape = typeof data.weeklySummary === 'string'

  return {
    id,
    type: 'weekly',
    userId: String(data.userId ?? userId),
    weekStart: String(data.weekStart ?? ''),
    weekId: id,
    weeklySummary: hasNewShape
      ? (String(data.weeklySummary) as WeeklySummaryId)
      : 'still-making-sense',
    energyGivers: hasNewShape ? asStringArray(data.energyGivers) : [],
    energyDrains: hasNewShape ? asStringArray(data.energyDrains) : [],
    supportNeeds: hasNewShape ? asStringArray(data.supportNeeds) : [],
    nextWeekIntention: hasNewShape
      ? (String(data.nextWeekIntention) as NextWeekIntentionId)
      : 'decide-later',
    futureYouNote:
      typeof data.futureYouNote === 'string'
        ? data.futureYouNote
        : typeof data.patternNoticed === 'string'
          ? data.patternNoticed
          : undefined,
    energyGiversOther:
      typeof data.energyGiversOther === 'string' ? data.energyGiversOther : undefined,
    energyDrainsOther:
      typeof data.energyDrainsOther === 'string' ? data.energyDrainsOther : undefined,
    supportNeedsOther:
      typeof data.supportNeedsOther === 'string' ? data.supportNeedsOther : undefined,
    gaveEnergy: typeof data.gaveEnergy === 'string' ? data.gaveEnergy : undefined,
    drainedEnergy: typeof data.drainedEnergy === 'string' ? data.drainedEnergy : undefined,
    strategyHelped:
      typeof data.strategyHelped === 'string' ? data.strategyHelped : undefined,
    supportNeeded: typeof data.supportNeeded === 'string' ? data.supportNeeded : undefined,
    patternNoticed:
      typeof data.patternNoticed === 'string' ? data.patternNoticed : undefined,
    createdAt: data.createdAt as WeeklyReflection['createdAt'],
  }
}

export function subscribeToWeeklyReflection(
  userId: string,
  weekId: string,
  onData: (reflection: WeeklyReflection | null) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    getWeeklyReflectionRef(userId, weekId),
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null)
        return
      }

      onData(mapWeeklyReflectionDocument(snapshot.id, snapshot.data(), userId))
    },
    (error) => onError?.(error),
  )
}

export async function fetchWeeklyReflectionForWeek(
  userId: string,
  weekId = getWeekId(),
): Promise<WeeklyReflection | null> {
  const snapshot = await getDoc(getWeeklyReflectionRef(userId, weekId))
  if (!snapshot.exists()) return null

  return mapWeeklyReflectionDocument(snapshot.id, snapshot.data(), userId)
}

export async function submitWeeklyReflection(
  userId: string,
  input: WeeklyReflectionInput,
): Promise<WeeklyReflection> {
  const weekId = getWeekId()
  const weekStart = getTodayString(getWeekStart())
  const ref = getWeeklyReflectionRef(userId, weekId)

  await setDoc(ref, {
    type: 'weekly',
    userId,
    weekStart,
    weekId,
    weeklySummary: input.weeklySummary,
    energyGivers: input.energyGivers,
    energyDrains: input.energyDrains,
    supportNeeds: input.supportNeeds,
    nextWeekIntention: input.nextWeekIntention,
    futureYouNote: input.futureYouNote?.trim() || null,
    energyGiversOther: input.energyGiversOther?.trim() || null,
    energyDrainsOther: input.energyDrainsOther?.trim() || null,
    supportNeedsOther: input.supportNeedsOther?.trim() || null,
    createdAt: serverTimestamp(),
  })

  const snapshot = await getDoc(ref)
  return mapWeeklyReflectionDocument(weekId, snapshot.data()!, userId)
}
