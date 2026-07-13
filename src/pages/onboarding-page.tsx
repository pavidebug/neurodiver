import { useEffect, useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { OnboardingComplete } from '@/components/onboarding/onboarding-complete'
import { OnboardingIntro } from '@/components/onboarding/onboarding-intro'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import { OnboardingQuestionStep } from '@/components/onboarding/onboarding-question-step'
import { Button } from '@/components/ui/button'
import {
  getOnboardingQuestion,
  ONBOARDING_QUESTION_COUNT,
} from '@/data/onboarding-questions'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { userDocumentToOnboardingAnswers } from '@/lib/onboarding-mapper'
import {
  canProceedFromOnboardingStep,
  completeOnboarding,
  getOnboardingValidationMessage,
  isOnboardingQuestionOptional,
} from '@/lib/onboarding'
import {
  saveOnboardingProgress,
  UserDocumentServiceError,
} from '@/lib/user-document-service'
import { getUserRef } from '@/lib/work-check-ins'
import { getDoc } from 'firebase/firestore'
import {
  EMPTY_ONBOARDING_ANSWERS,
  type OnboardingAnswers,
} from '@/types/onboarding'

const INTRO_STEP = 0
const FIRST_QUESTION_STEP = 1
const COMPLETE_STEP = ONBOARDING_QUESTION_COUNT + 1

export function OnboardingPage() {
  const navigate = useNavigate()
  const { user, isGuest, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useWorkEnergy()

  const [step, setStep] = useState(INTRO_STEP)
  const [answers, setAnswers] = useState<OnboardingAnswers>(EMPTY_ONBOARDING_ANSWERS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!user || initialized) return

    async function hydrateAnswers() {
      const defaultName =
        user!.displayName?.trim() || user!.email?.split('@')[0]?.trim() || ''

      try {
        const snap = await getDoc(getUserRef(user!.uid))
        const data = snap.data()
        if (data) {
          setAnswers(userDocumentToOnboardingAnswers(data, profile))
        } else {
          setAnswers((current) => ({ ...current, displayName: defaultName }))
        }
      } catch {
        setAnswers((current) => ({ ...current, displayName: defaultName }))
      } finally {
        setInitialized(true)
      }
    }

    void hydrateAnswers()
  }, [initialized, profile, user])

  const isIntro = step === INTRO_STEP
  const isComplete = step === COMPLETE_STEP
  const currentQuestion = getOnboardingQuestion(step)
  const canProceed = useMemo(
    () => canProceedFromOnboardingStep(step, answers),
    [answers, step],
  )
  const validationMessage = useMemo(
    () => getOnboardingValidationMessage(step, answers),
    [answers, step],
  )
  const showSkip = !isIntro && !isComplete && isOnboardingQuestionOptional(step)

  if (authLoading || profileLoading || !initialized) {
    return (
      <div className="flex min-h-dvh items-center justify-center onboarding-gradient">
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />
  if (isGuest || profile.onboardingCompleted) return <Navigate to="/home" replace />

  async function persistProgress(complete = false) {
    if (!user) return
    setSaving(true)
    setError(null)

    try {
      if (complete) {
        await completeOnboarding(user.uid, answers, profile)
        navigate('/home', { replace: true })
      } else {
        await saveOnboardingProgress(user.uid, answers, profile)
      }
    } catch (caught) {
      const message =
        caught instanceof UserDocumentServiceError
          ? caught.message
          : 'Something went wrong saving your profile. Please try again.'
      setError(message)
      throw caught
    } finally {
      setSaving(false)
    }
  }

  async function goNext() {
    if (!canProceed) return

    if (step === ONBOARDING_QUESTION_COUNT) {
      setStep(COMPLETE_STEP)
      return
    }

    try {
      if (step >= FIRST_QUESTION_STEP) {
        await persistProgress(false)
      }
      setStep((current) => current + 1)
    } catch {
      // Error surfaced via state
    }
  }

  function goBack() {
    if (step <= INTRO_STEP) return
    setError(null)
    setStep((current) => current - 1)
  }

  async function skipStep() {
    setError(null)
    if (step >= FIRST_QUESTION_STEP) {
      try {
        await persistProgress(false)
      } catch {
        return
      }
    }
    setStep((current) => current + 1)
  }

  return (
    <div className="onboarding-gradient min-h-dvh px-5 py-6 sm:px-8 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-lg flex-col lg:max-w-xl">
        {!isIntro && !isComplete ? (
          <OnboardingProgress
            current={step}
            total={ONBOARDING_QUESTION_COUNT}
            className="mb-8"
          />
        ) : (
          <div className="mb-8 h-8" aria-hidden="true" />
        )}

        <div className="flex-1">
          {isIntro ? <OnboardingIntro onBegin={() => setStep(FIRST_QUESTION_STEP)} /> : null}

          {currentQuestion ? (
            <OnboardingQuestionStep
              question={currentQuestion}
              answers={answers}
              onChange={setAnswers}
            />
          ) : null}

          {isComplete ? (
            <OnboardingComplete
              saving={saving}
              onFinish={() => void persistProgress(true)}
            />
          ) : null}
        </div>

        {error ? (
          <p className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
            {error}
          </p>
        ) : null}

        {!canProceed && validationMessage && !isIntro && !isComplete ? (
          <p className="mb-4 text-sm text-text-muted">{validationMessage}</p>
        ) : null}

        {!isIntro && !isComplete ? (
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="ghost"
              className="order-2 rounded-full sm:order-1"
              onClick={goBack}
              disabled={saving}
            >
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back
            </Button>

            <div className="order-1 flex flex-col gap-2 sm:order-2 sm:flex-row">
              {showSkip ? (
                <Button
                  variant="outline"
                  className="rounded-full"
                  onClick={() => void skipStep()}
                  disabled={saving}
                >
                  Skip
                </Button>
              ) : null}
              <Button
                size="lg"
                className="rounded-full"
                disabled={!canProceed || saving}
                onClick={() => void goNext()}
              >
                {saving ? 'Saving…' : 'Continue'}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
