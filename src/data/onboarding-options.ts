import type {
  AgeRange,
  BroughtHereReason,
  EnergyDrain,
  FamiliarExperience,
  GenderOption,
  InformationPreference,
  NdStatus,
  OnboardingOption,
  PeakEnergyTime,
  Profession,
  SuccessGoal,
  SupportStyle,
  WorkLocation,
} from '@/types/onboarding'

export const BROUGHT_HERE_OPTIONS: OnboardingOption<BroughtHereReason>[] = [
  { value: 'overwhelmed-at-work', label: 'I often feel overwhelmed at work' },
  { value: 'struggle-to-start', label: 'I struggle to get started' },
  { value: 'lose-focus', label: 'I lose focus easily' },
  { value: 'burn-out-quickly', label: 'I burn out quickly' },
  { value: 'understand-myself', label: "I'm trying to understand myself better" },
  { value: 'support-someone', label: 'I support someone who is neurodivergent' },
  { value: 'just-curious', label: "I'm just curious" },
]

export const ND_STATUS_OPTIONS: OnboardingOption<NdStatus>[] = [
  { value: 'diagnosed', label: 'Diagnosed neurodivergent' },
  { value: 'self-identify', label: 'I identify as neurodivergent' },
  { value: 'exploring', label: "I'm exploring whether I might be" },
  { value: 'not-nd', label: "I'm not neurodivergent" },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

export const FAMILIAR_EXPERIENCE_OPTIONS: OnboardingOption<FamiliarExperience>[] = [
  { value: 'starting-tasks-difficult', label: 'Starting tasks feels difficult' },
  { value: 'hyperfocus', label: 'I hyperfocus' },
  { value: 'forget-things', label: 'I forget things' },
  { value: 'meetings-drain', label: 'Meetings drain me' },
  { value: 'noise-overwhelms', label: 'Noise overwhelms me' },
  { value: 'switching-tasks-difficult', label: 'Switching tasks is difficult' },
  { value: 'time-blindness', label: 'Time blindness' },
  { value: 'perfectionism', label: 'Perfectionism' },
  { value: 'decision-paralysis', label: 'Decision paralysis' },
  { value: 'emotional-overwhelm', label: 'Emotional overwhelm' },
  { value: 'burnout-cycles', label: 'Burnout cycles' },
  { value: 'procrastination', label: 'Procrastination' },
]

export const WORK_LOCATION_OPTIONS: OnboardingOption<WorkLocation>[] = [
  { value: 'office', label: 'Office' },
  { value: 'hybrid', label: 'Hybrid' },
  { value: 'remote', label: 'Remote' },
  { value: 'student', label: 'Student' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'shift-work', label: 'Shift work' },
  { value: 'other', label: 'Other' },
]

export const ROLE_OPTIONS: OnboardingOption<Profession>[] = [
  { value: 'manager', label: 'Manager' },
  { value: 'individual-contributor', label: 'Individual contributor' },
  { value: 'creative', label: 'Creative' },
  { value: 'technology', label: 'Technology' },
  { value: 'finance', label: 'Finance' },
  { value: 'hr', label: 'HR' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'educator', label: 'Education' },
  { value: 'student', label: 'Student' },
  { value: 'other', label: 'Other' },
]

export const ENERGY_DRAIN_OPTIONS: OnboardingOption<EnergyDrain>[] = [
  { value: 'meetings', label: 'Meetings' },
  { value: 'emails', label: 'Emails' },
  { value: 'starting-work', label: 'Starting work' },
  { value: 'prioritising', label: 'Prioritising' },
  { value: 'context-switching', label: 'Context switching' },
  { value: 'deadlines', label: 'Deadlines' },
  { value: 'social-interaction', label: 'Social interaction' },
  { value: 'noise', label: 'Noise' },
  { value: 'interruptions', label: 'Interruptions' },
  { value: 'admin-work', label: 'Admin work' },
  { value: 'remembering-everything', label: 'Remembering everything' },
]

export const PEAK_ENERGY_OPTIONS: OnboardingOption<PeakEnergyTime>[] = [
  { value: 'morning', label: 'Morning' },
  { value: 'afternoon', label: 'Afternoon' },
  { value: 'evening', label: 'Evening' },
  { value: 'varies', label: 'It varies' },
]

export const SUPPORT_STYLE_OPTIONS: OnboardingOption<SupportStyle>[] = [
  { value: 'gentle-encouragement', label: 'Gentle encouragement' },
  { value: 'practical-advice', label: 'Practical advice' },
  { value: 'coaching-style', label: 'Coaching style' },
  { value: 'scientific-explanations', label: 'Scientific explanations' },
  { value: 'just-tell-me', label: 'Just tell me what to do' },
]

export const INFORMATION_PREFERENCE_OPTIONS: OnboardingOption<InformationPreference>[] = [
  { value: 'short', label: 'Keep it short' },
  { value: 'medium', label: 'Medium detail' },
  { value: 'detailed', label: 'Tell me everything' },
]

export const SUCCESS_GOAL_OPTIONS: OnboardingOption<SuccessGoal>[] = [
  { value: 'less-overwhelmed', label: 'Feel less overwhelmed' },
  { value: 'finish-more-work', label: 'Finish more work' },
  { value: 'understand-myself', label: 'Understand myself better' },
  { value: 'prevent-burnout', label: 'Prevent burnout' },
  { value: 'build-routines', label: 'Build routines' },
  { value: 'work-life-balance', label: 'Improve work-life balance' },
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

export const GENDER_OPTIONS: OnboardingOption<GenderOption>[] = [
  { value: 'woman', label: 'Woman' },
  { value: 'man', label: 'Man' },
  { value: 'non-binary', label: 'Non-binary' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
]

export const ONBOARDING_OPTION_SETS = {
  'brought-here': BROUGHT_HERE_OPTIONS,
  'nd-status': ND_STATUS_OPTIONS,
  experiences: FAMILIAR_EXPERIENCE_OPTIONS,
  'work-environment': WORK_LOCATION_OPTIONS,
  'job-role': ROLE_OPTIONS,
  'energy-drainers': ENERGY_DRAIN_OPTIONS,
  'peak-energy': PEAK_ENERGY_OPTIONS,
  'support-style': SUPPORT_STYLE_OPTIONS,
  'information-preference': INFORMATION_PREFERENCE_OPTIONS,
  goals: SUCCESS_GOAL_OPTIONS,
  'age-range': AGE_RANGE_OPTIONS,
  gender: GENDER_OPTIONS,
} as const

export type OnboardingOptionSetKey = keyof typeof ONBOARDING_OPTION_SETS
