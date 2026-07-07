import type { Strategy } from '@/types/strategy'

export interface StrategySearchMatch {
  strategy: Strategy
  score: number
  /** Short label shown under the suggestion (user problem / challenge) */
  subtitle: string
}

const FIELD_WEIGHTS = {
  title: 12,
  challenge: 10,
  tags: 8,
  situation: 6,
} as const

function normalize(text: string): string {
  return text.toLowerCase().trim()
}

function tokenize(query: string): string[] {
  return normalize(query)
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

function scoreField(text: string, tokens: string[], weight: number): number {
  const normalized = normalize(text)
  if (!normalized) return 0

  let score = 0

  for (const token of tokens) {
    if (normalized === token) {
      score += weight * 3
      continue
    }

    if (normalized.startsWith(token)) {
      score += weight * 2
      continue
    }

    if (normalized.includes(token)) {
      score += weight
    }
  }

  return score
}

/** Rank strategies by relevance across user problem, challenge, title, tags, and situation. */
export function rankStrategySearch(
  strategies: Strategy[],
  query: string,
  limit = 8,
): StrategySearchMatch[] {
  const tokens = tokenize(query)
  if (tokens.length === 0) return []

  const matches = strategies
    .map((strategy) => {
      const score =
        scoreField(strategy.title, tokens, FIELD_WEIGHTS.title) +
        scoreField(strategy.challenge, tokens, FIELD_WEIGHTS.challenge) +
        scoreField(strategy.tags.join(' '), tokens, FIELD_WEIGHTS.tags) +
        scoreField(strategy.situation, tokens, FIELD_WEIGHTS.situation)

      return {
        strategy,
        score,
        subtitle: strategy.challenge,
      }
    })
    .filter((match) => match.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        a.strategy.title.localeCompare(b.strategy.title),
    )

  return matches.slice(0, limit)
}

/** Popular search terms derived from the most common user problems (challenges) in the catalog. */
export function getPopularSearchTerms(
  strategies: Strategy[],
  limit = 6,
): string[] {
  const counts = new Map<string, number>()

  for (const strategy of strategies) {
    const term = strategy.challenge.trim()
    if (!term) continue
    counts.set(term, (counts.get(term) ?? 0) + 1)
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([term]) => term)
}

export function getStrategiesForSearchTerm(
  strategies: Strategy[],
  term: string,
): Strategy[] {
  return rankStrategySearch(strategies, term, 50).map((match) => match.strategy)
}

/** Match strategies from free-text description plus an optional topic hint. */
export function matchStrategiesFromFreeText(
  strategies: Strategy[],
  description: string,
  topicKeywords = '',
  limit = 12,
): Strategy[] {
  const query = [description.trim(), topicKeywords.trim()].filter(Boolean).join(' ')
  if (!query) return []

  return rankStrategySearch(strategies, query, limit).map((match) => match.strategy)
}
