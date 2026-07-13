import type { Timestamp } from 'firebase/firestore'
import type { BrainStatusType } from '@/lib/data'
import type { PulseMood } from '@/types/pulse-check-in'

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

export type AccommodationOption =
  | 'quiet-space'
  | 'flexible-schedule'
  | 'fewer-meetings'
  | 'written-instructions'
  | 'async-communication'
  | 'regular-breaks'
  | 'fewer-interruptions'
  | 'clearer-expectations'
  | 'predictable-routine'
  | 'workload-adjustment'
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

export type WeeklyReportStatusLabel = 'Stable' | 'Watch closely' | 'Needs support'

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
  drains: DrainOption[]
  drainsOther: string | null
  refills: RefillOption[]
  refillsOther: string | null
  mostDrainingTime: DrainingTimeOption
  ableToAskNeeds: AbleToAskNeedsOption
  accommodationNeeds: AccommodationOption[]
  accommodationNeedsOther: string | null
  freeTextReflection: string | null
  wouldUseAgain: number
  brainStatus: BrainStatusType
  isGuest: boolean
  /** Pulse check-in fields (type: daily) */
  checkInType?: 'daily' | 'legacy'
  mood?: PulseMood | null
  energy?: number | null
  focus?: number | null
  stress?: number | null
  optionalNote?: string | null
}

/** Payload submitted from the check-in form */
export interface WorkCheckInInput {
  energyTank: number
  maskingLoad: number
  supportFelt: number
  drains: DrainOption[]
  drainsOther?: string
  refills: RefillOption[]
  refillsOther?: string
  mostDrainingTime: DrainingTimeOption
  ableToAskNeeds: AbleToAskNeedsOption
  accommodationNeeds: AccommodationOption[]
  accommodationNeedsOther?: string
  freeTextReflection?: string
  wouldUseAgain: number
  organisationId?: string | null
}

/** Client-facing check-in with document id (same as date) */
export interface WorkCheckIn extends WorkCheckInDocument {
  id: string
}

/** In-progress answers saved locally until submission */
export type WorkCheckInDraftAnswers = Partial<WorkCheckInInput>

import type {
  AccessibilityPreference,
  AgeRange,
  BroughtHereReason,
  EnergyDrain,
  FamiliarExperience,
  GenderOption,
  InformationPreference,
  NdStatus,
  NotificationPreference,
  OnboardingChallenge,
  OnboardingGoal,
  PeakEnergyTime,
  Profession,
  SuccessGoal,
  SupportStyle,
  WorkEnvironment,
  WorkLocation,
  WorkStatus,
} from '@/types/onboarding'

export type { WorkStatus }

export type ReminderPreference = 'email' | 'whatsapp' | 'both'

/**
 * Pilot profile fields on users/{userId}.workProfile
 * Contact fields are private — only readable by the signed-in user (Firestore rules).
 */
export interface UserWorkProfile {
  organisationId: string | null
  role: UserRole
  timezone: string
  reminderEnabled: boolean
  reminderTime: string
  email: string | null
  whatsappNumber: string | null
  whatsappConsent: boolean
  reminderPreference: ReminderPreference
  /** Optional self-description or diagnosis context for reports */
  selfDescription: string | null
  /** Pilot users can view full weekly reports; future paid tier uses this flag */
  pilotAccess: boolean
  /** Onboarding — preferred name shown across the app */
  displayName: string | null
  ndStatus: NdStatus | null
  whatBroughtYouHere: BroughtHereReason | null
  familiarExperiences: FamiliarExperience[]
  workLocation: WorkLocation | null
  energyDrains: EnergyDrain[]
  peakEnergyTime: PeakEnergyTime | null
  supportStyle: SupportStyle | null
  informationPreference: InformationPreference | null
  successGoals: SuccessGoal[]
  gender: GenderOption | null
  country: string | null
  /** Simplified onboarding work status */
  workStatus: WorkStatus | null
  ageRange: AgeRange | null
  profession: Profession | null
  workEnvironment: WorkEnvironment[]
  challenges: OnboardingChallenge[]
  goals: OnboardingGoal[]
  accessibilityPreferences: AccessibilityPreference[]
  notificationPreference: NotificationPreference | null
  onboardingCompleted: boolean
}

export const DEFAULT_USER_WORK_PROFILE: UserWorkProfile = {
  organisationId: null,
  role: 'employee',
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  reminderEnabled: true,
  reminderTime: '17:00',
  email: null,
  whatsappNumber: null,
  whatsappConsent: false,
  reminderPreference: 'email',
  selfDescription: null,
  pilotAccess: true,
  displayName: null,
  ndStatus: null,
  whatBroughtYouHere: null,
  familiarExperiences: [],
  workLocation: null,
  energyDrains: [],
  peakEnergyTime: null,
  supportStyle: null,
  informationPreference: null,
  successGoals: [],
  gender: null,
  country: null,
  workStatus: null,
  ageRange: null,
  profession: null,
  workEnvironment: [],
  challenges: [],
  goals: [],
  accessibilityPreferences: [],
  notificationPreference: null,
  onboardingCompleted: false,
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

export interface WeeklyReportEnergyPoint {
  date: string
  energyTank: number | null
  maskingLoad: number | null
}

export interface WeeklyReportRankedOption {
  option: string
  label: string
  count: number
}

/** Cached employee weekly report at users/{userId}/weeklyReports/{weekId} */
export interface WeeklyReportDocument {
  weekId: string
  weekStart: string
  weekEnd: string
  weekNumber: number
  generatedAt: Timestamp
  /** Fingerprint of source check-ins — used to skip unnecessary regeneration */
  sourceFingerprint: string
  checkInCount: number
  profile: {
    displayName: string | null
    selfDescription: string | null
    email: string | null
    daysCompleted: number
    statusLabel: WeeklyReportStatusLabel
  }
  averages: {
    energyTank: number
    maskingLoad: number
    supportFelt: number
    wouldUseAgain: number
  }
  energyCurve: WeeklyReportEnergyPoint[]
  insights: {
    summary: string
    lowestEnergyDay: string | null
    highestMaskingDay: string | null
    bestRecoveryDay: string | null
    relationshipNote: string
  }
  topDrains: WeeklyReportRankedOption[]
  topRefills: WeeklyReportRankedOption[]
  maskingSummary: string
  accommodationSummary: string
  recommendation: string
  noteForWeek: string
}

export interface WeeklyReport extends WeeklyReportDocument {
  id: string
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
}

export interface WorkCheckInMultiChoiceQuestion extends WorkCheckInQuestionBase {
  type: 'multi-choice'
  options: WorkCheckInQuestionOption[]
  otherDetailField?: 'drainsOther' | 'refillsOther' | 'accommodationNeedsOther'
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
  | WorkCheckInMultiChoiceQuestion
  | WorkCheckInTextQuestion

export const WEEKLY_REPORT_MIN_CHECK_INS = 5
