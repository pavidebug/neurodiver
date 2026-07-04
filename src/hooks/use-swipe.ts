import { useRef, type TouchEventHandler } from 'react'

interface UseSwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  threshold?: number
}

export function useSwipe({
  onSwipeLeft,
  onSwipeRight,
  threshold = 48,
}: UseSwipeOptions) {
  const start = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart: TouchEventHandler = (event) => {
    const touch = event.touches[0]
    start.current = { x: touch.clientX, y: touch.clientY }
  }

  const onTouchEnd: TouchEventHandler = (event) => {
    if (!start.current) return

    const touch = event.changedTouches[0]
    const deltaX = touch.clientX - start.current.x
    const deltaY = touch.clientY - start.current.y

    if (
      Math.abs(deltaX) > Math.abs(deltaY) &&
      Math.abs(deltaX) > threshold
    ) {
      if (deltaX < 0) {
        onSwipeLeft?.()
      } else {
        onSwipeRight?.()
      }
    }

    start.current = null
  }

  return { onTouchStart, onTouchEnd }
}
