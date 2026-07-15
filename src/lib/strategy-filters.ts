import type { BestWhenLabel, Strategy, StrategyCategory } from '@/types/strategy'
import { getStrategyEstimatedMinutes } from '@/lib/strategy-duration'

export function searchStrategies(strategies: Strategy[], query: string): Strategy[] {
  const normalized = query.trim().toLowerCase()
  if (!normalized) return strategies

  return strategies.filter((strategy) => {
    const haystack = [
      strategy.title,
      strategy.situation,
      strategy.challenge,
      strategy.category,
      ...strategy.tags,
    ]
      .join(' ')
      .toLowerCase()

    return haystack.includes(normalized)
  })
}

export function filterStrategiesByBestWhen(
  strategies: Strategy[],
  bestWhen: BestWhenLabel,
): Strategy[] {
  return strategies.filter((strategy) => strategy.bestWhen.includes(bestWhen))
}

export function filterStrategiesByCategory(
  strategies: Strategy[],
  category: StrategyCategory,
): Strategy[] {
  return strategies.filter((strategy) => strategy.category === category)
}

export function filterSavedStrategies(
  strategies: Strategy[],
  savedIds: string[],
): Strategy[] {
  const saved = new Set(savedIds)
  return strategies.filter((strategy) => saved.has(strategy.id))
}

export function filterStrategiesUnderMinutes(
  strategies: Strategy[],
  maximumMinutes: number,
): Strategy[] {
  return strategies.filter((strategy) => {
    const estimatedMinutes = getStrategyEstimatedMinutes(strategy)
    return estimatedMinutes !== null && estimatedMinutes <= maximumMinutes
  })
}
