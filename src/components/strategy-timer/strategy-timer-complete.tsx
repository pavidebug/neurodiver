import type { StrategyTimerReflection } from '@/hooks/use-strategy-timer'

interface StrategyTimerCompleteProps {
  onSelect: (reflection: StrategyTimerReflection) => void
}

const OPTIONS: Array<{ value: StrategyTimerReflection; label: string }> = [
  { value: 'a-little-better', label: 'A little better' },
  { value: 'no-change', label: 'No change' },
  { value: 'more-overwhelmed', label: 'More overwhelmed' },
  { value: 'skip', label: 'Skip' },
]

export function StrategyTimerComplete({ onSelect }: StrategyTimerCompleteProps) {
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-muted text-2xl" aria-hidden="true">
        🌿
      </div>
      <div>
        <h2 id="strategy-timer-title" className="font-display text-3xl font-semibold text-text">
          You gave it some time.
        </h2>
        <p className="mt-2 text-base text-text-muted">How do you feel now?</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className="min-h-12 rounded-2xl border border-green/15 bg-surface-solid px-4 py-3 text-sm font-medium text-text transition-colors hover:bg-green-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
          >
            {option.label}
          </button>
        ))}
      </div>
      <p className="text-xs leading-relaxed text-text-muted">This reflection is optional.</p>
    </div>
  )
}
