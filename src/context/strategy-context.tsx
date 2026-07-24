import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { BrainStatusType } from '@/lib/data'
import type {
  Strategy,
  StrategyCategory,
  StrategyFeedback,
  StrategyFeedbackReason,
  StrategyUsageRecord,
  UserStrategyState,
} from '@/types/strategy'
import { EMPTY_STRATEGY_STATE } from '@/types/strategy'

interface StrategyContextValue {
  strategies: Strategy[]
  userState: UserStrategyState
  loading: boolean
  error: string | null
  getRecommended: (brainStatus: BrainStatusType, limit?: number) => Strategy[]
  getByCategory: (category: StrategyCategory) => Strategy[]
  getSaved: () => Strategy[]
  isSaved: (strategyId: string) => boolean
  toggleSaved: (strategyId: string) => Promise<boolean>
  trackView: (strategyId: string) => Promise<void>
  trackHelpful: (strategyId: string) => Promise<void>
  trackFeedback: (
    strategyId: string,
    feedback: StrategyFeedback,
    reason?: StrategyFeedbackReason,
  ) => Promise<void>
  clearError: () => void
}

const StrategyContext = createContext<StrategyContextValue | null>(null)

function createUsageRecord(
  existing: StrategyUsageRecord | undefined,
  updates: Partial<StrategyUsageRecord>,
): StrategyUsageRecord {
  return {
    timesViewed: existing?.timesViewed ?? 0,
    timesMarkedHelpful: existing?.timesMarkedHelpful ?? 0,
    lastViewedAt: existing?.lastViewedAt ?? null,
    lastMarkedHelpfulAt: existing?.lastMarkedHelpfulAt ?? null,
    lastFeedback: existing?.lastFeedback ?? null,
    lastFeedbackReason: existing?.lastFeedbackReason ?? null,
    lastFeedbackAt: existing?.lastFeedbackAt ?? null,
    ...updates,
  }
}

/**
 * Open Day uses session-only state. Nothing in this provider is persisted,
 * transmitted, or restored after a refresh.
 */
export function StrategyProvider({
  children,
  catalog = [],
}: {
  children: ReactNode
  catalog?: Strategy[]
}) {
  const [userState, setUserState] = useState<UserStrategyState>(
    EMPTY_STRATEGY_STATE,
  )

  const getRecommended = useCallback(
    (brainStatus: BrainStatusType, limit = 3) => {
      const active = catalog.filter((strategy) => strategy.isActive)
      const matching = active.filter((strategy) =>
        strategy.recommendedFor.includes(brainStatus),
      )
      return (matching.length > 0 ? matching : active).slice(0, limit)
    },
    [catalog],
  )

  const getByCategory = useCallback(
    (category: StrategyCategory) =>
      catalog.filter(
        (strategy) => strategy.isActive && strategy.category === category,
      ),
    [catalog],
  )

  const getSaved = useCallback(
    () =>
      catalog.filter((strategy) => userState.savedIds.includes(strategy.id)),
    [catalog, userState.savedIds],
  )

  const isSaved = useCallback(
    (strategyId: string) => userState.savedIds.includes(strategyId),
    [userState.savedIds],
  )

  const toggleSaved = useCallback(
    async (strategyId: string) => {
      const willSave = !userState.savedIds.includes(strategyId)
      setUserState((current) => ({
        ...current,
        savedIds: willSave
          ? [...current.savedIds, strategyId]
          : current.savedIds.filter((id) => id !== strategyId),
      }))
      return willSave
    },
    [userState.savedIds],
  )

  const trackView = useCallback(async (strategyId: string) => {
    const now = new Date().toISOString()
    setUserState((current) => {
      const existing = current.usage[strategyId]
      return {
        ...current,
        lastViewedId: strategyId,
        usage: {
          ...current.usage,
          [strategyId]: createUsageRecord(existing, {
            timesViewed: (existing?.timesViewed ?? 0) + 1,
            lastViewedAt: now,
          }),
        },
      }
    })
  }, [])

  const trackFeedback = useCallback(
    async (
      strategyId: string,
      feedback: StrategyFeedback,
      reason?: StrategyFeedbackReason,
    ) => {
      const now = new Date().toISOString()
      setUserState((current) => {
        const existing = current.usage[strategyId]
        const helped = feedback === 'helped'
        return {
          ...current,
          usage: {
            ...current.usage,
            [strategyId]: createUsageRecord(existing, {
              timesMarkedHelpful: helped
                ? (existing?.timesMarkedHelpful ?? 0) + 1
                : (existing?.timesMarkedHelpful ?? 0),
              lastMarkedHelpfulAt: helped
                ? now
                : (existing?.lastMarkedHelpfulAt ?? null),
              lastFeedback: feedback,
              lastFeedbackReason: reason ?? null,
              lastFeedbackAt: now,
            }),
          },
        }
      })
    },
    [],
  )

  const trackHelpful = useCallback(
    async (strategyId: string) => {
      await trackFeedback(strategyId, 'helped')
    },
    [trackFeedback],
  )

  const clearError = useCallback(() => undefined, [])

  const value = useMemo<StrategyContextValue>(
    () => ({
      strategies: catalog,
      userState,
      loading: false,
      error: null,
      getRecommended,
      getByCategory,
      getSaved,
      isSaved,
      toggleSaved,
      trackView,
      trackHelpful,
      trackFeedback,
      clearError,
    }),
    [
      catalog,
      userState,
      getRecommended,
      getByCategory,
      getSaved,
      isSaved,
      toggleSaved,
      trackView,
      trackHelpful,
      trackFeedback,
      clearError,
    ],
  )

  return (
    <StrategyContext.Provider value={value}>{children}</StrategyContext.Provider>
  )
}

export function useStrategies() {
  const context = useContext(StrategyContext)
  if (!context) {
    throw new Error('useStrategies must be used within StrategyProvider')
  }
  return context
}
