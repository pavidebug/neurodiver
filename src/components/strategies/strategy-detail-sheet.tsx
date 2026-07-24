import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Strategy, StrategyFeedback } from '@/types/strategy'

interface StrategyDetailSheetProps {
  strategy: Strategy | null
  open: boolean
  onClose: () => void
  onExploreOther?: () => void
  isSaved?: boolean
  savePending?: boolean
  onToggleSave?: (strategyId: string) => void
  onFeedback?: (strategyId: string, feedback: StrategyFeedback) => void
}

const FEEDBACK_OPTIONS: Array<{ label: string; value: StrategyFeedback }> = [
  { label: 'It helped', value: 'helped' },
  { label: 'A little', value: 'unsure' },
  { label: 'Not today', value: 'not-helpful' },
]

export function StrategyDetailSheet({
  strategy,
  open,
  onClose,
  onExploreOther,
  isSaved = false,
  savePending = false,
  onToggleSave,
  onFeedback,
}: StrategyDetailSheetProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedback, setFeedback] = useState<StrategyFeedback | null>(null)
  const steps = useMemo(
    () => strategy?.tryThis.length
      ? strategy.tryThis
      : ['Try the smallest version of this strategy that feels manageable.'],
    [strategy],
  )

  useEffect(() => {
    if (!open) return
    setStepIndex(0)
    setShowFeedback(false)
    setFeedback(null)
  }, [open, strategy?.id])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (!open || !strategy) return null

  const isLastStep = stepIndex === steps.length - 1
  const progress = ((stepIndex + 1) / steps.length) * 100

  const submitFeedback = (nextFeedback: StrategyFeedback) => {
    setFeedback(nextFeedback)
    onFeedback?.(strategy.id, nextFeedback)
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-cream">
      <div className="mx-auto flex min-h-dvh w-full max-w-3xl flex-col px-4 py-5 sm:px-8 sm:py-8">
        <header className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-sm font-medium text-green">Guided strategy</p>
            <h2 className="mt-1 max-w-2xl font-display text-xl font-semibold leading-snug text-text sm:text-2xl">
              &ldquo;{strategy.situation}&rdquo;
            </h2>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </header>

        <div className="flex flex-1 items-start py-4 sm:py-6">
          <div className="w-full rounded-[1.75rem] border border-border bg-surface-solid p-5 shadow-sm sm:p-8">
            {showFeedback ? (
              <div className="mx-auto max-w-xl space-y-6 text-center">
                <div>
                  <h3 className="font-display text-2xl font-semibold text-text sm:text-3xl">
                    How did this help?
                  </h3>
                  <p className="mt-2 text-sm text-text-muted">Choose the answer that feels closest.</p>
                </div>

                {feedback ? (
                  <div className="space-y-5">
                    <p className="rounded-2xl bg-green-muted px-4 py-4 font-medium text-green">
                      Thanks. Your response helps improve future suggestions.
                    </p>
                    <Button type="button" className="w-full sm:w-auto" onClick={onExploreOther ?? onClose}>
                      Back to strategies
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {FEEDBACK_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => submitFeedback(option.value)}
                        className="min-h-14 rounded-2xl border border-green/20 bg-white px-4 py-3 font-medium text-text transition-colors hover:bg-green-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="mx-auto max-w-xl space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-4 text-sm font-medium text-text-muted">
                    <span>Step {stepIndex + 1} of {steps.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-dark" aria-hidden="true">
                    <div
                      className="h-full rounded-full bg-green transition-[width] duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <section className="rounded-2xl bg-green-muted/45 px-5 py-7 sm:px-7 sm:py-9">
                  <p className="font-display text-xl font-semibold leading-relaxed text-text sm:text-2xl">
                    {steps[stepIndex]}
                  </p>
                </section>

                <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-2">
                    {stepIndex > 0 ? (
                      <Button type="button" variant="outline" onClick={() => setStepIndex((current) => current - 1)}>
                        Back
                      </Button>
                    ) : null}
                    {onToggleSave ? (
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={savePending}
                        aria-pressed={isSaved}
                        onClick={() => onToggleSave(strategy.id)}
                      >
                        {savePending ? 'Saving…' : isSaved ? 'Saved' : 'Save strategy'}
                      </Button>
                    ) : null}
                  </div>

                  <Button
                    type="button"
                    className="min-w-32"
                    onClick={() => {
                      if (isLastStep) setShowFeedback(true)
                      else setStepIndex((current) => current + 1)
                    }}
                  >
                    {isLastStep ? "I'm done" : 'Next'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
