import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Search } from 'lucide-react'
import { StrategyRequestPanel } from '@/components/strategies/strategy-request-panel'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import {
  getBrainStatusFromWorkCheckIn,
  logStrategySearch,
} from '@/lib/strategy-analytics'
import {
  getPopularSearchTerms,
  rankStrategySearch,
  type StrategySearchMatch,
} from '@/lib/strategy-search'
import type { Strategy } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'
import { useAuth } from '@/context/auth-context'

interface StrategySearchProps {
  strategies: Strategy[]
  todayCheckIn: WorkCheckIn | null
  onSelectStrategy: (
    strategy: Strategy,
    context: { searchTerm: string; resultsFound: number },
  ) => void
  onBackToNavigator: () => void
  variant?: 'landing' | 'flow'
  onCantFind?: (searchTerm: string) => void
}

const MIN_QUERY_LENGTH = 2
const SEARCH_DEBOUNCE_MS = 450

export function StrategySearch({
  strategies,
  todayCheckIn,
  onSelectStrategy,
  onBackToNavigator,
  variant = 'flow',
  onCantFind,
}: StrategySearchProps) {
  const isLanding = variant === 'landing'
  const { user } = useAuth()
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [showRequestPanel, setShowRequestPanel] = useState(false)
  const [requestSearchTerm, setRequestSearchTerm] = useState<string | null>(null)
  const lastLoggedQuery = useRef('')

  const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)
  const popularTerms = useMemo(
    () => getPopularSearchTerms(strategies),
    [strategies],
  )

  const suggestions = useMemo(
    () => rankStrategySearch(strategies, debouncedQuery),
    [strategies, debouncedQuery],
  )

  const liveSuggestions = useMemo(
    () => rankStrategySearch(strategies, query.trim()),
    [strategies, query],
  )

  const trimmedQuery = query.trim()
  const showDropdown = isFocused && !showRequestPanel
  const hasQuery = trimmedQuery.length >= MIN_QUERY_LENGTH
  const showSuggestions = showDropdown && hasQuery && suggestions.length > 0
  const showNoResults = showDropdown && hasQuery && suggestions.length === 0
  const showPopular =
    !isLanding && showDropdown && !hasQuery && popularTerms.length > 0

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQuery(trimmedQuery)
    }, SEARCH_DEBOUNCE_MS)

    return () => window.clearTimeout(timer)
  }, [trimmedQuery])

  useEffect(() => {
    setActiveIndex(-1)
    if (!isLanding || !onCantFind) {
      setShowRequestPanel(false)
      setRequestSearchTerm(null)
    }
  }, [trimmedQuery, isLanding, onCantFind])

  useEffect(() => {
    if (!user || debouncedQuery.length < MIN_QUERY_LENGTH) return
    if (debouncedQuery === lastLoggedQuery.current) return

    lastLoggedQuery.current = debouncedQuery
    const resultsFound = rankStrategySearch(strategies, debouncedQuery).length

    void logStrategySearch({
      userId: user.uid,
      searchTerm: debouncedQuery,
      resultsFound,
      selectedStrategy: null,
      brainStatus,
    }).catch(() => {})
  }, [brainStatus, debouncedQuery, strategies, user])

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [])

  const handleSelect = useCallback(
    (match: StrategySearchMatch) => {
      const resultsFound = suggestions.length

      if (user) {
        void logStrategySearch({
          userId: user.uid,
          searchTerm: debouncedQuery || match.strategy.challenge,
          resultsFound,
          selectedStrategy: match.strategy.id,
          brainStatus,
        }).catch(() => {})
      }

      onSelectStrategy(match.strategy, {
        searchTerm: debouncedQuery || match.strategy.challenge,
        resultsFound,
      })
      setIsFocused(false)
      setShowRequestPanel(false)
    },
    [brainStatus, debouncedQuery, onSelectStrategy, suggestions.length, user],
  )

  const handleTermSelect = useCallback((term: string) => {
    setQuery(term)
    setDebouncedQuery(term)
    setIsFocused(true)
    lastLoggedQuery.current = ''
  }, [])

  const handleCantFind = useCallback(() => {
    if (!trimmedQuery) return
    setIsFocused(false)
    if (onCantFind) {
      onCantFind(trimmedQuery)
      return
    }
    setRequestSearchTerm(trimmedQuery)
    setShowRequestPanel(true)
  }, [onCantFind, trimmedQuery])

  const closeRequestPanel = useCallback(() => {
    setShowRequestPanel(false)
    setRequestSearchTerm(null)
    if (!isLanding) {
      onBackToNavigator()
    }
  }, [isLanding, onBackToNavigator])

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (liveSuggestions.length > 0) {
        event.preventDefault()
        const index = activeIndex >= 0 ? activeIndex : 0
        handleSelect(liveSuggestions[index])
        return
      }

      if (trimmedQuery.length >= MIN_QUERY_LENGTH) {
        event.preventDefault()
        handleCantFind()
      }

      return
    }

    if (!showSuggestions && !showNoResults) return

    const optionCount = showSuggestions ? suggestions.length : 1

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((prev) => Math.min(prev + 1, optionCount - 1))
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((prev) => Math.max(prev - 1, 0))
    }

    if (event.key === 'Escape') {
      setIsFocused(false)
      setShowRequestPanel(false)
    }
  }

  return (
    <div ref={containerRef} className="space-y-3">
      <div className="relative">
        <Search
          className={cn(
            'pointer-events-none absolute top-1/2 -translate-y-1/2 text-text-muted',
            isLanding ? 'left-5 h-6 w-6' : 'left-4 h-5 w-5',
          )}
          aria-hidden="true"
        />
        <Input
          type="search"
          role="combobox"
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          placeholder="What are you struggling with today?"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            'pl-12 text-base shadow-sm',
            isLanding ? 'h-16 rounded-2xl pl-14 text-lg' : 'h-14',
          )}
        />

        {showDropdown && (showPopular || showSuggestions || showNoResults) && (
          <div
            id={listboxId}
            role="listbox"
            className="absolute top-[calc(100%+0.5rem)] right-0 left-0 z-20 overflow-hidden rounded-2xl border border-border bg-surface-solid shadow-lg"
          >
            {showPopular && (
              <div className="p-4">
                <p className="mb-3 text-sm font-medium text-text-muted">
                  Popular searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {popularTerms.map((term) => (
                    <button
                      key={term}
                      type="button"
                      className="rounded-full bg-cream px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-yellow/40"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleTermSelect(term)}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {showSuggestions && (
              <ul className="max-h-[min(40dvh,280px)] overflow-y-auto py-2">
                {suggestions.map((match, index) => (
                  <li key={match.strategy.id} role="presentation">
                    <button
                      id={`${listboxId}-option-${index}`}
                      type="button"
                      role="option"
                      aria-selected={activeIndex === index}
                      className={cn(
                        'w-full px-4 py-3 text-left transition-colors',
                        activeIndex === index
                          ? 'bg-green-muted/70'
                          : 'hover:bg-cream',
                      )}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => handleSelect(match)}
                    >
                      <p className="line-clamp-2 text-base leading-snug text-text">
                        &ldquo;{match.strategy.situation}&rdquo;
                      </p>
                      <p className="mt-1 text-sm text-text-muted">
                        {match.subtitle}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {showNoResults && (
              <div className="border-t border-border p-2">
                <button
                  id={`${listboxId}-option-0`}
                  type="button"
                  role="option"
                  aria-selected={activeIndex === 0}
                  className={cn(
                    'w-full rounded-xl px-4 py-3 text-left transition-colors',
                    activeIndex === 0 ? 'bg-green-muted/70' : 'hover:bg-cream',
                  )}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={handleCantFind}
                >
                  <p className="text-sm font-medium text-text">
                    <span aria-hidden="true">💬 </span>
                    Can&apos;t find what you&apos;re looking for?
                  </p>
                  <p className="mt-1 text-sm text-text-muted">
                    Tell us what&apos;s been happening.
                  </p>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {!isLanding && showRequestPanel && (
        <StrategyRequestPanel
          searchTerm={requestSearchTerm}
          todayCheckIn={todayCheckIn}
          onBack={closeRequestPanel}
          className="slide-up"
        />
      )}
    </div>
  )
}
