import { useEffect, useState } from 'react'
import {
  formatCountdown,
  getCountdownTo,
  type CountdownParts,
} from '@/lib/focus-session-format'

export function useCountdown(target: Date | null, intervalMs = 1000): CountdownParts | null {
  const [parts, setParts] = useState<CountdownParts | null>(() =>
    target ? getCountdownTo(target) : null,
  )

  useEffect(() => {
    if (!target) {
      setParts(null)
      return
    }

    const tick = () => setParts(getCountdownTo(target))
    tick()

    const timer = window.setInterval(tick, intervalMs)
    return () => window.clearInterval(timer)
  }, [target, intervalMs])

  return parts
}

export { formatCountdown }
