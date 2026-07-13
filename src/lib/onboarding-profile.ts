import type {
  AccessibilityPreference,
  EnergyDrain,
  FamiliarExperience,
  InformationPreference,
  OnboardingAnswers,
  OnboardingChallenge,
  OnboardingGoal,
  SuccessGoal,
  SupportStyle,
  WorkEnvironment,
  WorkLocation,
  WorkStatus,
} from '@/types/onboarding'

const FAMILIAR_TO_CHALLENGE: Partial<Record<FamiliarExperience, OnboardingChallenge>> = {
  'starting-tasks-difficult': 'starting-tasks',
  'switching-tasks-difficult': 'switching-tasks',
  'forget-things': 'remembering-things',
  'meetings-drain': 'meetings',
  'noise-overwhelms': 'sensory-overwhelm',
  'time-blindness': 'time-blindness',
  'emotional-overwhelm': 'emotional-regulation',
  'burnout-cycles': 'burnout',
  procrastination: 'procrastination',
}

const SUCCESS_TO_GOAL: Record<SuccessGoal, OnboardingGoal> = {
  'less-overwhelmed': 'feel-less-overwhelmed',
  'finish-more-work': 'improve-performance',
  'understand-myself': 'understand-myself',
  'prevent-burnout': 'reduce-burnout',
  'build-routines': 'build-routines',
  'work-life-balance': 'work-life-balance',
}

const DRAIN_TO_CHALLENGE: Partial<Record<EnergyDrain, OnboardingChallenge>> = {
  meetings: 'meetings',
  prioritising: 'prioritising',
  'context-switching': 'switching-tasks',
  noise: 'sensory-overwhelm',
  'starting-work': 'starting-tasks',
  'remembering-everything': 'remembering-things',
}

export function mapWorkLocationToLegacy(
  location: WorkLocation | null,
): { workStatus: WorkStatus | null; workEnvironment: WorkEnvironment[] } {
  switch (location) {
    case 'student':
      return { workStatus: 'student', workEnvironment: ['university'] }
    case 'office':
      return { workStatus: 'working', workEnvironment: ['office'] }
    case 'hybrid':
      return { workStatus: 'working', workEnvironment: ['hybrid'] }
    case 'remote':
      return { workStatus: 'working', workEnvironment: ['remote'] }
    case 'freelancer':
      return { workStatus: 'working', workEnvironment: ['freelance'] }
    case 'shift-work':
      return { workStatus: 'working', workEnvironment: ['shift-work'] }
    case 'other':
      return { workStatus: 'other', workEnvironment: [] }
    default:
      return { workStatus: null, workEnvironment: [] }
  }
}

export function buildChallengesFromAnswers(answers: OnboardingAnswers): OnboardingChallenge[] {
  const mapped = new Set<OnboardingChallenge>()

  for (const experience of answers.familiarExperiences) {
    const challenge = FAMILIAR_TO_CHALLENGE[experience]
    if (challenge) mapped.add(challenge)
  }

  for (const drain of answers.energyDrains) {
    const challenge = DRAIN_TO_CHALLENGE[drain]
    if (challenge) mapped.add(challenge)
  }

  return [...mapped]
}

export function buildGoalsFromAnswers(answers: OnboardingAnswers): OnboardingGoal[] {
  return answers.successGoals.map((goal) => SUCCESS_TO_GOAL[goal])
}

export function buildAccessibilityPreferences(
  supportStyle: SupportStyle | null,
  informationPreference: InformationPreference | null,
  existing: AccessibilityPreference[],
): AccessibilityPreference[] {
  const preferences = new Set(existing.filter((pref) => pref !== 'none'))

  if (supportStyle === 'just-tell-me' || informationPreference === 'short') {
    preferences.add('simplified-interface')
  }

  if (informationPreference === 'short') {
    preferences.add('fewer-notifications')
  }

  return [...preferences]
}
