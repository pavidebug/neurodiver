import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { StrategyCompactCard } from '@/components/strategies/strategy-compact-card'
import { cn } from '@/lib/utils'
import type { Strategy } from '@/types/strategy'

const SWIPE_THRESHOLD = 72
const MAX_ROTATION = 10
const EXIT_MS = 220

interface StrategySwipeDeckProps {
  strategies: Strategy[]
  index: number
  onIndexChange: (index: number) => void
  isSaved: (strategyId: string) => boolean
  onToggleSave: (strategyId: string) => void
  onTryThis: (strategy: Strategy) => void
  savePending?: boolean
  disabled?: boolean
}

export function StrategySwipeDeck({
  strategies,
  index,
  onIndexChange,
  isSaved,
  onToggleSave,
  onTryThis,
  savePending = false,
  disabled = false,
}: StrategySwipeDeckProps) {
  const [offsetX, setOffsetX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [exitDirection, setExitDirection] = useState<'left' | 'right' | null>(null)
  const startX = useRef(0)
  const startY = useRef(0)
  const lockedAxis = useRef<'x' | 'y' | null>(null)
  const deckRef = useRef<HTMLDivElement>(null)

  const safeIndex =
    strategies.length > 0 ? ((index % strategies.length) + strategies.length) % strategies.length : 0
  const current = strategies[safeIndex]
  const next =
    strategies.length > 1
      ? strategies[(safeIndex + 1) % strategies.length]
      : null

  const canNavigate = strategies.length > 1 && !disabled && !exitDirection

  const goNext = useCallback(() => {
    if (!canNavigate) return
    onIndexChange((safeIndex + 1) % strategies.length)
  }, [canNavigate, onIndexChange, safeIndex, strategies.length])

  const goPrev = useCallback(() => {
    if (!canNavigate) return
    onIndexChange((safeIndex - 1 + strategies.length) % strategies.length)
  }, [canNavigate, onIndexChange, safeIndex, strategies.length])

  const finishSwipe = useCallback(
    (direction: 'left' | 'right') => {
      setExitDirection(direction)
      window.setTimeout(() => {
        if (direction === 'right') {
          onIndexChange((safeIndex + 1) % strategies.length)
        } else {
          onIndexChange((safeIndex - 1 + strategies.length) % strategies.length)
        }
        setOffsetX(0)
        setExitDirection(null)
      }, EXIT_MS)
    },
    [onIndexChange, safeIndex, strategies.length],
  )

  const resetDrag = useCallback(() => {
    setDragging(false)
    lockedAxis.current = null
    setOffsetX(0)
  }, [])

  const shouldAllowSwipe = useCallback((pointerType: string) => {
    if (pointerType === 'mouse' && window.matchMedia('(min-width: 768px)').matches) {
      return false
    }
    return true
  }, [])

  const isInteractiveTarget = (target: EventTarget | null) => {
    if (!(target instanceof Element)) return false
    return Boolean(
      target.closest('button, a, input, textarea, select, [role="button"]'),
    )
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || exitDirection || strategies.length <= 1) return
    if (!shouldAllowSwipe(event.pointerType)) return
    if (isInteractiveTarget(event.target)) return

    startX.current = event.clientX
    startY.current = event.clientY
    lockedAxis.current = null
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging || exitDirection) return

    const deltaX = event.clientX - startX.current
    const deltaY = event.clientY - startY.current

    if (!lockedAxis.current) {
      if (Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return
      lockedAxis.current = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y'
    }

    if (lockedAxis.current === 'y') return

    event.preventDefault()
    setOffsetX(deltaX)
  }

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return

    event.currentTarget.releasePointerCapture(event.pointerId)

    if (lockedAxis.current === 'x' && Math.abs(offsetX) > SWIPE_THRESHOLD) {
      finishSwipe(offsetX < 0 ? 'left' : 'right')
    } else {
      resetDrag()
      return
    }

    setDragging(false)
    lockedAxis.current = null
  }

  const handlePointerCancel = () => {
    resetDrag()
  }

  useEffect(() => {
    if (disabled || strategies.length <= 1) return

    function handleKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target?.isContentEditable
      ) {
        return
      }

      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        goPrev()
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        goNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [disabled, strategies.length, goPrev, goNext])

  if (!current) return null

  const rotation = Math.max(-MAX_ROTATION, Math.min(MAX_ROTATION, offsetX / 20))
  const exitX = exitDirection === 'left' ? -520 : exitDirection === 'right' ? 520 : offsetX
  const exitRotate =
    exitDirection === 'left'
      ? -MAX_ROTATION * 1.5
      : exitDirection === 'right'
        ? MAX_ROTATION * 1.5
        : rotation

  return (
    <div ref={deckRef} className="w-full">
      <div className="flex items-center justify-center gap-4 md:gap-6">
        <DeckNavButton
          direction="prev"
          onClick={goPrev}
          disabled={!canNavigate}
        />

        <div className="relative w-full min-w-0 max-w-md max-md:touch-none md:max-w-xl lg:max-w-2xl">
          {next && (
            <div className="absolute inset-x-3 top-3 bottom-0 scale-[0.96] opacity-60">
              <StrategyCompactCard
                strategy={next}
                isSaved={isSaved(next.id)}
                onToggleSave={() => onToggleSave(next.id)}
                onTryThis={() => onTryThis(next)}
                className="pointer-events-none shadow-sm"
              />
            </div>
          )}

          <div
            className={cn(
              'relative z-10',
              !dragging && !exitDirection && 'transition-transform duration-200 ease-out',
            )}
            style={{
              transform: `translateX(${exitX}px) rotate(${exitRotate}deg)`,
              transitionDuration: exitDirection ? `${EXIT_MS}ms` : undefined,
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            <StrategyCompactCard
              strategy={current}
              isSaved={isSaved(current.id)}
              onToggleSave={() => onToggleSave(current.id)}
              onTryThis={() => onTryThis(current)}
              savePending={savePending}
            />
          </div>
        </div>

        <DeckNavButton
          direction="next"
          onClick={goNext}
          disabled={!canNavigate}
        />
      </div>

      {strategies.length > 1 && (
        <>
          <p className="mt-4 text-center text-sm text-text-muted md:hidden">
            Swipe right for next, left for previous
          </p>
          <p className="mt-4 hidden text-center text-sm text-text-muted md:block">
            Use the arrows to browse strategies.
          </p>
        </>
      )}
    </div>
  )
}

function DeckNavButton({
  direction,
  onClick,
  disabled,
}: {
  direction: 'prev' | 'next'
  onClick: () => void
  disabled: boolean
}) {
  const Icon = direction === 'prev' ? ChevronLeft : ChevronRight
  const label = direction === 'prev' ? 'Previous strategy' : 'Next strategy'

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'hidden md:flex',
        'h-14 w-14 shrink-0 items-center justify-center rounded-2xl',
        'border border-border bg-surface-solid text-text shadow-sm',
        'transition-colors hover:border-green/30 hover:bg-green-muted/50',
        'active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40',
      )}
    >
      <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
    </button>
  )
}
