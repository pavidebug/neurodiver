import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { CheckInFindingSupport } from '@/components/pulse-check-in/check-in-finding-support'
import {
  CheckInProgressDots,
  CheckInStepShell,
} from '@/components/pulse-check-in/check-in-step-shell'
import { ConversationalMoodPicker } from '@/components/pulse-check-in/conversational-mood-picker'
import { PulseSlider } from '@/components/pulse-check-in/pulse-slider'
import { CheckInCalmIllustration } from '@/components/illustrations'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { getGreeting } from '@/lib/greeting'
import { isPulseComplete } from '@/lib/pulse-check-in'
import type { DailyPulseInput, PulseMood } from '@/types/pulse-check-in'
import type { WorkCheckIn } from '@/types/work-energy'
import { cn } from '@/lib/utils'

const NOTE_MAX_LENGTH = 120
const MOOD_AUTO_ADVANCE_MS = 550
const FINDING_SUPPORT_MS = 1800

type CheckInStep = 'mood' | 'energy' | 'focus' | 'overwhelm' | 'note' | 'finding'

const STEP_ORDER: CheckInStep[] = ['mood', 'energy', 'focus', 'overwhelm', 'note']

function getProgressIndex(step: CheckInStep): number {
  if (step === 'finding') return 3
  const index = STEP_ORDER.indexOf(step)
  return index === -1 ? 0 : index
}

interface GuidedCheckInFlowProps {
  displayName: string
  submitting: boolean
  error: string | null
  onSubmit: (input: DailyPulseInput) => Promise<WorkCheckIn>
  onSkip: () => void
}

