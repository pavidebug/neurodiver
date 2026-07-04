import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { ProgressIndicator } from '@/components/check-in/progress-indicator'
import { OptionButton } from '@/components/check-in/option-button'
import { Button } from '@/components/ui/button'
import { CHECK_IN_QUESTIONS } from '@/lib/data'
import { useCheckIn } from '@/context/check-in-context'
import { cacheReflectionResult } from '@/lib/reflection-cache'
import { getTodayString } from '@/lib/dates'

export function CheckInPage() {
  const navigate = useNavigate()
  const {
    answers,
    setAnswer,
    resetCheckIn,
    completeCheckIn,
    hasCheckedInToday,
    loading,
    submitting,
    error,
    clearError,
  } = useCheckIn()
  const [step, setStep] = useState(0)

  const question = CHECK_IN_QUESTIONS[step]
  const total = CHECK_IN_QUESTIONS.length
  const selectedValue = answers[question.id]
  const canProceed = selectedValue !== undefined

  const handleNext = async () => {
    clearError()

    if (step < total - 1) {
      setStep((prev) => prev + 1)
      return
    }

    try {
      const result = await completeCheckIn()
      cacheReflectionResult(result, getTodayString())
      navigate('/reflection', { replace: true, state: result })
    } catch {
      // Error message is surfaced through context state.
    }
  }

  const handleBack = () => {
    clearError()

    if (step > 0) {
      setStep((prev) => prev - 1)
    } else {
      navigate('/')
    }
  }

  const handleStartOver = () => {
    resetCheckIn()
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
    return (
      <div className="page-enter flex min-h-[50dvh] flex-col items-center justify-center gap-4 text-center">
        <p className="text-lg text-text-muted">
          You&apos;ve already checked in today.
        </p>
        <Button asChild size="lg">
          <Link to="/reflection">View Daily Reflection</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="page-enter mx-auto flex max-w-md flex-col">
      <ProgressIndicator current={step + 1} total={total} className="mb-8" />

      {error && (
        <p
          className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
          role="alert"
        >
          {error}
        </p>
      )}

      <div key={question.id} className="slide-up mb-8 flex-1">
        <h1 className="font-display mb-3 text-2xl font-semibold leading-snug text-text">
          {question.question}
        </h1>
        <p className="mb-8 text-base text-text-muted">{question.helper}</p>

        <fieldset className="space-y-3">
          <legend className="sr-only">{question.question}</legend>
          {question.options.map((option) => (
            <OptionButton
              key={option.value}
              option={option}
              selected={selectedValue === option.value}
              onSelect={(value) => setAnswer(question.id, value)}
            />
          ))}
        </fieldset>
      </div>

      <div className="mt-auto flex flex-col gap-3 pt-4">
        <Button
          size="lg"
          className="w-full"
          disabled={!canProceed || submitting}
          onClick={handleNext}
        >
          {submitting
            ? 'Saving…'
            : step < total - 1
              ? 'Continue'
              : 'See my results'}
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
