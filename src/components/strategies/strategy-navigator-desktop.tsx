import { useRef } from 'react'
import { Sparkles } from 'lucide-react'
import { Stack } from '@/design-system/layout'
import { typeBodyMuted, typePageTitle } from '@/design-system/tokens'
import { StrategyCategoryScroll } from '@/components/strategies/strategy-category-scroll'
import { HeroIllustration } from '@/components/illustrations'
import { StrategySavedBanner } from '@/components/strategies/strategy-saved-banner'
import { StrategySearch } from '@/components/strategies/strategy-search'
import { StrategySituationGrid } from '@/components/strategies/strategy-situation-grid'
import type { StrategyNavigatorSharedProps } from '@/components/strategies/strategy-navigator-mobile'
import { cn } from '@/lib/utils'

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
  onExploreBrowse,
}: StrategyNavigatorSharedProps) {
  const searchRef = useRef<HTMLDivElement>(null)

  return (
    <Stack className="pb-4">
      <header className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          <h1 className={cn(typePageTitle, 'flex flex-wrap items-center gap-2')}>
            Help me find a strategy
            <Sparkles className="h-6 w-6 text-orange lg:h-7 lg:w-7" aria-hidden="true" />
          </h1>
          <p className={cn(typeBodyMuted, 'max-w-2xl')}>
            Search first, or tap a chip if you&apos;re not sure where to start.
          </p>
        </div>
        <HeroIllustration className="hidden h-20 w-24 shrink-0 xl:block xl:h-[5.5rem] xl:w-28" />
      </header>

      <section ref={searchRef} className="w-full">
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
        variant="desktop"
        savedStrategies={savedStrategies}
        onSavedSelect={onSavedSelect}
        onExplore={onExploreBrowse}
        onViewAllSaved={onViewAllSaved}
      />
    </Stack>
  )
}
