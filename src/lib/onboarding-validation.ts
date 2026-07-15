import { getOnboardingQuestion } from '@/data/onboarding-questions'
import type { OnboardingAnswers } from '@/types/onboarding'

export function isOnboardingQuestionOptional(stepIndex: number): boolean {
  const question = getOnboardingQuestion(stepIndex)
  return question ? !question.required : true
}

export function canProceedFromOnboardingStep(
  stepIndex: number,
  answers: OnboardingAnswers,
): boolean {
  const question = getOnboardingQuestion(stepIndex)
  if (!question || !question.required) return true

  switch (question.id) {
    case 'preferred-name':
      return answers.displayName.trim().length > 0
    case 'reason-for-joining':
      return answers.whatBroughtYouHere !== null
    default:
      return true
  }
}

export function getOnboardingValidationMessage(
  stepIndex: number,
  answers: OnboardingAnswers,
): string | null {
  if (canProceedFromOnboardingStep(stepIndex, answers)) return null

  const question = getOnboardingQuestion(stepIndex)
  if (!question) return null

  if (question.id === 'preferred-name') {
    return 'Please enter a preferred name to continue.'
  }

  if (question.id === 'reason-for-joining') {
    return 'Please choose what brought you here today.'
  }

  return 'Please answer this question to continue.'
}
