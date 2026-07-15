import type { Strategy, StrategyUsageRecord } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'
import type { PulseMood } from '@/types/pulse-check-in'

export interface PulseRecommendationContext {
  mood: PulseMood | null
  energy: number | null
  focus: number | null
  stress: number | null
}

export function getPulseFields(checkIn: WorkCheckIn | null): PulseRecommendationContext {
  if (!checkIn) {
    return { mood: null, energy: null, focus: null, stress: null }
  }

  return {
    mood: (checkIn.mood as PulseMood | undefined) ?? null,
    energy: checkIn.energy ?? checkIn.energyTank ?? null,
    focus: checkIn.focus ?? null,
    stress: checkIn.stress ?? null,
  }
}

function scoreStrategy(
  strategy: Strategy,
  pulse: PulseRecommendationContext,
  helpfulBoost = 0,
): number {
  let score = 0
  const tags = strategy.tags.map((tag) => tag.toLowerCase())
  const category = strategy.category.toLowerCase()
  const hasTag = (...keywords: string[]) =>
    tags.some((tag) => keywords.some((keyword) => tag.includes(keyword)))

  if (pulse.energy !== null && pulse.energy <= 2) {
    if (
      category.includes('energy') ||
      hasTag('burnout', 'rest', 'recovery', 'low energy', 'energy conservation')
    ) {
      score += 3
    }
  }

  if (pulse.focus !== null && pulse.focus <= 2) {
    if (
      category.includes('executive') ||
      hasTag('focus', 'attention', 'task initiation', 'starting', 'prioritisation')
    ) {
      score += 3
    }
  }

  if (pulse.stress !== null && pulse.stress >= 4) {
    if (
      category.includes('emotional') ||
      category.includes('sensory') ||
      hasTag('overwhelm', 'stress', 'regulation', 'freeze', 'sensory')
    ) {
      score += 3
    }
  }

  if (pulse.mood === 'stressed' || pulse.mood === 'low') {
    if (category.includes('emotional') || strategy.energyRequired === 'Low') {
      score += 2
    }
  }

  if (pulse.mood === 'tired' && strategy.energyRequired === 'Low') {
    score += 2
  }

  if (helpfulBoost > 0) {
    score += helpfulBoost
  }

  return score
}

export function getPulseRecommendationCopy(pulse: PulseRecommendationContext): string {
  if (pulse.stress !== null && pulse.stress >= 4) {
    return 'Today might be a good day to try something calming and low-pressure.'
  }
  if (pulse.focus !== null && pulse.focus <= 2) {
    return 'Pick one small support to help you get started.'
  }
  if (pulse.energy !== null && pulse.energy <= 2) {
    return 'Today might be a good day to protect your energy.'
  }
  return 'Based on today’s check-in, here’s one strategy that may help.'
}

export function getRecommendedStrategiesFromPulse(
  strategies: Strategy[],
  checkIn: WorkCheckIn | null,
  limit = 3,
  usage: Record<string, Pick<StrategyUsageRecord, 'timesMarkedHelpful' | 'lastFeedback'>> = {},
): Strategy[] {
  const pulse = getPulseFields(checkIn)

  return [...strategies]
    .map((strategy) => {
      const record = usage[strategy.id]
      const helpfulBoost =
        (record?.timesMarkedHelpful ?? 0) > 0
          ? 2
          : record?.lastFeedback === 'helped'
            ? 1
            : record?.lastFeedback === 'not-helpful'
              ? -2
              : 0

      return {
        strategy,
        score: scoreStrategy(strategy, pulse, helpfulBoost),
      }
    })
    .sort((a, b) => b.score - a.score || a.strategy.order - b.strategy.order)
    .filter((entry) => entry.score > 0)
    .slice(0, limit)
    .map((entry) => entry.strategy)
}
