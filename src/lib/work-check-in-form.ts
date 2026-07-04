import { WORK_CHECK_IN_QUESTIONS } from '@/data/work-check-in-questions'
import type {
  WorkCheckInDraftAnswers,
  WorkCheckInInput,
  WorkCheckInQuestion,
} from '@/types/work-energy'

function isOtherChoiceSelected(value: unknown): boolean {
  return value === 'other'
}

function getOtherDetail(
  answers: WorkCheckInDraftAnswers,
  field: 'biggestDrainOther' | 'biggestRefillOther',
): string | undefined {
  const value = answers[field]
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

export function getQuestionValue(
  answers: WorkCheckInDraftAnswers,
  question: WorkCheckInQuestion,
): string | number | undefined {
  const value = answers[question.id]
  if (value === undefined || value === null) return undefined
  if (typeof value === 'string' && value.trim() === '') return undefined
  return value as string | number
}

export function canProceedFromQuestion(
  answers: WorkCheckInDraftAnswers,
  question: WorkCheckInQuestion,
): boolean {
  const value = getQuestionValue(answers, question)

  if (question.type === 'choice' && question.otherDetailField) {
    if (!value) return !question.required
    if (isOtherChoiceSelected(value)) {
      return getOtherDetail(answers, question.otherDetailField) !== undefined
    }
    return true
  }

  if (!question.required) return true
  return value !== undefined
}

export function buildWorkCheckInInput(
  answers: WorkCheckInDraftAnswers,
): WorkCheckInInput | null {
  const input: WorkCheckInInput = {
    energyTank: answers.energyTank!,
    maskingLoad: answers.maskingLoad!,
    supportFelt: answers.supportFelt!,
    biggestDrain: answers.biggestDrain!,
    biggestDrainOther: answers.biggestDrainOther,
    biggestRefill: answers.biggestRefill!,
    biggestRefillOther: answers.biggestRefillOther,
    mostDrainingTime: answers.mostDrainingTime!,
    ableToAskNeeds: answers.ableToAskNeeds!,
    accommodationWish: answers.accommodationWish,
    organisationId: answers.organisationId,
  }

  const complete = WORK_CHECK_IN_QUESTIONS.every((question) =>
    canProceedFromQuestion(answers, question),
  )

  if (!complete) return null

  if (input.biggestDrain !== 'other') {
    input.biggestDrainOther = undefined
  }

  if (input.biggestRefill !== 'other') {
    input.biggestRefillOther = undefined
  }

  return input
}
