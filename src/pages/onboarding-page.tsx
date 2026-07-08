import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { ChoiceOption } from '@/components/work-check-in/choice-option'
import { OnboardingPill } from '@/components/onboarding/onboarding-pill'
import { OnboardingProgress } from '@/components/onboarding/onboarding-progress'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  ACCESSIBILITY_OPTIONS,
  AGE_RANGE_OPTIONS,
  CHALLENGE_OPTIONS,
  GOAL_OPTIONS,
  ND_STATUS_OPTIONS,
  NOTIFICATION_OPTIONS,
  ONBOARDING_CHALLENGE_LIMIT,
  ONBOARDING_TAGLINE,
  ONBOARDING_TOTAL_STEPS,
  PROFESSION_OPTIONS,
  WORK_ENVIRONMENT_OPTIONS,
} from '@/data/onboarding-steps'
import { useAuth } from '@/context/auth-context'
import { useTheme } from '@/context/theme-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import {
  applyAccessibilityPreferences,
  completeOnboarding,
} from '@/lib/onboarding'
import {
  EMPTY_ONBOARDING_ANSWERS,
  type AccessibilityPreference,
  type OnboardingAnswers,
} from '@/types/onboarding'

const QUESTION_STEPS = 9

export function OnboardingPage() {
  const navigate = useNavigate()
  const { user, isGuest, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useWorkEnergy()
  const { setPreference } = useTheme()

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<OnboardingAnswers>(EMPTY_ONBOARDING_ANSWERS)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (!user || initialized) return

    const defaultName =
      user.displayName?.trim() ||
      user.email?.split('@')[0]?.trim() ||
      ''

    setAnswers((current) => ({
      ...current,
      displayName: defaultName,
    }))
    setInitialized(true)
  }, [initialized, user])

  const isCompleteScreen = step === QUESTION_STEPS
  const canProceed = useMemo(() => canProceedFromStep(step, answers), [answers, step])
  const isLastQuestionStep = step === QUESTION_STEPS - 1

  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-dvh items-center justify-center onboarding-gradient">
        <p className="text-sm text-[#6B6B63]">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (isGuest || profile.onboardingCompleted) {
    return <Navigate to="/home" replace />
  }

  const patch = (partial: Partial<OnboardingAnswers>) => {
    setError(null)
    setAnswers((current) => ({ ...current, ...partial }))
  }

  const toggleMulti = (
    field: 'workEnvironment' | 'challenges' | 'goals',
    value: string,
    limit?: number,
  ) => {
    setError(null)
    setAnswers((current) => {
      const selected = current[field]
      const exists = selected.includes(value as never)

      if (exists) {
        return {
          ...current,
          [field]: selected.filter((entry) => entry !== value),
        }
      }

      if (limit !== undefined && selected.length >= limit) {
        return current
      }

      return { ...current, [field]: [...selected, value] }
    })
  }

  const toggleAccessibility = (value: AccessibilityPreference) => {
    setError(null)
    setAnswers((current) => {
      const selected = current.accessibilityPreferences
      const exists = selected.includes(value)

      if (value === 'none') {
        return { ...current, accessibilityPreferences: exists ? [] : ['none'] }
      }

      const withoutNone = selected.filter((entry) => entry !== 'none')
      if (exists) {
        return {
          ...current,
          accessibilityPreferences: withoutNone.filter((entry) => entry !== value),
        }
      }

      return { ...current, accessibilityPreferences: [...withoutNone, value] }
    })
  }

  const handleNext = async () => {
    setError(null)

    if (!isLastQuestionStep) {
      setStep((current) => current + 1)
      return
    }

    if (!user) return

    setSaving(true)
    try {
      const nextProfile = await completeOnboarding(user.uid, answers, profile)
      applyAccessibilityPreferences(nextProfile.accessibilityPreferences, setPreference)
      setStep(QUESTION_STEPS)
    } catch {
      setError('Unable to save your answers. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleFinish = () => {
    navigate('/home', { replace: true })
  }

  const handleBack = () => {
    setError(null)
    if (step > 0) {
      setStep((current) => current - 1)
    }
  }

  const handleSkip = () => {
    setError(null)
    setStep((current) => current + 1)
  }

  return (
    <div className="onboarding-gradient min-h-dvh px-5 py-8 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100dvh-4rem)] w-full max-w-xl flex-col">
        {!isCompleteScreen && (
          <header className="mb-8 space-y-4">
            <div className="flex items-center gap-2 text-[#2D5A3D]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
              <p className="font-display text-sm font-semibold tracking-wide">
                Let&apos;s get to know you
              </p>
            </div>
            {step === 0 && (
              <p className="text-base leading-relaxed text-[#6B6B63]">{ONBOARDING_TAGLINE}</p>
            )}
            <OnboardingProgress current={step + 1} total={ONBOARDING_TOTAL_STEPS} />
          </header>
        )}

        <div
          className="onboarding-card slide-up flex flex-1 flex-col rounded-[20px] border border-[#E5E0D4]/80 bg-white/95 p-6 shadow-[0_8px_32px_rgb(45_90_61_/0.08)] lg:p-8"
          key={step}
        >
          {error && (
            <p
              className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
              role="alert"
            >
              {error}
            </p>
          )}

          {step === 0 && (
            <StepShell
              question="What would you like us to call you?"
              helper="We’ll use this throughout NeuroDiver."
              skippable
              onSkip={handleSkip}
            >
              <Input
                id="displayName"
                name="displayName"
                autoComplete="nickname"
                value={answers.displayName}
                onChange={(event) => patch({ displayName: event.target.value })}
                placeholder="Your preferred name"
                className="text-lg"
                maxLength={40}
                autoFocus
              />
            </StepShell>
          )}

          {step === 1 && (
            <StepShell
              question="Which best describes you?"
              helper="This stays private and helps us personalize your experience."
            >
              <fieldset className="space-y-3">
                <legend className="sr-only">Which best describes you?</legend>
                {ND_STATUS_OPTIONS.map((option) => (
                  <ChoiceOption
                    key={option.value}
                    option={option}
                    selected={answers.ndStatus === option.value}
                    onSelect={(value) => patch({ ndStatus: value as OnboardingAnswers['ndStatus'] })}
                  />
                ))}
              </fieldset>
            </StepShell>
          )}

          {step === 2 && (
            <StepShell
              question="Which age group are you in?"
              helper="Optional context — choose prefer not to say if you’d rather skip."
            >
              <fieldset className="space-y-3">
                <legend className="sr-only">Which age group are you in?</legend>
                {AGE_RANGE_OPTIONS.map((option) => (
                  <ChoiceOption
                    key={option.value}
                    option={option}
                    selected={answers.ageRange === option.value}
                    onSelect={(value) => patch({ ageRange: value as OnboardingAnswers['ageRange'] })}
                  />
                ))}
              </fieldset>
            </StepShell>
          )}

          {step === 3 && (
            <StepShell
              question="What best describes your work?"
              helper="Pick the closest match — there’s no wrong answer."
              skippable
              onSkip={handleSkip}
            >
              <fieldset className="space-y-3">
                <legend className="sr-only">What best describes your work?</legend>
                {PROFESSION_OPTIONS.map((option) => (
                  <ChoiceOption
                    key={option.value}
                    option={option}
                    selected={answers.profession === option.value}
                    onSelect={(value) =>
                      patch({ profession: value as OnboardingAnswers['profession'] })
                    }
                  />
                ))}
              </fieldset>
            </StepShell>
          )}

          {step === 4 && (
            <StepShell
              question="What’s your work environment like?"
              helper="Select all that apply."
              skippable
              onSkip={handleSkip}
            >
              <div className="flex flex-wrap gap-2">
                {WORK_ENVIRONMENT_OPTIONS.map((option) => (
                  <OnboardingPill
                    key={option.value}
                    label={option.label}
                    selected={answers.workEnvironment.includes(option.value)}
                    onToggle={() => toggleMulti('workEnvironment', option.value)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {step === 5 && (
            <StepShell
              question="Which areas feel most challenging right now?"
              helper={`Select up to ${ONBOARDING_CHALLENGE_LIMIT}. Skip if none resonate today.`}
              skippable
              onSkip={handleSkip}
            >
              <div className="flex flex-wrap gap-2">
                {CHALLENGE_OPTIONS.map((option) => (
                  <OnboardingPill
                    key={option.value}
                    label={option.label}
                    selected={answers.challenges.includes(option.value)}
                    disabled={
                      !answers.challenges.includes(option.value) &&
                      answers.challenges.length >= ONBOARDING_CHALLENGE_LIMIT
                    }
                    onToggle={() =>
                      toggleMulti('challenges', option.value, ONBOARDING_CHALLENGE_LIMIT)
                    }
                  />
                ))}
              </div>
            </StepShell>
          )}

          {step === 6 && (
            <StepShell
              question="How would you like NeuroDiver to help?"
              helper="Select everything that sounds useful — or skip for now."
              skippable
              onSkip={handleSkip}
            >
              <div className="flex flex-wrap gap-2">
                {GOAL_OPTIONS.map((option) => (
                  <OnboardingPill
                    key={option.value}
                    label={option.label}
                    selected={answers.goals.includes(option.value)}
                    onToggle={() => toggleMulti('goals', option.value)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {step === 7 && (
            <StepShell
              question="Any accessibility preferences?"
              helper="We’ll apply these right away. You can change them later in Profile."
              skippable
              onSkip={handleSkip}
            >
              <div className="flex flex-wrap gap-2">
                {ACCESSIBILITY_OPTIONS.map((option) => (
                  <OnboardingPill
                    key={option.value}
                    label={option.label}
                    selected={answers.accessibilityPreferences.includes(option.value)}
                    onToggle={() => toggleAccessibility(option.value)}
                  />
                ))}
              </div>
            </StepShell>
          )}

          {step === 8 && (
            <StepShell
              question="How often would you like reminders?"
              helper="You’re always in control — change this anytime."
            >
              <fieldset className="space-y-3">
                <legend className="sr-only">How often would you like reminders?</legend>
                {NOTIFICATION_OPTIONS.map((option) => (
                  <ChoiceOption
                    key={option.value}
                    option={option}
                    selected={answers.notificationPreference === option.value}
                    onSelect={(value) =>
                      patch({
                        notificationPreference:
                          value as OnboardingAnswers['notificationPreference'],
                      })
                    }
                  />
                ))}
              </fieldset>
            </StepShell>
          )}

          {isCompleteScreen && (
            <div className="flex flex-1 flex-col items-center justify-center space-y-6 py-6 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#E8F0EB]">
                <Sparkles className="h-8 w-8 text-[#2D5A3D]" aria-hidden="true" />
              </div>
              <div className="space-y-3">
                <h1 className="font-display text-3xl font-semibold text-[#1F2A24]">
                  You&apos;re all set.
                </h1>
                <p className="text-lg leading-relaxed text-[#6B6B63]">
                  We&apos;ll use this to personalize your check-ins, strategies, and
                  insights.
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto flex flex-col gap-3 pt-8">
            {isCompleteScreen ? (
              <Button type="button" size="lg" className="w-full" onClick={handleFinish}>
                Go to my workspace
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  disabled={!canProceed || saving}
                  onClick={() => void handleNext()}
                >
                  {saving
                    ? 'Saving…'
                    : isLastQuestionStep
                      ? 'Save & finish'
                      : 'Next'}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={step === 0 || saving}
                    onClick={handleBack}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepShell({
  question,
  helper,
  skippable = false,
  onSkip,
  children,
}: {
  question: string
  helper: string
  skippable?: boolean
  onSkip?: () => void
  children: ReactNode
}) {
  return (
    <div className="flex flex-1 flex-col space-y-6">
      <div className="space-y-3">
        <h1 className="font-display text-2xl font-semibold leading-snug text-[#1F2A24] lg:text-3xl">
          {question}
        </h1>
        <p className="text-base leading-relaxed text-[#6B6B63]">{helper}</p>
        {skippable && onSkip && (
          <button
            type="button"
            onClick={onSkip}
            className="text-sm text-[#6B6B63] underline-offset-4 hover:text-[#1F2A24] hover:underline"
          >
            Skip for now
          </button>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  )
}

function canProceedFromStep(step: number, answers: OnboardingAnswers): boolean {
  switch (step) {
    case 0:
      return true
    case 1:
      return answers.ndStatus !== null
    case 2:
      return answers.ageRange !== null
    case 3:
      return true
    case 4:
    case 5:
    case 6:
    case 7:
      return true
    case 8:
      return answers.notificationPreference !== null
    default:
      return true
  }
}
