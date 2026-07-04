import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { BestWhenLabel, StrategyCategory } from '@/types/strategy'
import { STRATEGY_CATEGORIES } from '@/data/strategy-categories'

const FEELING_OPTIONS: { label: BestWhenLabel; hint: string }[] = [
  { label: 'Running Low', hint: 'Tired, depleted, running on fumes' },
  { label: 'Steady', hint: 'Okay — not great, not awful' },
  { label: 'High Energy', hint: 'Focused and ready to go' },
  { label: 'Recovery Needed', hint: 'Burned out or overstimulated' },
]

interface HelpMeChooseProps {
  selectedFeeling: BestWhenLabel | null
  selectedCategory: StrategyCategory | null
  onFeelingChange: (feeling: BestWhenLabel) => void
  onCategoryChange: (category: StrategyCategory | null) => void
  onContinue: () => void
  matchCount: number
}

export function HelpMeChoose({
  selectedFeeling,
  selectedCategory,
  onFeelingChange,
  onCategoryChange,
  onContinue,
  matchCount,
}: HelpMeChooseProps) {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-semibold text-text">
          How are you feeling?
        </h2>
        <p className="text-text-muted">
          Pick what fits right now. We&apos;ll show strategies that match.
        </p>
      </header>

      <div className="space-y-3">
        {FEELING_OPTIONS.map((option) => (
          <button
            key={option.label}
            type="button"
            onClick={() => onFeelingChange(option.label)}
            aria-pressed={selectedFeeling === option.label}
            className={cn(
              'w-full rounded-2xl border px-5 py-4 text-left transition-colors',
              selectedFeeling === option.label
                ? 'border-green bg-green-muted/50 ring-2 ring-green/30'
                : 'border-border bg-surface-solid hover:border-green/20',
            )}
          >
            <p className="font-semibold text-text">{option.label}</p>
            <p className="mt-1 text-sm text-text-muted">{option.hint}</p>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <p className="text-sm font-medium text-text-muted">
          Optional — narrow by area
        </p>
        <div className="flex flex-wrap gap-2">
          <FilterChip
            active={selectedCategory === null}
            onClick={() => onCategoryChange(null)}
          >
            Any area
          </FilterChip>
          {STRATEGY_CATEGORIES.map((category) => (
            <FilterChip
              key={category}
              active={selectedCategory === category}
              onClick={() =>
                onCategoryChange(selectedCategory === category ? null : category)
              }
            >
              {category}
            </FilterChip>
          ))}
        </div>
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={!selectedFeeling || matchCount === 0}
        onClick={onContinue}
      >
        {matchCount === 0
          ? 'No matches — try another feeling'
          : `Show ${matchCount} ${matchCount === 1 ? 'strategy' : 'strategies'}`}
      </Button>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full px-3 py-1.5 text-sm font-medium transition-colors',
        active
          ? 'bg-green text-white'
          : 'bg-surface-solid text-text-muted ring-1 ring-border hover:bg-yellow/30',
      )}
    >
      {children}
    </button>
  )
}
