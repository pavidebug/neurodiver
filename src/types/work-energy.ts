import type { Timestamp } from 'firebase/firestore'

export type UserRole = 'employee' | 'employer_admin' | 'super_admin'

export type DrainOption =
  | 'too-many-meetings'
  | 'too-many-tasks'
  | 'unexpected-changes'
  | 'too-many-interruptions'
  | 'noise'
  | 'social-interaction'
  | 'trying-to-keep-up'
  | 'unclear-expectations'
  | 'time-pressure'
  | 'other'

export type RefillOption =
  | 'quiet-time'
  | 'finished-something'
  | 'deep-work'
  | 'supportive-teammate'
  | 'breaks'
  | 'movement'
  | 'food-or-coffee'
  | 'listening-to-music'
  | 'clear-plan'
  | 'other'

export type DrainingTimeOption =
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'end-of-day'
  | 'after-work'

export type AbleToAskNeedsOption =
  | 'yes'
  | 'mostly'
  | 'not-really'
  | 'no'
  | 'not-needed'

/** Stored at users/{userId}/workCheckIns/{date} */
export interface WorkCheckInDocument {
  userId: string
  organisationId: string | null
  date: string
  checkInTime: string
  createdAt: Timestamp
  energyTank: number
  maskingLoad: number
  supportFelt: number
  biggestDrain: DrainOption
  biggestDrainOther: string | null
  biggestRefill: RefillOption
  biggestRefillOther: string | null
  mostDrainingTime: DrainingTimeOption
  ableToAskNeeds: AbleToAskNeedsOption
  accommodationWish: string | null
  wouldUseAgain: number | null
  notes: string | null
}

/** Payload submitted from the check-in form */
export interface WorkCheckInInput {
  energyTank: number
  maskingLoad: number
  supportFelt: number
  biggestDrain: DrainOption
  biggestDrainOther?: string
  biggestRefill: RefillOption
  biggestRefillOther?: string
  mostDrainingTime: DrainingTimeOption
  ableToAskNeeds: AbleToAskNeedsOption
  accommodationWish?: string
  organisationId?: string | null
}

/** Client-facing check-in with document id (same as date) */
export interface WorkCheckIn extends WorkCheckInDocument {
  id: string
}

/** In-progress answers saved locally until submission */
export type WorkCheckInDraftAnswers = Partial<WorkCheckInInput>

/**
 * Pilot profile fields on users/{userId}.
 * Reminder fields are stored now for future scheduled email reminders.
 */
export interface UserWorkProfile {
  organisationId: string | null
  role: UserRole
  timezone: string
  reminderEnabled: boolean
  reminderTime: string
}

export const DEFAULT_USER_WORK_PROFILE: UserWorkProfile = {
  organisationId: null,
  role: 'employee',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  reminderEnabled: false,
  reminderTime: '17:00',
}

export interface OrganisationDocument {
  name: string
  createdAt: Timestamp
}

export interface OrganisationMemberDocument {
  role: UserRole
  joinedAt: Timestamp
}

/** Reserved for Phase E — employer aggregate reports */
export interface EmployerAggregateReportDocument {
  periodType: 'weekly' | 'monthly'
  periodStart: string
  periodEnd: string
  participantCount: number
  avgEnergyTank: number
  avgMaskingLoad: number
  avgSupportFelt: number
  avgWouldUseAgain: number
  topDrains: Array<{ option: DrainOption; count: number }>
  topRefills: Array<{ option: RefillOption; count: number }>
  commonAccommodationThemes: string[]
  burnoutRiskIndicator: 'low' | 'moderate' | 'elevated'
  suggestedImprovements: string[]
  generatedAt: Timestamp
}

/** Reserved for Phase D — cached employee weekly reports */
export interface WeeklyReportDocument {
  weekId: string
  weekStart: string
  weekEnd: string
  generatedAt: Timestamp
}

/** Reserved for Phase D — cached employee monthly reports */
export interface MonthlyReportDocument {
  monthId: string
  month: string
  generatedAt: Timestamp
}

export interface WorkCheckInScaleOption {
  value: number
  label: string
  emoji?: string
}

export interface WorkCheckInQuestionOption {
  value: string
  label: string
}

export interface WorkCheckInQuestionBase {
  id: keyof WorkCheckInInput
  question: string
  helper: string
  required: boolean
}

export interface WorkCheckInLabeledScaleQuestion extends WorkCheckInQuestionBase {
  type: 'labeled-scale'
  options: WorkCheckInScaleOption[]
}

export interface WorkCheckInChoiceQuestion extends WorkCheckInQuestionBase {
  type: 'choice'
  options: WorkCheckInQuestionOption[]
  /** When selected option is "other", collect free-text detail */
  otherDetailField?: 'biggestDrainOther' | 'biggestRefillOther'
  otherDetailPlaceholder?: string
}

export interface WorkCheckInTextQuestion extends WorkCheckInQuestionBase {
  type: 'text'
  placeholder: string
  maxLength: number
}

export type WorkCheckInQuestion =
  | WorkCheckInLabeledScaleQuestion
  | WorkCheckInChoiceQuestion
  | WorkCheckInTextQuestion
