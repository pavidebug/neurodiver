import { useCallback, useEffect, useMemo, useState } from 'react'
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
import { Button } from '@/components/ui/button'
import {
  filterStrategiesByBrowseCategory,
  filterStrategiesBySituation,
  getBrowseCategoryLabel,
  getSituationChipLabel,
} from '@/data/strategy-navigator-chips'
import { useAuth } from '@/context/auth-context'
import { useStrategies } from '@/context/strategy-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { getBrainStatusFromWorkCheckIn } from '@/lib/strategy-analytics'
import {
  filterSavedStrategies,
  filterStrategiesByBestWhen,
  filterStrategiesByCategory,
} from '@/lib/strategy-filters'
import { getStrategiesForSearchTerm } from '@/lib/strategy-search'
import type { BestWhenLabel, Strategy, StrategyCategory } from '@/types/strategy'

type Screen = 'home' | 'flow'
type HelpStep = 'pick' | 'browse'
type DescribeStep = 'form' | 'results' | 'thank-you'

const ENTRY_TITLES: Record<NavigatorEntry, string> = {
  search: 'Strategies',
  'help-me-choose': 'Help Me Find One',
  describe: "Tell us what's been happening",
  saved: 'Saved Strategies',
}

export function StrategiesPage() {
  const { user } = useAuth()
  const { todayCheckIn } = useWorkEnergy()
  const {
    strategies,
    loading,
    error,
    isSaved,
    toggleSaved,
    trackView,
    getSaved,
    getRecommended,
    clearError,
  } = useStrategies()

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

  const recommendedStrategies = useMemo(() => {
    const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)
    if (!brainStatus) return []
    return getRecommended(brainStatus, 5)
  }, [todayCheckIn, getRecommended])

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
    if (!currentStrategy || !user || screen !== 'flow' || helpStep === 'pick') return
    if (entry === 'search' && searchDeck.length === 0) return
    if (entry === 'describe' && describeStep !== 'results') return
    void trackView(currentStrategy.id)
  }, [
    currentStrategy?.id,
    user,
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
    setScreen('home')
    setSearchDeck([])
    setDeckTitle(ENTRY_TITLES.search)
    resetDescribeFlow()
    setDescribePrefill('')
    setSheetOpen(false)
    setSheetStrategy(null)
  }, [resetDescribeFlow])

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

  const handleDescribeMatches = useCallback((matches: Strategy[]) => {
    setDescribeDeck(matches)
    setDescribeStep('results')
    setDeckIndex(0)
  }, [])

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

  const handleCategorySelect = useCallback(
    (categoryId: string) => {
      const deck = filterStrategiesByBrowseCategory(strategies, categoryId)
      openDeck(deck, getBrowseCategoryLabel(categoryId))
    },
    [strategies, openDeck],
  )

  const handleRecommendedSelect = useCallback(
    (strategy: Strategy) => {
      const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)
      const deck = brainStatus ? getRecommended(brainStatus, 5) : [strategy]
      const selectedIndex = deck.findIndex((item) => item.id === strategy.id)
      setSearchDeck(deck)
      setDeckIndex(selectedIndex >= 0 ? selectedIndex : 0)
      setDeckTitle('Recommended for you today')
      setEntry('search')
      setScreen('flow')
    },
    [todayCheckIn, getRecommended],
  )

  const handleHomeSearchSelect = useCallback(
    (strategy: Strategy, context: { searchTerm: string }) => {
      handleSearchSelect(strategy, context)
      setDeckTitle(context.searchTerm.trim() || 'Strategies')
      setEntry('search')
      setScreen('flow')
    },
    [handleSearchSelect],
  )

  const handleSavedSelect = useCallback(
    (strategy: Strategy) => {
      const deck = savedStrategies
      const selectedIndex = deck.findIndex((item) => item.id === strategy.id)
      setSearchDeck(deck)
      setDeckIndex(selectedIndex >= 0 ? selectedIndex : 0)
      setDeckTitle(ENTRY_TITLES.saved)
      setEntry('saved')
      setScreen('flow')
    },
    [savedStrategies],
  )

  const openTryThis = useCallback((strategy: Strategy) => {
    setSheetStrategy(strategy)
    setSheetOpen(true)
  }, [])

  const closeSheet = useCallback(() => {
    setSheetOpen(false)
  }, [])

  const handleToggleSave = useCallback(
    async (strategyId: string) => {
      if (!user) return

      clearError()
      setSavePending(true)

      try {
        await toggleSaved(strategyId)
      } finally {
        setSavePending(false)
      }
    },
    [user, toggleSaved, clearError],
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
    />
  )

  if (screen === 'home') {
    return (
      <div className="page-enter pb-4">
        {error && (
          <p
            className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
            role="alert"
          >
            {error}
          </p>
        )}
        <StrategyNavigatorHome
          strategies={strategies}
          savedStrategies={savedStrategies}
          recommendedStrategies={recommendedStrategies}
          todayCheckIn={todayCheckIn}
          onSearchSelect={handleHomeSearchSelect}
          onCantFind={handleCantFind}
          onSituationSelect={handleSituationSelect}
          onCategorySelect={handleCategorySelect}
          onRecommendedSelect={handleRecommendedSelect}
          onSavedSelect={handleSavedSelect}
        />
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
    <div className="page-enter space-y-5 pb-4">
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
          <h1 className="font-display text-xl font-semibold text-text">
            {entry === 'help-me-choose'
              ? ENTRY_TITLES[entry]
              : entry === 'describe'
                ? ENTRY_TITLES[entry]
                : entry === 'saved'
                  ? ENTRY_TITLES.saved
                  : deckTitle}
          </h1>
          {deckStrategies.length > 0 && (
            <p className="text-sm text-text-muted">
              {safeDeckIndex + 1} of {deckStrategies.length}
            </p>
          )}
        </div>
      </div>

      {error && (
        <p
          className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
          role="alert"
        >
          {error}
        </p>
      )}

      {!user && entry !== 'describe' && (
        <p className="rounded-xl bg-yellow/20 px-4 py-3 text-sm text-text-muted">
          Sign in to save strategies and submit requests.
        </p>
      )}

      {entry === 'describe' && describeStep === 'form' && (
        <HelpMeDescribe
          strategies={strategies}
          todayCheckIn={todayCheckIn}
          onMatchesFound={handleDescribeMatches}
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
      />
    </div>
  )
}
