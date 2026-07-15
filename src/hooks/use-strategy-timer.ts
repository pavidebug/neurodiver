import { useCallback, useEffect, useMemo, useState } from 'react'
import { trackAnalyticsEvent } from '@/lib/product-analytics'
import { hasBuiltInStrategyTimer } from '@/lib/strategy-duration'
import type { Strategy } from '@/types/strategy'

const STORAGE_KEY = 'neurodiver:strategy-timer'

export type StrategyTimerReflection =
  | 'a-little-better'
  | 'no-change'
  | 'more-overwhelmed'
  | 'skip'

export interface PersistedStrategyTimer {
  strategyId: string
  selectedMinutes: number
  startedAt: number
  endTime: number
  paused: boolean
  remainingWhenPaused: number
}

interface TimerCompletion {
  finishedEarly: boolean
  actualDurationSeconds: number
}

function readStoredTimer(): PersistedStrategyTimer | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<PersistedStrategyTimer>
    if (
      typeof parsed.strategyId !== 'string' ||
      typeof parsed.selectedMinutes !== 'number' ||
      typeof parsed.startedAt !== 'number' ||
      typeof parsed.endTime !== 'number' ||
      typeof parsed.paused !== 'boolean' ||
      typeof parsed.remainingWhenPaused !== 'number'
    ) {
      return null
    }
    return parsed as PersistedStrategyTimer
  } catch {
    return null
  }
}

function persistTimer(timer: PersistedStrategyTimer | null) {
  try {
    if (timer) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timer))
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  } catch {
    // The timer still works when storage is unavailable.
  }
}

