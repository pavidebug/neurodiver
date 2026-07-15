import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Bookmark, Layers, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StrategyTimerButton } from '@/components/strategy-timer/strategy-timer-button'
import { hasBuiltInStrategyTimer } from '@/lib/strategy-duration'
import type { Strategy } from '@/types/strategy'

interface StrategyDetailSheetProps {
  strategy: Strategy | null
  open: boolean
  onClose: () => void
  onExploreOther?: () => void
  isSaved?: boolean
  savePending?: boolean
  onToggleSave?: (strategyId: string) => void
  timerActive?: boolean
  onStartTimer?: (strategy: Strategy, minutes: number, trigger: HTMLButtonElement) => void
}

export function StrategyDetailSheet({
  strategy,
  open,
  onClose,
  onExploreOther,
  isSaved = false,
  savePending = false,
  onToggleSave,
  timerActive = false,
  onStartTimer,
}: StrategyDetailSheetProps) {
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

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-text/35 backdrop-blur-sm"
        aria-label="Close strategy details"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="strategy-sheet-title"
        className="popup-enter relative z-10 flex max-h-[min(88dvh,720px)] w-full max-w-lg flex-col overflow-hidden rounded-3xl bg-surface-solid shadow-2xl ring-1 ring-border"
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-5">
          <h2
            id="strategy-sheet-title"
            className="font-display text-xl font-medium italic leading-snug text-text"
          >
            &ldquo;{strategy.situation}&rdquo;
          </h2>
          <span className="sr-only">{strategy.title}</span>
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
        </div>

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
          <div className="flex flex-wrap gap-2">
            {strategy.bestWhen.slice(0, 2).map((label) => (
              <span
                key={label}
                className="rounded-full bg-cream px-2.5 py-1 text-[0.6875rem] font-medium text-text-muted"
              >
                Best for {label}
              </span>
            ))}
            <span className="rounded-full bg-cream px-2.5 py-1 text-[0.6875rem] font-medium text-text-muted">
              {strategy.estimatedTime}
            </span>
            <span className="rounded-full bg-cream px-2.5 py-1 text-[0.6875rem] font-medium text-text-muted">
              {strategy.energyRequired} energy
            </span>
            {hasBuiltInStrategyTimer(strategy) ? (
              <span className="rounded-full bg-lavender-muted px-2.5 py-1 text-[0.6875rem] font-medium text-lavender-deep">
                Built-in timer
              </span>
            ) : null}
            {strategy.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cream px-2.5 py-1 text-[0.6875rem] font-medium text-text-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <section className="space-y-2 rounded-2xl bg-yellow/25 px-4 py-4 ring-1 ring-yellow/40">
            <p className="text-sm font-medium uppercase tracking-widest text-text-muted">
              A gentle reminder
            </p>
            <p className="text-base leading-relaxed text-text">
              {strategy.gentleReminder}
            </p>
          </section>

          {onStartTimer ? (
            <StrategyTimerButton
              strategy={strategy}
              timerActive={timerActive}
              onStart={(minutes, trigger) => onStartTimer(strategy, minutes, trigger)}
            />
          ) : null}

          <section className="space-y-3">
            <p className="text-sm font-medium text-text-muted">Try this</p>
            <ol className="space-y-3">
              {strategy.tryThis.map((step, stepIndex) => (
                <li key={step} className="flex gap-3 text-base leading-relaxed text-text">
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-muted text-sm font-semibold text-green"
                    aria-hidden="true"
                  >
                    {stepIndex + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="rounded-2xl bg-green-muted/60 px-4 py-4">
            <p className="mb-2 text-sm font-medium text-green">Why this helps</p>
            <p className="text-base leading-relaxed text-text">{strategy.whyThisHelps}</p>
          </section>
        </div>

        <div className="grid shrink-0 gap-2 border-t border-border px-5 py-4 sm:grid-cols-2">
          {onToggleSave ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={savePending}
              aria-pressed={isSaved}
              onClick={() => onToggleSave(strategy.id)}
            >
              <Bookmark
                className={isSaved ? 'h-4 w-4 fill-current' : 'h-4 w-4'}
                aria-hidden="true"
              />
              {savePending ? 'Saving…' : isSaved ? 'Saved' : 'Save strategy'}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onExploreOther ?? onClose}
          >
            <Layers className="h-4 w-4" aria-hidden="true" />
            Explore other strategies
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
