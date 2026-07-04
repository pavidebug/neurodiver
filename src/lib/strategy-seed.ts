import type { StrategyDocument } from '@/types/strategy'

export interface StrategySeedEntry extends StrategyDocument {
  id: string
}

/** Fallback when Firestore catalog is empty — seed via npm run seed:strategies */
export const DEFAULT_STRATEGY_SEED: StrategySeedEntry[] = []
