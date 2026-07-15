import { useRef } from 'react'
import { Stack } from '@/design-system/layout'
import { StrategyCategoryScroll } from '@/components/strategies/strategy-category-scroll'
import { StrategyNavigatorHeader } from '@/components/strategies/strategy-navigator-header'
import { StrategySavedBanner } from '@/components/strategies/strategy-saved-banner'
import { StrategySearch } from '@/components/strategies/strategy-search'
import { StrategySituationGrid } from '@/components/strategies/strategy-situation-grid'
import type { StrategyNavigatorSharedProps } from '@/components/strategies/strategy-navigator-mobile'

export function StrategyNavigatorDesktop({
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
      {visibleSections.header !== false ? <StrategyNavigatorHeader desktop /> : null}

      {visibleSections.situations !== false ? <StrategySituationGrid onSelect={onSituationSelect} /> : null}

      {visibleSections.search !== false ? <section
        ref={searchRef}
        className="w-full rounded-[1.5rem] border border-lavender/15 bg-gradient-to-br from-surface-solid to-lavender-muted/35 p-6 shadow-[var(--shadow-premium)]"
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
        variant="desktop"
        savedStrategies={savedStrategies}
        onSavedSelect={onSavedSelect}
        onViewAllSaved={onViewAllSaved}
      /> : null}
    </Stack>
  )
}
