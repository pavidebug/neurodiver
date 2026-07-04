import { useCallback, useRef, useState } from 'react'
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

  const safeIndex =
    strategies.length > 0 ? ((index % strategies.length) + strategies.length) % strategies.length : 0
  const current = strategies[safeIndex]
  const next =
    strategies.length > 1
      ? strategies[(safeIndex + 1) % strategies.length]
      : null

  const finishSwipe = useCallback(
    (direction: 'left' | 'right') => {
      setExitDirection(direction)
      window.setTimeout(() => {
        if (direction === 'left') {
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

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (disabled || exitDirection || strategies.length <= 1) return

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
    <div className="relative mx-auto w-full max-w-md touch-none">
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
        className={cn('relative z-10', !dragging && !exitDirection && 'transition-transform duration-200 ease-out')}
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

      <p className="mt-4 text-center text-sm text-text-muted">
        {strategies.length > 1 ? 'Swipe left or right to browse' : null}
      </p>
    </div>
  )
}