export function useStrategyTimer(
  strategies: Strategy[],
  userId: string | null,
  persistAnalytics: boolean,
) {
  const [timer, setTimer] = useState<PersistedStrategyTimer | null>(null)
  const [remainingMs, setRemainingMs] = useState(0)
  const [completion, setCompletion] = useState<TimerCompletion | null>(null)
  const [restored, setRestored] = useState(false)

  const activeStrategy = useMemo(
    () => strategies.find((strategy) => strategy.id === timer?.strategyId) ?? null,
    [strategies, timer?.strategyId],
  )

  const track = useCallback(
    (eventType: Parameters<typeof trackAnalyticsEvent>[1], metadata: Record<string, string | number | boolean | null>) => {
      if (!userId || !persistAnalytics) return
      void trackAnalyticsEvent(userId, eventType, metadata)
    },
    [persistAnalytics, userId],
  )

  const clearTimer = useCallback(() => {
    persistTimer(null)
    setTimer(null)
    setRemainingMs(0)
    setCompletion(null)
  }, [])

  useEffect(() => {
    if (restored || strategies.length === 0) return

    const stored = readStoredTimer()
    if (!stored) {
      persistTimer(null)
      setRestored(true)
      return
    }

    const strategy = strategies.find(
      (item) => item.id === stored.strategyId && hasBuiltInStrategyTimer(item),
    )
    const remaining = stored.paused
      ? stored.remainingWhenPaused
      : stored.endTime - Date.now()

    if (!strategy || remaining <= 0 || stored.selectedMinutes <= 0) {
      persistTimer(null)
      setRestored(true)
      return
    }

    setTimer(stored)
    setRemainingMs(remaining)
    setRestored(true)
  }, [restored, strategies])

  const enterCompletion = useCallback((finishedEarly: boolean) => {
    setTimer((current) => {
      if (!current) return null
      const actualDurationSeconds = Math.max(
        1,
        Math.round((Date.now() - current.startedAt) / 1000),
      )
      setCompletion({ finishedEarly, actualDurationSeconds })
      setRemainingMs(0)
      persistTimer(null)
      return current
    })
  }, [])

  useEffect(() => {
    if (!timer || timer.paused || completion) return

    const updateRemaining = () => {
      const next = Math.max(0, timer.endTime - Date.now())
      setRemainingMs(next)
      if (next === 0) enterCompletion(false)
    }

    updateRemaining()
    const intervalId = window.setInterval(updateRemaining, 250)
    document.addEventListener('visibilitychange', updateRemaining)

    return () => {
      window.clearInterval(intervalId)
      document.removeEventListener('visibilitychange', updateRemaining)
    }
  }, [completion, enterCompletion, timer])

  const start = useCallback(
    (strategy: Strategy, selectedMinutes: number) => {
      if (timer || !hasBuiltInStrategyTimer(strategy) || selectedMinutes <= 0) return false
      const now = Date.now()
      const next: PersistedStrategyTimer = {
        strategyId: strategy.id,
        selectedMinutes,
        startedAt: now,
        endTime: now + selectedMinutes * 60_000,
        paused: false,
        remainingWhenPaused: selectedMinutes * 60_000,
      }
      persistTimer(next)
      setCompletion(null)
      setTimer(next)
      setRemainingMs(next.remainingWhenPaused)
      track('strategy_timer_started', {
        strategyId: strategy.id,
        durationSelectedMinutes: selectedMinutes,
        startedAt: new Date(now).toISOString(),
      })
      return true
    },
    [timer, track],
  )

  const pause = useCallback(() => {
    if (!timer || timer.paused || completion) return
    const remaining = Math.max(0, timer.endTime - Date.now())
    const next = { ...timer, paused: true, remainingWhenPaused: remaining }
    persistTimer(next)
    setTimer(next)
    setRemainingMs(remaining)
    track('strategy_timer_paused', { strategyId: timer.strategyId })
  }, [completion, timer, track])

  const resume = useCallback(() => {
    if (!timer || !timer.paused || completion) return
    const next = {
      ...timer,
      paused: false,
      endTime: Date.now() + timer.remainingWhenPaused,
    }
    persistTimer(next)
    setTimer(next)
    setRemainingMs(timer.remainingWhenPaused)
    track('strategy_timer_resumed', { strategyId: timer.strategyId })
  }, [completion, timer, track])

  const addMinute = useCallback(() => {
    if (!timer || completion) return
    const next = timer.paused
      ? {
          ...timer,
          remainingWhenPaused: timer.remainingWhenPaused + 60_000,
        }
      : { ...timer, endTime: timer.endTime + 60_000 }
    persistTimer(next)
    setTimer(next)
    setRemainingMs((current) => current + 60_000)
  }, [completion, timer])

  const finishEarly = useCallback(() => {
    if (!timer || completion) return
    enterCompletion(true)
  }, [completion, enterCompletion, timer])

  const cancel = useCallback(() => {
    if (!timer) return
    track('strategy_timer_cancelled', {
      strategyId: timer.strategyId,
      durationSelectedMinutes: timer.selectedMinutes,
      actualDurationSeconds: Math.max(0, Math.round((Date.now() - timer.startedAt) / 1000)),
      completed: false,
      finishedEarly: false,
      startedAt: new Date(timer.startedAt).toISOString(),
      completedAt: new Date().toISOString(),
    })
    clearTimer()
  }, [clearTimer, timer, track])

  const submitReflection = useCallback(
    (reflection: StrategyTimerReflection) => {
      if (!timer || !completion) return
      track('strategy_timer_finished', {
        strategyId: timer.strategyId,
        durationSelectedMinutes: timer.selectedMinutes,
        actualDurationSeconds: completion.actualDurationSeconds,
        completed: !completion.finishedEarly,
        finishedEarly: completion.finishedEarly,
        reflection,
        startedAt: new Date(timer.startedAt).toISOString(),
        completedAt: new Date().toISOString(),
      })
      clearTimer()
    },
    [clearTimer, completion, timer, track],
  )

  return {
    timer,
    activeStrategy,
    remainingMs,
    completion,
    start,
    pause,
    resume,
    addMinute,
    finishEarly,
    cancel,
    submitReflection,
  }
}
