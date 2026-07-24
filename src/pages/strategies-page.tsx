import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DescribeThankYou } from '@/components/strategies/describe-thank-you'
import { HelpMeChoose } from '@/components/strategies/help-me-choose'
import { HelpMeDescribe } from '@/components/strategies/help-me-describe'
import {
  StrategyNavigatorHome,
} from '@/components/strategies/strategy-navigator-home'
import type { NavigatorEntry } from '@/components/strategies/strategy-navigator-types'
import { StrategyDetailSheet } from '@/components/strategies/strategy-detail-sheet'
import { StrategySwipeDeck } from '@/components/strategies/strategy-swipe-deck'
import { StrategyBrowseScreen } from '@/components/strategies/strategy-browse-screen'
import { OpenDayDeckSwitcher } from '@/components/strategies/open-day-deck-switcher'
import { OpenDayCategoryBrowser } from '@/components/strategies/open-day-category-browser'
import { StrategySearch } from '@/components/strategies/strategy-search'
import { OpenDayVisualDeck } from '@/components/strategies/open-day-visual-deck'
import { Button } from '@/components/ui/button'
import { Stack } from '@/design-system/layout'
import { typePageTitle } from '@/design-system/tokens'
import {
  filterStrategiesBySituation,
  getSituationChipLabel,
} from '@/data/strategy-navigator-chips'
import { useStrategies } from '@/context/strategy-context'
import {
  filterSavedStrategies,
  filterStrategiesByBestWhen,
  filterStrategiesByCategory,
} from '@/lib/strategy-filters'
import { getStrategiesForSearchTerm } from '@/lib/strategy-search'
import {
  getOpenDayDeckVersion,
  getOpenDayStrategyPath,
  type OpenDayDeckVersion,
} from '@/lib/open-day'
import { OPEN_DAY_PRIMARY_STRATEGY_IDS } from '@/data/open-day-strategies'
import type { BestWhenLabel, Strategy, StrategyCategory } from '@/types/strategy'

type Screen = 'home' | 'flow'
type HelpStep = 'pick' | 'browse'
type DescribeStep = 'form' | 'results' | 'thank-you'

const ENTRY_TITLES: Record<NavigatorEntry, string> = {
  search: 'Strategies',
  browse: 'Browse',
  'help-me-choose': 'Help Me Find One',
  describe: "Tell us what's been happening",
  saved: 'Saved Strategies',
}

