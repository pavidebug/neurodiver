import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Compass, Lightbulb, Search, X } from 'lucide-react'

interface StrategyDeckExplainerProps {
  open: boolean
  onClose: () => void
}

const EXPLAINER_STEPS = [
  {
    icon: Search,
    title: 'Start with what is happening',
    description: 'Search for the situation you are in, even if you do not know exactly what you need yet.',
  },
  {
    icon: Compass,
    title: 'Figure out what might help',
    description: 'Browse by situation, energy, or category to make your needs a little clearer.',
  },
  {
    icon: Lightbulb,
    title: 'Try one practical strategy',
    description: 'Choose a small idea that feels possible right now. Save it if you want to return to it later.',
  },
] as const

export function StrategyDeckExplainer({ open, onClose }: StrategyDeckExplainerProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-text/35 backdrop-blur-[2px]"
        aria-label="Close strategy deck explanation"
        onClick={onClose}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="strategy-deck-explainer-title"
        className="popup-enter relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-t-[1.75rem] border border-border bg-surface-solid shadow-2xl sm:max-w-lg sm:rounded-[1.75rem]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green text-white">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 id="strategy-deck-explainer-title" className="font-display text-2xl font-semibold leading-tight text-text">
              What is a Strategy Deck?
            </h2>
          </div>
          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-cream"
            aria-label="Close"
            onClick={onClose}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
          <p className="text-base leading-relaxed text-text-muted">
            The Strategy Deck is a place to come when you feel stuck in a situation. It helps you
            understand what you may need and find practical strategies that could make the next
            step feel easier.
          </p>

          <ol className="mt-6 space-y-3">
            {EXPLAINER_STEPS.map(({ icon: Icon, title, description }) => (
              <li key={title} className="flex gap-4 rounded-2xl border border-green/10 bg-green-muted/25 px-4 py-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-surface-solid text-green ring-1 ring-green/15">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-medium text-text">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-text-muted">{description}</p>
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-5 rounded-2xl bg-cream px-4 py-4 text-sm leading-relaxed text-text-muted">
            There is no perfect answer. Pick what feels useful, skip what does not, and come back
            whenever the situation changes.
          </p>
        </div>

        <div className="border-t border-border px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full bg-green px-5 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Explore strategies
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
