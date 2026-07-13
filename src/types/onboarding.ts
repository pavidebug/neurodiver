export type WorkStatus = 'working' | 'student' | 'job-seeking' | 'other'

export type NdStatus =
  | 'diagnosed'
  | 'self-identify'
  | 'exploring'
  | 'supporting'
  | 'not-nd'
  | 'prefer-not-to-say'

export type AgeRange =
  | 'under-18'
  | '18-24'
  | '25-34'
  | '35-44'
  | '45-54'
  | '55-plus'
  | 'prefer-not-to-say'

export type Profession =
  | 'student'
  | 'working-professional'
  | 'manager'
  | 'executive'
  | 'founder'
  | 'freelancer'
  | 'consultant'
  | 'creative'
  | 'engineer'
  | 'technology'
  | 'individual-contributor'
  | 'finance'
  | 'hr'
  | 'educator'
  | 'healthcare'
  | 'government'
  | 'looking-for-work'
  | 'other'

export type WorkEnvironment =
  | 'office'
  | 'hybrid'
  | 'remote'
  | 'shift-work'
  | 'freelance'
  | 'university'
  | 'home'

export type BroughtHereReason =
  | 'overwhelmed-at-work'
  | 'struggle-to-start'
  | 'lose-focus'
  | 'burn-out-quickly'
  | 'understand-myself'
  | 'support-someone'
  | 'just-curious'

export type FamiliarExperience =
  | 'starting-tasks-difficult'
  | 'hyperfocus'
  | 'forget-things'
  | 'meetings-drain'
  | 'noise-overwhelms'
  | 'switching-tasks-difficult'
  | 'time-blindness'
  | 'perfectionism'
  | 'decision-paralysis'
  | 'emotional-overwhelm'
  | 'burnout-cycles'
  | 'procrastination'

export type WorkLocation =
  | 'office'
  | 'hybrid'
  | 'remote'
  | 'student'
  | 'freelancer'
  | 'shift-work'
  | 'other'

export type EnergyDrain =
  | 'meetings'
  | 'emails'
  | 'starting-work'
  | 'prioritising'
  | 'context-switching'
  | 'deadlines'
  | 'social-interaction'
  | 'noise'
  | 'interruptions'
  | 'admin-work'
  | 'remembering-everything'

export type PeakEnergyTime = 'morning' | 'afternoon' | 'evening' | 'varies'

export type SupportStyle =
  | 'gentle-encouragement'
  | 'practical-advice'
  | 'coaching-style'
  | 'scientific-explanations'
  | 'just-tell-me'

export type InformationPreference = 'short' | 'medium' | 'detailed'

export type SuccessGoal =
  | 'less-overwhelmed'
  | 'finish-more-work'
  | 'understand-myself'
  | 'prevent-burnout'
  | 'build-routines'
  | 'work-life-balance'

export type GenderOption =
  | 'woman'
  | 'man'
  | 'non-binary'
  | 'prefer-not-to-say'

export type OnboardingChallenge =
  | 'starting-tasks'
  | 'prioritising'
  | 'switching-tasks'
  | 'remembering-things'
  | 'time-blindness'
  | 'sensory-overwhelm'
  | 'meetings'
  | 'burnout'
  | 'emotional-regulation'
  | 'focus'
  | 'planning'
  | 'procrastination'
  | 'communication'
  | 'sleep'
  | 'work-life-balance'

export type OnboardingGoal =
  | 'reduce-burnout'
  | 'improve-focus'
  | 'build-routines'
  | 'understand-myself'
  | 'discover-strategies'
  | 'feel-less-overwhelmed'
  | 'improve-performance'
  | 'build-habits'
  | 'work-life-balance'

export type AccessibilityPreference =
  | 'reduced-animations'
  | 'larger-text'
  | 'high-contrast'
  | 'fewer-notifications'
  | 'simplified-interface'
  | 'dark-mode'
  | 'none'

export type NotificationPreference =
  | 'never'
  | 'when-i-ask'
  | 'daily'
  | 'weekdays'
  | 'weekly'

export interface OnboardingOption<T extends string = string> {
  value: T
  label: string
}

export interface OnboardingAnswers {
  displayName: string
  whatBroughtYouHere: BroughtHereReason | null
  ndStatus: NdStatus | null
  familiarExperiences: FamiliarExperience[]
  workLocation: WorkLocation | null
  profession: Profession | null
  energyDrains: EnergyDrain[]
  peakEnergyTime: PeakEnergyTime | null
  supportStyle: SupportStyle | null
  informationPreference: InformationPreference | null
  successGoals: SuccessGoal[]
  ageRange: AgeRange | null
  gender: GenderOption | null
  country: string
  workStatus: WorkStatus | null
  workEnvironment: WorkEnvironment[]
  challenges: OnboardingChallenge[]
  goals: OnboardingGoal[]
  accessibilityPreferences: AccessibilityPreference[]
  notificationPreference: NotificationPreference | null
}

export const EMPTY_ONBOARDING_ANSWERS: OnboardingAnswers = {
  displayName: '',
  whatBroughtYouHere: null,
  ndStatus: null,
  familiarExperiences: [],
  workLocation: null,
  profession: null,
  energyDrains: [],
  peakEnergyTime: null,
  supportStyle: null,
  informationPreference: null,
  successGoals: [],
  ageRange: null,
  gender: null,
  country: '',
  workStatus: null,
  workEnvironment: [],
  challenges: [],
  goals: [],
  accessibilityPreferences: [],
  notificationPreference: null,
}