export function StrategiesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const deckVersion = getOpenDayDeckVersion(searchParams.get('version'))
  const handledDirectStrategyId = useRef<string | null>(null)
  const {
    strategies: catalogStrategies,
    loading,
    error,
    isSaved,
    toggleSaved,
    trackView,
    trackFeedback,
    userState,
    getSaved,
    clearError,
  } = useStrategies()
  const strategies = useMemo(
    () =>
      deckVersion === '3'
        ? catalogStrategies
        : catalogStrategies.filter((strategy) =>
            OPEN_DAY_PRIMARY_STRATEGY_IDS.has(strategy.id),
          ),
    [catalogStrategies, deckVersion],
  )

  const [screen, setScreen] = useState<Screen>('home')
  const [entry, setEntry] = useState<NavigatorEntry>('search')
  const [deckTitle, setDeckTitle] = useState<string>(ENTRY_TITLES.search)
  const [helpStep, setHelpStep] = useState<HelpStep>('pick')
  const [describeStep, setDescribeStep] = useState<DescribeStep>('form')
  const [describeDeck, setDescribeDeck] = useState<Strategy[]>([])
  const [describeRequestId, setDescribeRequestId] = useState<string | null>(null)
  const [describePrefill, setDescribePrefill] = useState('')
  const [searchDeck, setSearchDeck] = useState<Strategy[]>([])
  const [selectedFeeling, setSelectedFeeling] = useState<BestWhenLabel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | null>(
    null,
  )
  const [deckIndex, setDeckIndex] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetStrategy, setSheetStrategy] = useState<Strategy | null>(null)
  const [savePending, setSavePending] = useState(false)

  const savedStrategies = getSaved()

  useEffect(() => {
    const strategyId = searchParams.get('strategy')
    if (!strategyId || loading || handledDirectStrategyId.current === strategyId) return

    const strategy = strategies.find((item) => item.id === strategyId)
    if (!strategy) return

    handledDirectStrategyId.current = strategyId
    setSearchDeck([strategy])
    setDeckIndex(0)
    setDeckTitle(strategy.title)
    setEntry('search')
    setSheetStrategy(strategy)
    setSheetOpen(true)
    setScreen('flow')
  }, [loading, searchParams, strategies])

  const deckStrategies = useMemo(() => {
    if (entry === 'saved') {
      return filterSavedStrategies(
        strategies,
        savedStrategies.map((strategy) => strategy.id),
      )
    }

    if (entry === 'search') {
      return searchDeck
    }

    if (entry === 'describe' && describeStep === 'results') {
      return describeDeck
    }

    if (entry === 'help-me-choose' && helpStep === 'browse' && selectedFeeling) {
      let result = filterStrategiesByBestWhen(strategies, selectedFeeling)
      if (selectedCategory) {
        result = filterStrategiesByCategory(result, selectedCategory)
      }
      return result
    }

    return []
  }, [
    entry,
    helpStep,
    describeStep,
    savedStrategies,
    searchDeck,
    describeDeck,
    selectedCategory,
    selectedFeeling,
    strategies,
  ])

  const helpMatchCount = useMemo(() => {
    if (!selectedFeeling) return 0

    let result = filterStrategiesByBestWhen(strategies, selectedFeeling)
    if (selectedCategory) {
      result = filterStrategiesByCategory(result, selectedCategory)
    }
    return result.length
  }, [selectedCategory, selectedFeeling, strategies])

  const safeDeckIndex =
    deckStrategies.length > 0
      ? Math.min(deckIndex, deckStrategies.length - 1)
      : 0
  const currentStrategy = deckStrategies[safeDeckIndex]

  useEffect(() => {
    setDeckIndex(0)
  }, [
    entry,
    helpStep,
    describeStep,
    selectedFeeling,
    selectedCategory,
    searchDeck,
    describeDeck,
  ])

  useEffect(() => {
    if (!currentStrategy || screen !== 'flow' || helpStep === 'pick') return
    if (entry === 'search' && searchDeck.length === 0) return
    if (entry === 'describe' && describeStep !== 'results') return
    void trackView(currentStrategy.id)
  }, [
    currentStrategy?.id,
    trackView,
    screen,
    helpStep,
    entry,
    describeStep,
    searchDeck.length,
  ])

  const resetDescribeFlow = useCallback(() => {
    setDescribeStep('form')
    setDescribeDeck([])
    setDescribeRequestId(null)
  }, [])

  const openDeck = useCallback(
    (deck: Strategy[], title: string, nextEntry: NavigatorEntry = 'search') => {
      setSearchDeck(deck)
      setDeckIndex(0)
      setDeckTitle(title)
      setEntry(nextEntry)
      setSheetOpen(false)
      setSheetStrategy(null)
      setScreen('flow')
    },
    [],
  )

  const backToNavigatorHome = useCallback(() => {
    handledDirectStrategyId.current = null
    setSearchParams({ version: deckVersion }, { replace: true })
    setScreen('home')
    setSearchDeck([])
    setDeckTitle(ENTRY_TITLES.search)
    resetDescribeFlow()
    setDescribePrefill('')
    setSheetOpen(false)
    setSheetStrategy(null)
  }, [deckVersion, resetDescribeFlow, setSearchParams])

  const handleDeckVersionChange = useCallback(
    (nextVersion: OpenDayDeckVersion) => {
      handledDirectStrategyId.current = null
      setSearchParams({ version: nextVersion }, { replace: true })
      setScreen('home')
      setSearchDeck([])
      setDeckTitle(ENTRY_TITLES.search)
      resetDescribeFlow()
      setDescribePrefill('')
      setSheetOpen(false)
      setSheetStrategy(null)
    },
    [resetDescribeFlow, setSearchParams],
  )

  const openEntry = useCallback(
    (nextEntry: NavigatorEntry, options?: { describePrefill?: string }) => {
      setEntry(nextEntry)
      setHelpStep('pick')
      setSearchDeck([])
      resetDescribeFlow()
      setDescribePrefill(options?.describePrefill?.trim() ?? '')
      setSelectedFeeling(null)
      setSelectedCategory(null)
      setSheetOpen(false)
      setSheetStrategy(null)
      setScreen('flow')
    },
    [resetDescribeFlow],
  )

  const goBack = useCallback(() => {
    if (entry === 'help-me-choose' && helpStep === 'browse') {
      setHelpStep('pick')
      setSheetOpen(false)
      return
    }

    if (entry === 'describe' && describeStep === 'results') {
      resetDescribeFlow()
      setSheetOpen(false)
      return
    }

    if (entry === 'describe' && describeStep === 'thank-you') {
      backToNavigatorHome()
      return
    }

    backToNavigatorHome()
  }, [entry, helpStep, describeStep, resetDescribeFlow, backToNavigatorHome])

  const handleSearchSelect = useCallback(
    (strategy: Strategy, context: { searchTerm: string }) => {
      const results = getStrategiesForSearchTerm(strategies, context.searchTerm)
      const deck =
        results.length > 0
          ? results
          : strategies.filter((item) => item.id === strategy.id)

      const selectedIndex = deck.findIndex((item) => item.id === strategy.id)
      setSearchDeck(deck)
      setDeckIndex(selectedIndex >= 0 ? selectedIndex : 0)
    },
    [strategies],
  )

  const handleDescribeNoMatches = useCallback((requestId: string) => {
    setDescribeRequestId(requestId)
    setDescribeStep('thank-you')
  }, [])

  const handleCantFind = useCallback(
    (searchTerm: string) => {
      openEntry('describe', { describePrefill: searchTerm })
    },
    [openEntry],
  )

  const handleSituationSelect = useCallback(
    (situationId: string) => {
      const deck = filterStrategiesBySituation(strategies, situationId)
      openDeck(deck, getSituationChipLabel(situationId))
    },
    [strategies, openDeck],
  )

  const handleHomeSearchSelect = useCallback(
    (strategy: Strategy, context: { searchTerm: string }) => {
      handleSearchSelect(strategy, context)
      setDeckTitle(context.searchTerm.trim() || 'Search results')
      setEntry('search')
      setScreen('flow')
    },
    [handleSearchSelect],
  )

  const handleOpenDayCategorySelect = useCallback(
    (category: StrategyCategory, label: string) => {
      openDeck(filterStrategiesByCategory(strategies, category), label)
    },
    [openDeck, strategies],
  )

  const handleBrowseOpenStrategy = useCallback(
    (strategy: Strategy) => {
      setSheetStrategy(strategy)
      setSheetOpen(true)
      void trackView(strategy.id)
    },
    [trackView],
  )

  const handleBrowseSearchSelect = useCallback(
    (strategy: Strategy, context: { searchTerm: string; resultsFound: number }) => {
      handleSearchSelect(strategy, context)
      setDeckTitle(context.searchTerm.trim() || 'Strategies')
      setEntry('search')
    },
    [handleSearchSelect],
  )

  const openTryThis = useCallback((strategy: Strategy) => {
    setSheetStrategy(strategy)
    setSheetOpen(true)
  }, [])

  const closeSheet = useCallback(() => {
    if (searchParams.has('strategy')) {
      navigate(getOpenDayStrategyPath(deckVersion), { replace: true })
      return
    }

    setSheetOpen(false)
  }, [deckVersion, navigate, searchParams])

  const handleExploreOtherStrategies = useCallback(() => {
    handledDirectStrategyId.current = null
    setSearchParams({ version: deckVersion }, { replace: true })
    setSheetOpen(false)
    setSheetStrategy(null)
    setSearchDeck([])
    setDeckTitle(ENTRY_TITLES.search)
    setScreen('home')
  }, [deckVersion, setSearchParams])

  const handleToggleSave = useCallback(
    async (strategyId: string) => {
      clearError()
      setSavePending(true)

      try {
        await toggleSaved(strategyId)
      } finally {
        setSavePending(false)
      }
    },
    [toggleSaved, clearError],
  )

  if (loading) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <p className="text-sm text-text-muted">Loading strategies…</p>
      </div>
    )
  }

  if (strategies.length === 0) {
    return (
      <div className="page-enter space-y-4 text-center">
        <h1 className="font-display text-3xl font-semibold text-text">
          Strategy Navigator
        </h1>
        {error ? (
          <p className="text-text-muted" role="alert">
            {error}
          </p>
        ) : (
          <p className="text-text-muted">
            No strategies yet. Run{' '}
            <code className="rounded bg-yellow/30 px-1.5 py-0.5 text-sm">
              npm run seed:strategies
            </code>{' '}
            to upload the catalog.
          </p>
        )}
      </div>
    )
  }

  const detailSheet = (
    <StrategyDetailSheet
      strategy={sheetStrategy}
      open={sheetOpen}
      onClose={closeSheet}
      onExploreOther={handleExploreOtherStrategies}
      isSaved={sheetStrategy ? isSaved(sheetStrategy.id) : false}
      savePending={savePending}
      onToggleSave={(strategyId) => void handleToggleSave(strategyId)}
      onFeedback={(strategyId, feedback) =>
        void trackFeedback(strategyId, feedback)
      }
    />
  )

  if (searchParams.has('strategy') && sheetOpen) {
    return <div className="min-h-[60dvh]">{detailSheet}</div>
  }

  if (screen === 'home') {
    return (
      <div className="pb-4">
        <OpenDayDeckSwitcher
          version={deckVersion}
          onChange={handleDeckVersionChange}
        />
        {error && (
          <p
            className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
            role="alert"
          >
            {error}
          </p>
        )}
        {deckVersion === '1' ? (
          <section className="mb-5 rounded-[1.75rem] border border-border bg-surface-solid p-5 shadow-sm sm:p-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-green">
              Search strategies
            </p>
            <StrategySearch
              variant="landing"
              strategies={strategies}
              todayCheckIn={null}
              onSelectStrategy={handleHomeSearchSelect}
              onCantFind={handleCantFind}
              onBackToNavigator={() => undefined}
            />
          </section>
        ) : null}
        {deckVersion === '2' ? (
          <div className="mb-5">
            <OpenDayCategoryBrowser onSelect={handleOpenDayCategorySelect} />
          </div>
        ) : null}
        {deckVersion === '3' ? (
          <OpenDayVisualDeck
            strategies={strategies}
            onFeedback={(strategyId, feedback, reason) =>
              void trackFeedback(strategyId, feedback, reason)
            }
          />
        ) : (
          <StrategyNavigatorHome
            onSituationSelect={handleSituationSelect}
          />
        )}
        {detailSheet}
      </div>
    )
  }

  const showingDeck =
    entry === 'search' ||
    (entry === 'help-me-choose' && helpStep === 'browse') ||
    (entry === 'describe' && describeStep === 'results') ||
    entry === 'saved'

  return (
    <Stack className="pb-4">
      {!(entry === 'describe' && describeStep === 'form') ? (
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl"
          aria-label="Back"
          onClick={goBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
          <div className="min-w-0 flex-1">
            <h1 className={typePageTitle}>
              {entry === 'help-me-choose'
                ? ENTRY_TITLES[entry]
                : entry === 'describe'
                  ? ENTRY_TITLES[entry]
                  : entry === 'saved'
                    ? ENTRY_TITLES.saved
                    : entry === 'browse'
                      ? ENTRY_TITLES.browse
                      : deckTitle}
            </h1>
            {deckStrategies.length > 0 && entry !== 'browse' && (
              <p className="text-sm text-text-muted">
                {safeDeckIndex + 1} of {deckStrategies.length}
              </p>
            )}
          </div>
      </div>
      ) : null}

      {error && (
        <p
          className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
          role="alert"
        >
          {error}
        </p>
      )}

      {entry === 'browse' && (
        <StrategyBrowseScreen
          strategies={strategies}
          todayCheckIn={null}
          onOpenStrategy={handleBrowseOpenStrategy}
          onSearchSelect={handleBrowseSearchSelect}
          onCantFind={handleCantFind}
        />
      )}

      {entry === 'describe' && describeStep === 'form' && (
        <HelpMeDescribe
          strategies={strategies}
          todayCheckIn={null}
          onNoMatches={handleDescribeNoMatches}
          onBack={backToNavigatorHome}
          initialDescription={describePrefill}
          variant="simple"
        />
      )}

      {entry === 'describe' && describeStep === 'thank-you' && describeRequestId && (
        <DescribeThankYou
          requestId={describeRequestId}
          onBack={backToNavigatorHome}
        />
      )}

      {entry === 'help-me-choose' && helpStep === 'pick' && (
        <HelpMeChoose
          selectedFeeling={selectedFeeling}
          selectedCategory={selectedCategory}
          onFeelingChange={setSelectedFeeling}
          onCategoryChange={setSelectedCategory}
          onContinue={() => setHelpStep('browse')}
          matchCount={helpMatchCount}
        />
      )}

      {entry === 'describe' && describeStep === 'results' && (
        <p className="text-base leading-relaxed text-text">
          We found a few strategies that might help.
        </p>
      )}

      {showingDeck && deckStrategies.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface-solid px-5 py-12 text-center">
          <p className="text-lg text-text-muted">
            {entry === 'saved'
              ? 'No saved strategies yet. Browse and tap the bookmark to save one.'
              : 'No strategies match that filter yet. Try another chip or search manually.'}
          </p>
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={backToNavigatorHome}
          >
            Back to Strategy Navigator
          </Button>
        </div>
      )}

      {showingDeck && deckStrategies.length > 0 && (
        <StrategySwipeDeck
          strategies={deckStrategies}
          index={safeDeckIndex}
          onIndexChange={setDeckIndex}
          isSaved={isSaved}
          onToggleSave={(strategyId) => void handleToggleSave(strategyId)}
          onTryThis={openTryThis}
          onFeedback={(strategyId, feedback) =>
            void trackFeedback(strategyId, feedback)
          }
          getLastFeedback={(strategyId) =>
            userState.usage[strategyId]?.lastFeedback ?? null
          }
          savePending={savePending}
          disabled={sheetOpen}
        />
      )}

      {entry === 'help-me-choose' && helpStep === 'browse' && deckStrategies.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface-solid px-5 py-12 text-center">
          <p className="text-lg text-text-muted">
            No strategies match those choices. Try a different feeling.
          </p>
        </div>
      )}

      <StrategyDetailSheet
        strategy={sheetStrategy}
        open={sheetOpen}
        onClose={closeSheet}
        onExploreOther={handleExploreOtherStrategies}
        isSaved={sheetStrategy ? isSaved(sheetStrategy.id) : false}
        savePending={savePending}
        onToggleSave={(strategyId) => void handleToggleSave(strategyId)}
        onFeedback={(strategyId, feedback) =>
          void trackFeedback(strategyId, feedback)
        }
      />
    </Stack>
  )
}
