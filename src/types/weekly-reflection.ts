import type { Timestamp } from 'firebase/firestore'

export type WeeklySummaryId =
  | 'more-good-than-difficult'
  | 'mix-of-ups-and-downs'
  | 'mostly-heavy'
  | 'learned-what-works'
  | 'still-making-sense'

export type NextWeekIntentionId =
  | 'protect-mornings'
  | 'take-proper-breaks'
  | 'plan-week-earlier'
  | 'reduce-distractions'
  | 'ask-for-clarification'
  | 'join-focus-together'
  | 'decide-later'

export type WeeklyResetChipId = string

/** Guided Weekly Reset submission */
export interface WeeklyReflectionInput {
  weeklySummary: WeeklySummaryId
  energyGivers: WeeklyResetChipId[]
  energyDrains: WeeklyResetChipId[]
  supportNeeds: WeeklyResetChipId[]
  nextWeekIntention: NextWeekIntentionId
  futureYouNote?: string
  energyGiversOther?: string
  energyDrainsOther?: string
  supportNeedsOther?: string
}

export interface WeeklyReflectionDocument extends WeeklyReflectionInput {
  type: 'weekly'
  userId: string
  weekStart: string
  weekId: string
  createdAt: Timestamp
  /** Legacy free-text fields — preserved when reading older documents */
  gaveEnergy?: string
  drainedEnergy?: string
  strategyHelped?: string
  supportNeeded?: string
  patternNoticed?: string
}

export interface WeeklyReflection extends WeeklyReflectionDocument {
  id: string
}

export function isWeeklyResetComplete(input: Partial<WeeklyReflectionInput>): input is WeeklyReflectionInput {
  return (
    typeof input.weeklySummary === 'string' &&
    Array.isArray(input.energyGivers) &&
    input.energyGivers.length > 0 &&
    Array.isArray(input.energyDrains) &&
    input.energyDrains.length > 0 &&
    Array.isArray(input.supportNeeds) &&
    input.supportNeeds.length > 0 &&
    typeof input.nextWeekIntention === 'string'
  )
}
