import { Heart } from 'lucide-react'
import {
  FilterChipRow,
  SelectableChip,
} from '@/components/strategies/filter-chip-row'
import { StrategySearch } from '@/components/strategies/strategy-search'
import {
  BROWSE_CATEGORY_CHIPS,
  SITUATION_CHIPS,
} from '@/data/strategy-navigator-chips'
import { getStatusLabel } from '@/lib/data'
import { getBrainStatusFromWorkCheckIn } from '@/lib/strategy-analytics'
import type { Strategy } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'

interface StrategyNavigatorHomeProps {
  strategies: Strategy[]
  savedStrategies: Strategy[]
  recommendedStrategies: Strategy[]
  todayCheckIn: WorkCheckIn | null
  onSearchSelect: (
    strategy: Strategy,
    context: { searchTerm: string; resultsFound: number },
  ) => void
  onCantFind: (searchTerm: string) => void
  onSituationSelect: (situationId: string) => void
  onCategorySelect: (categoryId: string) => void
  onRecommendedSelect: (strategy: Strategy) => void
  onSavedSelect: (strategy: Strategy) => void
}

export function StrategyNavigatorHome({
  strategies,
  savedStrategies,
  recommendedStrategies,
  todayCheckIn,
  onSearchSelect,
  onCantFind,
  onSituationSelect,
  onCategorySelect,
  onRecommendedSelect,
  onSavedSelect,
}: StrategyNavigatorHomeProps) {
  const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)

  return (
    <div className="space-y-8 pb-4">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          Help me find a strategy
        </h1>
        <p className="mt-2 text-base text-text-muted">
          Search first, or tap a chip if you&apos;re not sure where to start.
        </p>
      </header>

      <section className="space-y-3">
        <StrategySearch
          variant="landing"
          strategies={strategies}
          todayCheckIn={todayCheckIn}
          onSelectStrategy={onSearchSelect}
          onCantFind={onCantFind}
          onBackToNavigator={() => {}}
        />
      </section>

      {brainStatus && recommendedStrategies.length > 0 && (
        <section aria-labelledby="recommended-heading" className="space-y-3">
          <div>
            <h2
              id="recommended-heading"
              className="text-base font-medium text-text"
            >
              Recommended for you today
            </h2>
            <p className="text-sm text-text-muted">
              Based on your {getStatusLabel(brainStatus).toLowerCase()} brain status
            </p>
          </div>
          <div className="-mx-5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
            <div className="flex w-max min-w-full gap-3">
              {recommendedStrategies.map((strategy) => (
                <button
                  key={strategy.id}
                  type="button"
                  onClick={() => onRecommendedSelect(strategy)}
                  className="w-64 shrink-0 rounded-2xl border border-green/20 bg-green-muted/40 px-4 py-4 text-left transition-colors hover:border-green/40 hover:bg-green-muted/60 active:scale-[0.99]"
                >
                  <p className="line-clamp-3 text-sm leading-relaxed text-text">
                    &ldquo;{strategy.situation}&rdquo;
                  </p>
                  <p className="mt-2 text-xs text-text-muted">{strategy.category}</p>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <FilterChipRow label="I'm struggling with…" layout="wrap">
        {SITUATION_CHIPS.map((chip) => (
          <SelectableChip
            key={chip.id}
            label={chip.label}
            onClick={() => onSituationSelect(chip.id)}
          />
        ))}
      </FilterChipRow>

      <FilterChipRow label="Browse by category">
        {BROWSE_CATEGORY_CHIPS.map((chip) => (
          <SelectableChip
            key={chip.id}
            label={chip.label}
            onClick={() => onCategorySelect(chip.id)}
          />
        ))}
      </FilterChipRow>

      <section className="space-y-3 border-t border-border pt-8">
        <h2 className="flex items-center gap-2 text-base font-medium text-text">
          <Heart className="h-4 w-4 text-orange" aria-hidden="true" />
          Saved Strategies
        </h2>

        {savedStrategies.length === 0 ? (
          <p className="text-sm text-text-muted">
            You haven&apos;t saved any strategies yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {savedStrategies.map((strategy) => (
              <li key={strategy.id}>
                <button
                  type="button"
                  onClick={() => onSavedSelect(strategy)}
                  className="w-full rounded-xl border border-border bg-cream/50 px-4 py-3 text-left transition-colors hover:border-green/20 hover:bg-yellow/15"
                >
                  <p className="line-clamp-2 text-sm leading-relaxed text-text">
                    &ldquo;{strategy.situation}&rdquo;
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export type { NavigatorEntry } from '@/components/strategies/strategy-navigator-types'
