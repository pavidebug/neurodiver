import {
  filterStrategiesByBestWhen,
  filterStrategiesByCategory,
} from '@/lib/strategy-filters'
import { getStrategiesForSearchTerm } from '@/lib/strategy-search'
import type { Strategy, StrategyCategory } from '@/types/strategy'

export interface SituationChip {
  id: string
  label: string
  searchTerms: string
}

export interface BrowseCategoryChip {
  id: string
  label: string
  emoji: string
}

export const SITUATION_CHIPS: SituationChip[] = [
  { id: 'starting-task', label: 'Starting a task', searchTerms: 'starting task initiation procrastinate begin' },
  { id: 'overwhelmed', label: 'Feeling overwhelmed', searchTerms: 'overwhelmed too much stress' },
  { id: 'masking', label: 'Masking all day', searchTerms: 'masking autistic social perform' },
  { id: 'low-energy', label: 'Low energy', searchTerms: 'low energy tired depleted exhausted' },
  { id: 'distractions', label: 'Constant distractions', searchTerms: 'distraction interruption focus attention' },
  { id: 'racing-thoughts', label: 'Racing thoughts', searchTerms: 'racing thoughts overwhelm mind anxious' },
  { id: 'time-blindness', label: 'Time blindness', searchTerms: 'time blindness deadline late schedule' },
]

export const BROWSE_CATEGORY_CHIPS: BrowseCategoryChip[] = [
  { id: 'focus', label: 'Focus', emoji: '🎯' },
  { id: 'energy', label: 'Energy', emoji: '⚡' },
  { id: 'executive-function', label: 'Executive Function', emoji: '🧠' },
  { id: 'emotional-regulation', label: 'Emotional Regulation', emoji: '💚' },
  { id: 'sensory', label: 'Sensory', emoji: '👂' },
  { id: 'communication', label: 'Communication', emoji: '💬' },
  { id: 'workplace', label: 'Workplace', emoji: '💼' },
  { id: 'recovery', label: 'Recovery', emoji: '🌿' },
]

const BROWSE_CATEGORY_MAP: Record<
  string,
  StrategyCategory | 'search' | 'best-when'
> = {
  energy: 'Energy & Burnout',
  'executive-function': 'Executive Function',
  'emotional-regulation': 'Emotional Regulation',
  sensory: 'Sensory Management',
  communication: 'Social & Communication',
  focus: 'search',
  workplace: 'search',
  recovery: 'best-when',
}

const BROWSE_SEARCH_TERMS: Record<string, string> = {
  focus: 'focus attention concentrate distract',
  workplace: 'work workplace meeting job',
}

export function filterStrategiesBySituation(
  strategies: Strategy[],
  situationId: string,
): Strategy[] {
  const chip = SITUATION_CHIPS.find((entry) => entry.id === situationId)
  if (!chip) return []

  return getStrategiesForSearchTerm(strategies, chip.searchTerms)
}

export function filterStrategiesByBrowseCategory(
  strategies: Strategy[],
  categoryId: string,
): Strategy[] {
  const mapping = BROWSE_CATEGORY_MAP[categoryId]

  if (mapping === 'best-when') {
    return filterStrategiesByBestWhen(strategies, 'Recovery Needed')
  }

  if (mapping === 'search') {
    const terms = BROWSE_SEARCH_TERMS[categoryId]
    return terms ? getStrategiesForSearchTerm(strategies, terms) : []
  }

  if (mapping) {
    return filterStrategiesByCategory(strategies, mapping)
  }

  return []
}

export function getSituationChipLabel(situationId: string): string {
  return SITUATION_CHIPS.find((entry) => entry.id === situationId)?.label ?? 'Strategies'
}

export function getBrowseCategoryLabel(categoryId: string): string {
  return (
    BROWSE_CATEGORY_CHIPS.find((entry) => entry.id === categoryId)?.label ??
    'Strategies'
  )
}
