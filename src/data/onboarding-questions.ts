import type { OnboardingOptionSetKey } from '@/data/onboarding-options'

export const ONBOARDING_INTRO_TITLE = "Let's build NeuroDiver around you."

export const ONBOARDING_INTRO_SUBTITLE =
  'Answer a few quick questions so we can personalise your experience. This takes about 2 minutes, and you can skip anything you\u2019re not comfortable answering.'

export const ONBOARDING_COMPLETE_TITLE = "You're all set."

export const ONBOARDING_COMPLETE_BODY =
  "Thanks for sharing a little about yourself. We'll use this information to personalise your recommendations, insights and support."

export type OnboardingQuestionType = 'text' | 'single' | 'multi' | 'about-you'

export interface OnboardingQuestionConfig {
  id: string
  type: OnboardingQuestionType
  title: string
  helper?: string
  required: boolean
  optionsKey?: OnboardingOptionSetKey
  selectionLimit?: number
  placeholder?: string
}

/** Add new questions here — UI, validation, and Firestore mapping follow this config. */
export const ONBOARDING_QUESTIONS: OnboardingQuestionConfig[] = [
  {
    id: 'preferred-name',
    type: 'text',
    title: 'What would you like us to call you?',
    helper: "This is how we'll greet you throughout the app.",
    required: true,
    placeholder: 'Preferred name',
  },
  {
    id: 'reason-for-joining',
    type: 'single',
    title: 'What brought you here today?',
    helper: 'Choose one.',
    required: false,
    optionsKey: 'brought-here',
  },
  {
    id: 'experiences',
    type: 'multi',
    title: 'Which experiences sound familiar?',
    helper: 'Select up to five.',
    required: false,
    optionsKey: 'experiences',
    selectionLimit: 5,
  },
  {
    id: 'energy-drainers',
    type: 'multi',
    title: 'What drains your energy the most?',
    helper: 'Choose up to three.',
    required: false,
    optionsKey: 'energy-drainers',
    selectionLimit: 3,
  },
  {
    id: 'support-style',
    type: 'single',
    title: 'How would you like NeuroDiver to support you?',
    required: false,
    optionsKey: 'support-style',
  },
]

export const ONBOARDING_QUESTION_COUNT = ONBOARDING_QUESTIONS.length

export function getOnboardingQuestion(stepIndex: number): OnboardingQuestionConfig | null {
  return ONBOARDING_QUESTIONS[stepIndex - 1] ?? null
}
