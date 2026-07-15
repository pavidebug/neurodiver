import type { Strategy } from '@/types/strategy'

export function getStrategyEstimatedMinutes(strategy: Strategy): number | null {
  if (
    typeof strategy.estimatedMinutes === 'number' &&
    Number.isFinite(strategy.estimatedMinutes) &&
    strategy.estimatedMinutes > 0
  ) {
    return strategy.estimatedMinutes
  }

  const values = strategy.estimatedTime.match(/\d+(?:\.\d+)?/g)?.map(Number) ?? []
  if (values.length === 0) return null

  // Use the upper end of a range, so “5–10 min” is treated as 10 minutes.
  return Math.max(...values)
}

export function hasBuiltInStrategyTimer(strategy: Strategy): boolean {
  const estimatedMinutes = getStrategyEstimatedMinutes(strategy)
  return strategy.timerEnabled === true || (
    estimatedMinutes !== null && estimatedMinutes <= 5
  )
}

export function getStrategyTimerOptions(strategy: Strategy): number[] {
  const configuredOptions = strategy.timerOptions?.filter(
    (minutes) => Number.isFinite(minutes) && minutes > 0,
  )
  const estimatedMinutes = getStrategyEstimatedMinutes(strategy)
  const source = configuredOptions?.length
    ? configuredOptions
    : [estimatedMinutes ?? 5]

  return [...new Set(source)].sort((a, b) => a - b)
}
