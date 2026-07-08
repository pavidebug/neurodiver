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

export interface OnboardingAnswers {
  displayName: string
  ndStatus: NdStatus | null
  ageRange: AgeRange | null
  profession: Profession | null
  workEnvironment: WorkEnvironment[]
  challenges: OnboardingChallenge[]
  goals: OnboardingGoal[]
  accessibilityPreferences: AccessibilityPreference[]
  notificationPreference: NotificationPreference | null
}

export const EMPTY_ONBOARDING_ANSWERS: OnboardingAnswers = {
  displayName: '',
  ndStatus: null,
  ageRange: null,
  profession: null,
  workEnvironment: [],
  challenges: [],
  goals: [],
  accessibilityPreferences: [],
  notificationPreference: null,
}
