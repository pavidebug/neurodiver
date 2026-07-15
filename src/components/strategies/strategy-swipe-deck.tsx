import { useCallback, useEffect, useRef, useState } from 'react'
import { Grid3X3, MoveHorizontal } from 'lucide-react'
import { StrategyCompactCard } from '@/components/strategies/strategy-compact-card'
import type { Strategy, StrategyFeedback } from '@/types/strategy'

interface StrategySwipeDeckProps {
  strategies: Strategy[]
  index: number
  onIndexChange: (index: number) => void
  isSaved: (strategyId: string) => boolean
  onToggleSave: (strategyId: string) => void
  onTryThis: (strategy: Strategy) => void
  onFeedback?: (strategyId: string, feedback: StrategyFeedback) => void
  getLastFeedback?: (strategyId: string) => StrategyFeedback | null | undefined
  savePending?: boolean
  disabled?: boolean
}

/**
 * Native horizontal card scroller. The historical component name is retained so
 * existing navigator flows do not need a separate migration.
 */
export function StrategySwipeDeck({
  strategies,
  index,
  onIndexChange,
  isSaved,
  onToggleSave,
  onTryThis,
  onFeedback,
  getLastFeedback,
  savePending = false,
  disabled = false,
}: StrategySwipeDeckProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const lastReportedIndex = useRef(index)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const container = scrollRef.current
    if (!container || strategies.length === 0) return

    const safeIndex = Math.min(Math.max(index, 0), strategies.length - 1)
    const card = container.children.item(safeIndex) as HTMLElement | null
    if (!card) return

    const targetLeft =
      card.offsetLeft -
      container.offsetLeft -
      (container.clientWidth - card.offsetWidth) / 2
    if (Math.abs(container.scrollLeft - targetLeft) > 8) {
      container.scrollTo({ left: targetLeft, behavior: 'smooth' })
    }
  }, [index, strategies.length])

  const handleScroll = useCallback(() => {
    const container = scrollRef.current
    if (!container || container.children.length === 0) return

    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    Array.from(container.children).forEach((child, childIndex) => {
      const card = child as HTMLElement
      const cardCenter = card.offsetLeft - container.offsetLeft + card.offsetWidth / 2
      const viewportCenter = container.scrollLeft + container.clientWidth / 2
      const distance = Math.abs(cardCenter - viewportCenter)
      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = childIndex
      }
    })

    if (closestIndex !== lastReportedIndex.current) {
      lastReportedIndex.current = closestIndex
      onIndexChange(closestIndex)
    }
  }, [onIndexChange])

  if (strategies.length === 0) return null

  const renderCard = (strategy: Strategy) => (
    <StrategyCompactCard
      strategy={strategy}
      isSaved={isSaved(strategy.id)}
      onToggleSave={() => onToggleSave(strategy.id)}
      onTryThis={() => onTryThis(strategy)}
      onFeedback={
        onFeedback
          ? (feedback) => onFeedback(strategy.id, feedback)
          : undefined
      }
      lastFeedback={getLastFeedback?.(strategy.id) ?? null}
      savePending={savePending}
      className={disabled ? 'pointer-events-none' : undefined}
    />
  )

  return (
    <div className="w-full min-w-0">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-text-muted">
          {strategies.length} matching strateg{strategies.length === 1 ? 'y' : 'ies'}
        </p>
        {strategies.length > 1 ? (
          <button
            type="button"
            onClick={() => setShowAll((current) => !current)}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-green/20 bg-surface-solid px-4 text-sm font-semibold text-green shadow-sm transition-colors hover:bg-green-muted/50"
          >
            {showAll ? (
              <MoveHorizontal className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Grid3X3 className="h-4 w-4" aria-hidden="true" />
            )}
            {showAll ? 'Card scroll' : 'See all'}
          </button>
        ) : null}
      </div>

      {showAll ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {strategies.map((strategy) => (
            <div key={strategy.id}>{renderCard(strategy)}</div>
          ))}
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            aria-label="Strategies"
            className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-[6%] pb-4 scroll-smooth [scrollbar-color:rgb(168_197_176/0.65)_transparent] [scrollbar-width:thin] sm:gap-5 sm:px-[14%] lg:px-[21%] xl:px-[26%]"
          >
            {strategies.map((strategy, strategyIndex) => (
              <div
                key={strategy.id}
                aria-current={strategyIndex === index ? 'true' : undefined}
                className={`w-[88%] min-w-[17rem] max-w-xl shrink-0 snap-center transition-all duration-300 ease-out sm:w-[72%] lg:w-[58%] xl:w-[48%] ${
                  strategyIndex === index
                    ? 'relative z-10 scale-100 opacity-100 saturate-100'
                    : 'scale-[0.9] opacity-45 saturate-50 brightness-90'
                }`}
              >
                {renderCard(strategy)}
              </div>
            ))}
          </div>

          {strategies.length > 1 ? (
            <div className="mt-1 flex items-center justify-center gap-2 text-xs font-medium text-text-muted">
              <MoveHorizontal className="h-4 w-4 text-green" aria-hidden="true" />
              Scroll left or right to explore
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
