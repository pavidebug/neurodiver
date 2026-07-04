import type { StrategyCategory } from '@/types/strategy'

export const STRATEGY_CATEGORIES: StrategyCategory[] = [
  'Executive Function',
  'Emotional Regulation',
  'Sensory Management',
  'Social & Communication',
  'Daily Living',
  'Energy & Burnout',
]

export const CATEGORY_SHORT_LABELS: Record<StrategyCategory, string> = {
  'Executive Function': 'Executive',
  'Emotional Regulation': 'Emotional',
  'Sensory Management': 'Sensory',
  'Social & Communication': 'Social',
  'Daily Living': 'Daily living',
  'Energy & Burnout': 'Energy',
}
