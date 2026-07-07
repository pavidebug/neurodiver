import { WORK_CHECK_IN_QUESTIONS } from '@/data/work-check-in-questions'
import type {
  WorkCheckInDraftAnswers,
  WorkCheckInInput,
  WorkCheckInMultiChoiceQuestion,
  WorkCheckInQuestion,
} from '@/types/work-energy'

type OtherDetailField =
  | 'drainsOther'
  | 'refillsOther'
  | 'accommodationNeedsOther'

function isOtherChoiceSelected(values: string[]): boolean {
  return values.includes('other')
}

function getOtherDetail(
  answers: WorkCheckInDraftAnswers,
  field: OtherDetailField,
): string | undefined {
  const value = answers[field]
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : undefined
}

function getMultiChoiceValues(
  answers: WorkCheckInDraftAnswers,
  question: WorkCheckInMultiChoiceQuestion,
): string[] {
  const value = answers[question.id]
  if (!Array.isArray(value)) return []
  return value.filter((entry) => typeof entry === 'string')
}

export function getQuestionValue(
  answers: WorkCheckInDraftAnswers,
  question: WorkCheckInQuestion,
): string | number | string[] | undefined {
  const value = answers[question.id]
  if (value === undefined || value === null) return undefined
  if (Array.isArray(value)) return value
  if (typeof value === 'string' && value.trim() === '') return undefined
  return value as string | number
}

export function canProceedFromQuestion(
  answers: WorkCheckInDraftAnswers,
  question: WorkCheckInQuestion,
): boolean {
  if (question.type === 'multi-choice') {
    const selected = getMultiChoiceValues(answers, question)
    if (selected.length === 0) return !question.required

    if (
      question.otherDetailField &&
      isOtherChoiceSelected(selected)
    ) {
      return getOtherDetail(answers, question.otherDetailField) !== undefined
    }

    return true
  }

  const value = getQuestionValue(answers, question)
  if (!question.required) return true
  return value !== undefined
}

export function toggleMultiChoiceValue(
  current: string[] | undefined,
  value: string,
): string[] {
  const selected = current ?? []
  if (selected.includes(value)) {
    return selected.filter((entry) => entry !== value)
  }
  return [...selected, value]
}

export function buildWorkCheckInInput(
  answers: WorkCheckInDraftAnswers,
): WorkCheckInInput | null {
  const input: WorkCheckInInput = {
    energyTank: answers.energyTank!,
    maskingLoad: answers.maskingLoad!,
    supportFelt: answers.supportFelt!,
    drains: answers.drains ?? [],
    drainsOther: answers.drainsOther,
    refills: answers.refills ?? [],
    refillsOther: answers.refillsOther,
    mostDrainingTime: answers.mostDrainingTime!,
    ableToAskNeeds: answers.ableToAskNeeds!,
    accommodationNeeds: answers.accommodationNeeds ?? [],
    accommodationNeedsOther: answers.accommodationNeedsOther,
    freeTextReflection: answers.freeTextReflection,
    wouldUseAgain: answers.wouldUseAgain!,
    organisationId: answers.organisationId,
  }

  const complete = WORK_CHECK_IN_QUESTIONS.every((question) =>
    canProceedFromQuestion(answers, question),
  )

  if (!complete) return null

  if (!input.drains.includes('other')) {
    input.drainsOther = undefined
  }

  if (!input.refills.includes('other')) {
    input.refillsOther = undefined
  }

  if (!input.accommodationNeeds.includes('other')) {
    input.accommodationNeedsOther = undefined
  }

  return input
}
