import { Stack } from '@/design-system/layout'
import { useRef } from 'react'
import { StrategyCategoryScroll } from '@/components/strategies/strategy-category-scroll'
import { StrategyNavigatorHeader } from '@/components/strategies/strategy-navigator-header'
import { StrategySavedBanner } from '@/components/strategies/strategy-saved-banner'
import { StrategySearch } from '@/components/strategies/strategy-search'
import { StrategySituationGrid } from '@/components/strategies/strategy-situation-grid'
import type { Strategy } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'

export interface StrategyNavigatorSharedProps {
  strategies: Strategy[]
  savedStrategies: Strategy[]
  todayCheckIn: WorkCheckIn | null
  onSearchSelect: (
    strategy: Strategy,
    context: { searchTerm: string; resultsFound: number },
  ) => void
  onCantFind: (searchTerm: string) => void
  onSituationSelect: (situationId: string) => void
  onCategorySelect: (categoryId: string) => void
  onSavedSelect: (strategy: Strategy) => void
  onViewAllSaved: () => void
  visibleSections?: Record<string, boolean>
}

export function StrategyNavigatorMobile({
  strategies,
  savedStrategies,
  todayCheckIn,
  onSearchSelect,
  onCantFind,
  onSituationSelect,
  onCategorySelect,
  onSavedSelect,
  onViewAllSaved,
  visibleSections = {},
}: StrategyNavigatorSharedProps) {
  const searchRef = useRef<HTMLDivElement>(null)

  return (
    <Stack gap="card" className="pb-4">
      {visibleSections.header !== false ? <StrategyNavigatorHeader /> : null}

      {visibleSections.situations !== false ? <StrategySituationGrid onSelect={onSituationSelect} /> : null}

      {visibleSections.search !== false ? <section
        ref={searchRef}
        className="rounded-[1.5rem] border border-lavender/15 bg-gradient-to-br from-surface-solid to-lavender-muted/35 p-4 shadow-[var(--shadow-premium)] sm:p-6"
      >
        <p className="mb-3 text-sm font-semibold text-text">Search strategies</p>
        <StrategySearch
          variant="landing"
          strategies={strategies}
          todayCheckIn={todayCheckIn}
          onSelectStrategy={onSearchSelect}
          onCantFind={onCantFind}
          onBackToNavigator={() => {}}
        />
      </section> : null}

      {visibleSections.categories !== false ? <StrategyCategoryScroll onSelect={onCategorySelect} /> : null}

      {visibleSections.saved !== false ? <StrategySavedBanner
        variant="mobile"
        savedStrategies={savedStrategies}
        onSavedSelect={onSavedSelect}
        onViewAllSaved={onViewAllSaved}
      /> : null}
    </Stack>
  )
}
