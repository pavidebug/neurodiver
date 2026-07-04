import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ChoiceOption } from '@/components/work-check-in/choice-option'
import { WorkCheckInProgress } from '@/components/work-check-in/progress-indicator'
import { ScaleOption } from '@/components/work-check-in/scale-option'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { WORK_CHECK_IN_QUESTIONS } from '@/data/work-check-in-questions'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { getTodayString } from '@/lib/dates'
import {
  clearWorkCheckInDraft,
  readWorkCheckInDraft,
  saveWorkCheckInDraft,
} from '@/lib/work-check-in-draft'
import {
  buildWorkCheckInInput,
  canProceedFromQuestion,
  getQuestionValue,
} from '@/lib/work-check-in-form'
import {
  DuplicateWorkCheckInError,
  fetchWorkCheckInForDate,
} from '@/lib/work-check-ins'
import { cacheWorkReflection } from '@/lib/work-reflection-cache'
import type {
  WorkCheckIn,
  WorkCheckInDraftAnswers,
  WorkCheckInQuestion,
} from '@/types/work-energy'

function goToReflection(
  navigate: ReturnType<typeof useNavigate>,
  checkIn: WorkCheckIn,
  today: string,
) {
  clearWorkCheckInDraft()
  cacheWorkReflection(checkIn, today)
  navigate('/work-reflection', { replace: true, state: { checkIn } })
}

export function WorkCheckInPage() {
  const navigate = useNavigate()
  const today = getTodayString()
  const { user } = useAuth()
  const {
    hasCheckedInToday,
    todayCheckIn,
    loading,
    submitting,
    error,
    clearError,
    submitCheckIn,
  } = useWorkEnergy()

  const storedDraft = readWorkCheckInDraft(today)
  const [step, setStep] = useState(storedDraft?.step ?? 0)
  const [answers, setAnswers] = useState<WorkCheckInDraftAnswers>(
    storedDraft?.answers ?? {},
  )
  const [localError, setLocalError] = useState<string | null>(null)

  const question = WORK_CHECK_IN_QUESTIONS[step]
  const total = WORK_CHECK_IN_QUESTIONS.length
  const selectedValue = getQuestionValue(answers, question)
  const canProceed = canProceedFromQuestion(answers, question)
  const isLastStep = step === total - 1
  const displayError = localError ?? error

  useEffect(() => {
    saveWorkCheckInDraft(today, step, answers)
  }, [today, step, answers])

  const updateAnswer = (questionId: WorkCheckInQuestion['id'], value: unknown) => {
    clearError()
    setLocalError(null)
    setAnswers((current) => {
      const next = { ...current, [questionId]: value }

      if (questionId === 'biggestDrain' && value !== 'other') {
        delete next.biggestDrainOther
      }

      if (questionId === 'biggestRefill' && value !== 'other') {
        delete next.biggestRefillOther
      }

      return next
    })
  }

  const updateOtherDetail = (
    field: 'biggestDrainOther' | 'biggestRefillOther',
    value: string,
  ) => {
    clearError()
    setLocalError(null)
    setAnswers((current) => ({ ...current, [field]: value }))
  }

  const handleNext = async () => {
    clearError()
    setLocalError(null)

    if (!isLastStep) {
      setStep((current) => current + 1)
      return
    }

    const input = buildWorkCheckInInput(answers)
    if (!input) {
      setLocalError('Please answer all required questions before finishing.')
      return
    }

    try {
      const checkIn = await submitCheckIn(input)
      goToReflection(navigate, checkIn, today)
    } catch (submitError) {
      if (submitError instanceof DuplicateWorkCheckInError) {
        const existing =
          todayCheckIn ??
          (user ? await fetchWorkCheckInForDate(user.uid, today) : null)

        if (existing) {
          goToReflection(navigate, existing, today)
          return
        }
      }
    }
  }

  const handleBack = () => {
    clearError()
    setLocalError(null)

    if (step > 0) {
      setStep((current) => current - 1)
      return
    }

    navigate('/home')
  }

  const handleStartOver = () => {
    clearError()
    setLocalError(null)
    clearWorkCheckInDraft()
    setAnswers({})
    setStep(0)
  }

  if (loading) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <p className="text-sm text-text-muted">Loading check-in…</p>
      </div>
    )
  }

  if (hasCheckedInToday) {
    const openReflection = () => {
      if (todayCheckIn) {
        goToReflection(navigate, todayCheckIn, today)
      } else {
        navigate('/work-reflection')
      }
    }

    return (
      <div className="page-enter flex min-h-[60dvh] flex-col items-center justify-center gap-4 text-center">
        <p className="max-w-sm text-lg leading-relaxed text-text-muted">
          You&apos;ve already checked in today. Take a moment to reflect on how
          work felt.
        </p>
        <Button size="lg" onClick={openReflection}>
          View Daily Work Reflection
        </Button>
      </div>
    )
  }

  return (
    <div className="page-enter mx-auto flex min-h-[70dvh] max-w-md flex-col">
      <WorkCheckInProgress current={step + 1} total={total} className="mb-10" />

      {displayError && (
        <p
          className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
          role="alert"
        >
          {displayError}
        </p>
      )}

      <div key={question.id} className="slide-up mb-10 flex-1">
        <h1 className="font-display mb-4 text-3xl font-semibold leading-snug text-text">
          {question.question}
        </h1>
        <p className="mb-8 text-lg leading-relaxed text-text-muted">
          {question.helper}
        </p>

        {question.type === 'labeled-scale' && (
          <fieldset className="space-y-3">
            <legend className="sr-only">{question.question}</legend>
            {question.options.map((option) => (
              <ScaleOption
                key={option.value}
                option={option}
                selected={selectedValue === option.value}
                onSelect={(value) => updateAnswer(question.id, value)}
              />
            ))}
          </fieldset>
        )}

        {question.type === 'choice' && (
          <fieldset className="space-y-3">
            <legend className="sr-only">{question.question}</legend>
            {question.options.map((option) => (
              <ChoiceOption
                key={option.value}
                option={option}
                selected={selectedValue === option.value}
                onSelect={(value) => updateAnswer(question.id, value)}
              />
            ))}
            {question.otherDetailField && selectedValue === 'other' && (
              <Textarea
                id={question.otherDetailField}
                name={question.otherDetailField}
                placeholder={question.otherDetailPlaceholder ?? 'What was it?'}
                maxLength={120}
                value={answers[question.otherDetailField] ?? ''}
                onChange={(event) =>
                  updateOtherDetail(question.otherDetailField!, event.target.value)
                }
                className="min-h-24 text-lg"
                autoFocus
              />
            )}
          </fieldset>
        )}

        {question.type === 'text' && (
          <Textarea
            id={question.id}
            name={question.id}
            placeholder={question.placeholder}
            maxLength={question.maxLength}
            value={typeof selectedValue === 'string' ? selectedValue : ''}
            onChange={(event) => updateAnswer(question.id, event.target.value)}
            className="min-h-32 text-lg"
          />
        )}
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          className="w-full"
          disabled={!canProceed || submitting}
          onClick={() => void handleNext()}
        >
          {submitting ? 'Saving…' : isLastStep ? 'Finish' : 'Next'}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>

        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={handleBack} disabled={submitting}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
          <button
            type="button"
            onClick={handleStartOver}
            disabled={submitting}
            className="text-sm text-text-muted underline-offset-4 hover:text-text hover:underline disabled:opacity-50"
          >
            Start over
          </button>
        </div>
      </div>
    </div>
  )
}
