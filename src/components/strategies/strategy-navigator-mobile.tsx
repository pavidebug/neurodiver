import { Stack } from '@/design-system/layout'
import { typeBodyMuted, typePageTitle } from '@/design-system/tokens'
import { useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { StrategyCategoryScroll } from '@/components/strategies/strategy-category-scroll'
import { HeroIllustration } from '@/components/illustrations'
import { StrategySavedBanner } from '@/components/strategies/strategy-saved-banner'
import { StrategySearch } from '@/components/strategies/strategy-search'
import { StrategySituationGrid } from '@/components/strategies/strategy-situation-grid'
import type { Strategy } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'
import { cn } from '@/lib/utils'

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
  onExploreBrowse: () => void
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
  onExploreBrowse,
}: StrategyNavigatorSharedProps) {
  const searchRef = useRef<HTMLDivElement>(null)

  return (
    <Stack className="pb-4">
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1.5">
          <h1 className={cn(typePageTitle, 'flex flex-wrap items-center gap-1.5')}>
            Help me find a strategy
            <Sparkles className="h-4 w-4 text-orange sm:h-5 sm:w-5" aria-hidden="true" />
          </h1>
          <p className={typeBodyMuted}>
            Search first, or tap a chip if you&apos;re not sure where to start.
          </p>
        </div>
        <HeroIllustration className="h-14 w-16 shrink-0" />
      </header>

      <section ref={searchRef}>
        <StrategySearch
          variant="landing"
          strategies={strategies}
          todayCheckIn={todayCheckIn}
          onSelectStrategy={onSearchSelect}
          onCantFind={onCantFind}
          onBackToNavigator={() => {}}
        />
      </section>

      <StrategyCategoryScroll onSelect={onCategorySelect} />

      <StrategySituationGrid onSelect={onSituationSelect} />

      <StrategySavedBanner
        variant="mobile"
        savedStrategies={savedStrategies}
        onSavedSelect={onSavedSelect}
        onExplore={onExploreBrowse}
        onViewAllSaved={onViewAllSaved}
      />
    </Stack>
  )
}
