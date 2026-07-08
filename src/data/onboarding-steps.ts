import type {
  AccessibilityPreference,
  AgeRange,
  NdStatus,
  NotificationPreference,
  OnboardingChallenge,
  OnboardingGoal,
  Profession,
  WorkEnvironment,
} from '@/types/onboarding'

export interface OnboardingOption<T extends string = string> {
  value: T
  label: string
}

export const ND_STATUS_OPTIONS: OnboardingOption<NdStatus>[] = [
  { value: 'diagnosed', label: 'Diagnosed neurodivergent' },
  { value: 'self-identify', label: 'Self-identify as neurodivergent' },
  { value: 'exploring', label: 'Exploring whether I’m neurodivergent' },
  { value: 'supporting', label: 'Supporting someone who is neurodivergent' },
  { value: 'not-nd', label: 'I’m not neurodivergent' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

export const AGE_RANGE_OPTIONS: OnboardingOption<AgeRange>[] = [
  { value: 'under-18', label: 'Under 18' },
  { value: '18-24', label: '18–24' },
  { value: '25-34', label: '25–34' },
  { value: '35-44', label: '35–44' },
  { value: '45-54', label: '45–54' },
  { value: '55-plus', label: '55+' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

export const PROFESSION_OPTIONS: OnboardingOption<Profession>[] = [
  { value: 'student', label: 'Student' },
  { value: 'working-professional', label: 'Working professional' },
  { value: 'manager', label: 'Manager' },
  { value: 'executive', label: 'Executive' },
  { value: 'founder', label: 'Founder' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'consultant', label: 'Consultant' },
  { value: 'creative', label: 'Creative' },
  { value: 'engineer', label: 'Engineer' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'HR' },
  { value: 'educator', label: 'Educator' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'government', label: 'Government' },
  { value: 'looking-for-work', label: 'Looking for work' },
  { value: 'other', label: 'Other' },
]

export const WORK_ENVIRONMENT_OPTIONS: OnboardingOption<WorkEnvironment>[] = [
  { value: 'office', label: 'Office' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
  { value: 'shift-work', label: 'Shift work' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'university', label: 'University' },
  { value: 'home', label: 'Home' },
]

export const CHALLENGE_OPTIONS: OnboardingOption<OnboardingChallenge>[] = [
  { value: 'starting-tasks', label: 'Starting tasks' },
  { value: 'prioritising', label: 'Prioritising' },
  { value: 'switching-tasks', label: 'Switching between tasks' },
  { value: 'remembering-things', label: 'Remembering things' },
  { value: 'time-blindness', label: 'Time blindness' },
  { value: 'sensory-overwhelm', label: 'Sensory overwhelm' },
  { value: 'meetings', label: 'Meetings' },
  { value: 'burnout', label: 'Burnout' },
  { value: 'emotional-regulation', label: 'Emotional regulation' },
  { value: 'focus', label: 'Focus' },
  { value: 'planning', label: 'Planning' },
  { value: 'procrastination', label: 'Procrastination' },
  { value: 'communication', label: 'Communication' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'work-life-balance', label: 'Work-life balance' },
]

export const GOAL_OPTIONS: OnboardingOption<OnboardingGoal>[] = [
  { value: 'reduce-burnout', label: 'Reduce burnout' },
  { value: 'improve-focus', label: 'Improve focus' },
  { value: 'build-routines', label: 'Build routines' },
  { value: 'understand-myself', label: 'Understand myself better' },
  { value: 'discover-strategies', label: 'Discover strategies' },
  { value: 'feel-less-overwhelmed', label: 'Feel less overwhelmed' },
  { value: 'improve-performance', label: 'Improve work performance' },
  { value: 'build-habits', label: 'Build sustainable habits' },
]

export const ACCESSIBILITY_OPTIONS: OnboardingOption<AccessibilityPreference>[] = [
  { value: 'reduced-animations', label: 'Reduced animations' },
  { value: 'larger-text', label: 'Larger text' },
  { value: 'high-contrast', label: 'High contrast' },
  { value: 'fewer-notifications', label: 'Fewer notifications' },
  { value: 'simplified-interface', label: 'Simplified interface' },
  { value: 'dark-mode', label: 'Dark mode' },
  { value: 'none', label: 'None for now' },
]

export const NOTIFICATION_OPTIONS: OnboardingOption<NotificationPreference>[] = [
  { value: 'never', label: 'Never' },
  { value: 'when-i-ask', label: 'Only when I ask' },
  { value: 'daily', label: 'Daily' },
  { value: 'weekdays', label: 'Weekdays only' },
  { value: 'weekly', label: 'Weekly' },
]

export const ONBOARDING_TOTAL_STEPS = 10
export const ONBOARDING_CHALLENGE_LIMIT = 5

export const ONBOARDING_TAGLINE =
  'Let’s get to know how you work best, so NeuroDiver can adapt to you — not the other way around.'
