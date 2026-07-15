import { useMemo, useState } from 'react'
import { StrategyBrowseCard, StrategyBrowseUnlockCard } from '@/components/strategies/strategy-browse-card'
import { FilterChipRow, SelectableChip } from '@/components/strategies/filter-chip-row'
import { StrategySearch } from '@/components/strategies/strategy-search'
import {
  BROWSE_CATEGORY_CHIPS,
  filterStrategiesByBrowseCategory,
} from '@/data/strategy-navigator-chips'
import type { Strategy } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'
import { cn } from '@/lib/utils'
import { filterStrategiesUnderMinutes } from '@/lib/strategy-filters'

const FREE_PREVIEW_LIMIT = 3

type BrowseTab = 'browse' | 'search'

interface StrategyBrowseScreenProps {
  strategies: Strategy[]
  todayCheckIn: WorkCheckIn | null
  onOpenStrategy: (strategy: Strategy) => void
  onSearchSelect: (
    strategy: Strategy,
    context: { searchTerm: string; resultsFound: number },
  ) => void
  onCantFind: (searchTerm: string) => void
}

export function StrategyBrowseScreen({
  strategies,
  todayCheckIn,
  onOpenStrategy,
  onSearchSelect,
  onCantFind,
}: StrategyBrowseScreenProps) {
  const [tab, setTab] = useState<BrowseTab>('browse')
  const [filterId, setFilterId] = useState('all')

  const filteredStrategies = useMemo(() => {
    if (filterId === 'all') return strategies
    if (filterId === 'under-5') {
      return filterStrategiesUnderMinutes(strategies, 5)
    }
    return filterStrategiesByBrowseCategory(strategies, filterId)
  }, [filterId, strategies])

  const visibleStrategies = filteredStrategies.slice(0, FREE_PREVIEW_LIMIT)
  const lockedCount = Math.max(0, filteredStrategies.length - FREE_PREVIEW_LIMIT)

  return (
    <div className="flex min-h-0 flex-col gap-5">
      <div
        role="tablist"
        aria-label="Browse or search strategies"
        className="flex shrink-0 gap-6 border-b border-border/70"
      >
        {(['browse', 'search'] as const).map((item) => (
          <button
            key={item}
            type="button"
            role="tab"
            aria-selected={tab === item}
            onClick={() => setTab(item)}
            className={cn(
              'relative pb-3 text-base font-medium capitalize transition-colors',
              tab === item ? 'text-text' : 'text-text-muted hover:text-text',
            )}
          >
            {item}
            {tab === item ? (
              <span
                className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-green"
                aria-hidden="true"
              />
            ) : null}
          </button>
        ))}
      </div>

      {tab === 'browse' ? (
        <div role="tabpanel" className="flex min-h-0 flex-1 flex-col gap-4">
          <FilterChipRow label="Filter" layout="wrap" className="shrink-0">
            <SelectableChip
              label="All"
              emoji="✨"
              selected={filterId === 'all'}
              onClick={() => setFilterId('all')}
            />
            <SelectableChip
              label="Under 5 minutes"
              emoji="⏱️"
              selected={filterId === 'under-5'}
              onClick={() => setFilterId('under-5')}
            />
            {BROWSE_CATEGORY_CHIPS.map((chip) => (
              <SelectableChip
                key={chip.id}
                label={chip.label}
                emoji={chip.emoji}
                selected={filterId === chip.id}
                onClick={() => setFilterId(chip.id)}
              />
            ))}
          </FilterChipRow>

          {visibleStrategies.length === 0 ? (
            <p className="rounded-2xl border border-border bg-surface-solid px-5 py-12 text-center text-text-muted">
              No strategies in this category yet. Try another filter.
            </p>
          ) : (
            <div
              className="relative min-h-[min(72dvh,40rem)] flex-1 overflow-hidden sm:rounded-[1.5rem]"
              aria-label="Strategy feed"
            >
              <div
                className="h-full snap-y snap-mandatory overflow-y-auto scroll-smooth [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {visibleStrategies.map((strategy) => (
                  <div key={strategy.id} className="h-full snap-start snap-always shrink-0 pb-3">
                    <StrategyBrowseCard
                      strategy={strategy}
                      fullHeight
                      onOpen={() => onOpenStrategy(strategy)}
                    />
                  </div>
                ))}

                {lockedCount > 0 ? (
                  <div className="h-full snap-start snap-always shrink-0">
                    <StrategyBrowseUnlockCard lockedCount={lockedCount} />
                  </div>
                ) : null}
              </div>

              {visibleStrategies.length > 1 ? (
                <p
                  className="pointer-events-none absolute inset-x-0 bottom-3 text-center text-[10px] font-medium tracking-wide text-text-muted/80 uppercase"
                  aria-hidden="true"
                >
                  Scroll for more
                </p>
              ) : null}
            </div>
          )}
        </div>
      ) : (
        <div role="tabpanel">
          <StrategySearch
            variant="flow"
            strategies={strategies}
            todayCheckIn={todayCheckIn}
            onSelectStrategy={onSearchSelect}
            onCantFind={onCantFind}
            onBackToNavigator={() => setTab('browse')}
          />
        </div>
      )}
    </div>
  )
}