export function GuidedCheckInFlow({
  displayName,
  submitting,
  error,
  onSubmit,
  onSkip,
}: GuidedCheckInFlowProps) {
  const navigate = useNavigate()
  const greeting = getGreeting()
  const moodAdvanceTimer = useRef<number | null>(null)

  const [step, setStep] = useState<CheckInStep>('mood')
  const [mood, setMood] = useState<PulseMood | null>(null)
  const [energy, setEnergy] = useState<number | null>(null)
  const [focus, setFocus] = useState<number | null>(null)
  const [stress, setStress] = useState<number | null>(null)
  const [optionalNote, setOptionalNote] = useState('')

  const clearMoodTimer = useCallback(() => {
    if (moodAdvanceTimer.current !== null) {
      window.clearTimeout(moodAdvanceTimer.current)
      moodAdvanceTimer.current = null
    }
  }, [])

  useEffect(() => clearMoodTimer, [clearMoodTimer])

  const goToStep = useCallback((next: CheckInStep) => {
    setStep(next)
  }, [])

  const goBack = useCallback(() => {
    clearMoodTimer()
    const index = STEP_ORDER.indexOf(step)
    if (index <= 0) {
      onSkip()
      return
    }
    setStep(STEP_ORDER[index - 1]!)
  }, [clearMoodTimer, onSkip, step])

  const handleMoodSelect = useCallback(
    (value: PulseMood) => {
      clearMoodTimer()
      setMood(value)
      moodAdvanceTimer.current = window.setTimeout(() => {
        goToStep('energy')
      }, MOOD_AUTO_ADVANCE_MS)
    },
    [clearMoodTimer, goToStep],
  )

  const handleFinish = useCallback(async () => {
    if (!isPulseComplete({ mood: mood!, energy: energy!, focus: focus!, stress: stress! })) {
      return
    }

    setStep('finding')

    const input: DailyPulseInput = {
      mood: mood!,
      energy: energy!,
      focus: focus!,
      stress: stress!,
      optionalNote,
    }

    try {
      await Promise.all([
        onSubmit(input),
        new Promise<void>((resolve) => window.setTimeout(resolve, FINDING_SUPPORT_MS)),
      ])

      navigate('/home', { replace: true, state: { checkInCompleted: true } })
    } catch {
      setStep('note')
    }
  }, [energy, focus, mood, navigate, onSubmit, optionalNote, stress])

  const progressIndex = getProgressIndex(step)
  const showProgress = step !== 'finding'

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col lg:mx-auto lg:min-h-[calc(100dvh-4rem)] lg:max-w-xl">
      {showProgress ? (
        <header className="flex shrink-0 items-center justify-between gap-3 pb-4">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            aria-label={step === 'mood' ? 'Back to home' : 'Previous question'}
            onClick={goBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <CheckInProgressDots activeIndex={progressIndex} />

          <button
            type="button"
            onClick={onSkip}
            className="shrink-0 px-2 py-1 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Skip
          </button>
        </header>
      ) : (
        <div className="h-12 shrink-0" aria-hidden="true" />
      )}

      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-b from-white/90 to-cream/80 px-6 py-8 shadow-[0_12px_48px_rgba(45,90,61,0.08)] sm:px-8 sm:py-10',
          step === 'finding' && 'border-none bg-transparent shadow-none',
        )}
      >
        {step === 'mood' ? (
          <CheckInStepShell stepKey="mood">
            <div className="mx-auto mb-6 w-full max-w-[16rem] sm:max-w-xs">
              <CheckInCalmIllustration className="h-auto w-full" />
            </div>
            <p className="mb-2 text-center text-sm font-medium text-text-muted">
              Good {greeting}, {displayName}
            </p>
            <h1 className="mb-8 text-center font-display text-[1.75rem] font-semibold leading-snug tracking-tight text-text sm:text-4xl">
              How are you feeling right now?
            </h1>
            <ConversationalMoodPicker value={mood} onChange={handleMoodSelect} />
            {mood ? (
              <div className="mt-8 flex justify-center fade-in">
                <Button
                  type="button"
                  size="lg"
                  className="rounded-full px-8"
                  onClick={() => {
                    clearMoodTimer()
                    goToStep('energy')
                  }}
                >
                  Continue
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            ) : null}
          </CheckInStepShell>
        ) : null}

        {step === 'energy' ? (
          <CheckInStepShell stepKey="energy">
            <ScaleStep
              question="How much energy do you have today?"
              kind="energy"
              value={energy}
              onChange={setEnergy}
              onContinue={() => goToStep('focus')}
            />
          </CheckInStepShell>
        ) : null}

        {step === 'focus' ? (
          <CheckInStepShell stepKey="focus">
            <ScaleStep
              question="How easy does it feel to focus today?"
              kind="focus"
              value={focus}
              onChange={setFocus}
              onContinue={() => goToStep('overwhelm')}
            />
          </CheckInStepShell>
        ) : null}

        {step === 'overwhelm' ? (
          <CheckInStepShell stepKey="overwhelm">
            <ScaleStep
              question="How overwhelmed do things feel today?"
              kind="overwhelm"
              value={stress}
              onChange={setStress}
              onContinue={() => goToStep('note')}
            />
          </CheckInStepShell>
        ) : null}

        {step === 'note' ? (
          <CheckInStepShell stepKey="note">
            <h1 className="mb-8 text-center font-display text-[1.75rem] font-semibold leading-snug tracking-tight text-text sm:text-4xl">
              Anything else you want to note about today?
            </h1>

            <div className="relative">
              <Textarea
                id="optional-note"
                value={optionalNote}
                onChange={(event) => setOptionalNote(event.target.value)}
                placeholder="Today I noticed…"
                maxLength={NOTE_MAX_LENGTH}
                className="min-h-32 resize-none rounded-2xl border-border/60 bg-white/80 text-base shadow-inner"
              />
              <span className="pointer-events-none absolute right-3 bottom-3 text-xs text-text-muted">
                {optionalNote.length}/{NOTE_MAX_LENGTH}
              </span>
            </div>

            {error ? (
              <p className="mt-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
                {error}
              </p>
            ) : null}

            <div className="mt-8 flex justify-center">
              <Button
                type="button"
                size="lg"
                className="w-full rounded-full sm:w-auto sm:px-10"
                disabled={submitting}
                onClick={() => void handleFinish()}
              >
                {submitting ? 'Saving…' : 'Finish'}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </CheckInStepShell>
        ) : null}

        {step === 'finding' ? <CheckInFindingSupport /> : null}
      </div>
    </div>
  )
}

function ScaleStep({
  question,
  kind,
  value,
  onChange,
  onContinue,
}: {
  question: string
  kind: 'energy' | 'focus' | 'overwhelm'
  value: number | null
  onChange: (value: number) => void
  onContinue: () => void
}) {
  const effectiveValue = value ?? 3

  function handleContinue() {
    if (value === null) onChange(effectiveValue)
    onContinue()
  }

  return (
    <>
      <h1 className="mb-10 text-center font-display text-[1.75rem] font-semibold leading-snug tracking-tight text-text sm:text-4xl">
        {question}
      </h1>
      <PulseSlider kind={kind} value={effectiveValue} onChange={onChange} />
      <div className="mt-10 flex justify-center">
        <Button type="button" size="lg" className="rounded-full px-10" onClick={handleContinue}>
          Continue
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </>
  )
}
