import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { HelpMeChoose } from '@/components/strategies/help-me-choose'
import {
  StrategyNavigatorHome,
  type NavigatorEntry,
} from '@/components/strategies/strategy-navigator-home'
import { StrategyDetailSheet } from '@/components/strategies/strategy-detail-sheet'
import { StrategySwipeDeck } from '@/components/strategies/strategy-swipe-deck'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { useStrategies } from '@/context/strategy-context'
import {
  filterSavedStrategies,
  filterStrategiesByBestWhen,
  filterStrategiesByCategory,
  searchStrategies,
} from '@/lib/strategy-filters'
import type { BestWhenLabel, Strategy, StrategyCategory } from '@/types/strategy'

type Screen = 'home' | 'flow'
type HelpStep = 'pick' | 'browse'

const ENTRY_TITLES: Record<NavigatorEntry, string> = {
  search: 'Search',
  'help-me-choose': 'Help Me Choose',
  saved: 'Saved Strategies',
}

export function StrategiesPage() {
  const { user } = useAuth()
  const {
    strategies,
    loading,
    error,
    isSaved,
    toggleSaved,
    trackView,
    getSaved,
    clearError,
  } = useStrategies()

  const [screen, setScreen] = useState<Screen>('home')
  const [entry, setEntry] = useState<NavigatorEntry>('search')
  const [helpStep, setHelpStep] = useState<HelpStep>('pick')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFeeling, setSelectedFeeling] = useState<BestWhenLabel | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<StrategyCategory | null>(
    null,
  )
  const [deckIndex, setDeckIndex] = useState(0)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetStrategy, setSheetStrategy] = useState<Strategy | null>(null)
  const [savePending, setSavePending] = useState(false)

  const savedStrategies = getSaved()

  const deckStrategies = useMemo(() => {
    if (entry === 'saved') {
      return filterSavedStrategies(
        strategies,
        savedStrategies.map((strategy) => strategy.id),
      )
    }

    if (entry === 'search') {
      return searchStrategies(strategies, searchQuery)
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
    savedStrategies,
    searchQuery,
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
  }, [entry, helpStep, searchQuery, selectedFeeling, selectedCategory])

  useEffect(() => {
    if (!currentStrategy || !user || screen !== 'flow' || helpStep === 'pick') return
    void trackView(currentStrategy.id)
  }, [currentStrategy?.id, user, trackView, screen, helpStep])

  const openEntry = useCallback((nextEntry: NavigatorEntry) => {
    setEntry(nextEntry)
    setHelpStep('pick')
    setSearchQuery('')
    setSelectedFeeling(null)
    setSelectedCategory(null)
    setSheetOpen(false)
    setSheetStrategy(null)
    setScreen('flow')
  }, [])

  const goBack = useCallback(() => {
    if (entry === 'help-me-choose' && helpStep === 'browse') {
      setHelpStep('pick')
      setSheetOpen(false)
      return
    }

    setScreen('home')
    setSheetOpen(false)
    setSheetStrategy(null)
  }, [entry, helpStep])

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
          savedCount={savedStrategies.length}
          onSelect={openEntry}
        />
      </div>
    )
  }

  const showingDeck =
    entry !== 'help-me-choose' || helpStep === 'browse'

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
            {ENTRY_TITLES[entry]}
          </h1>
          {showingDeck && deckStrategies.length > 0 && (
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

      {!user && (
        <p className="rounded-xl bg-yellow/20 px-4 py-3 text-sm text-text-muted">
          Sign in to save strategies.
        </p>
      )}

      {entry === 'search' && (
        <Input
          type="search"
          placeholder="Search by title, feeling, or challenge…"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          aria-label="Search strategies"
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

      {showingDeck && deckStrategies.length === 0 && (
        <div className="rounded-2xl border border-border bg-surface-solid px-5 py-12 text-center">
          <p className="text-lg text-text-muted">
            {entry === 'saved'
              ? 'No saved strategies yet. Browse and tap the bookmark to save one.'
              : entry === 'search'
                ? 'No strategies match your search.'
                : 'No strategies match those choices. Try a different feeling.'}
          </p>
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

      <StrategyDetailSheet
        strategy={sheetStrategy}
        open={sheetOpen}
        onClose={closeSheet}
      />
    </div>
  )
}
