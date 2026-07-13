import { StrategyNavigatorDesktop } from '@/components/strategies/strategy-navigator-desktop'
import {
  StrategyNavigatorMobile,
  type StrategyNavigatorSharedProps,
} from '@/components/strategies/strategy-navigator-mobile'
import type { Strategy } from '@/types/strategy'

interface StrategyNavigatorHomeProps extends StrategyNavigatorSharedProps {
  recommendedStrategies?: Strategy[]
  onRecommendedSelect?: (strategy: Strategy) => void
}

export function StrategyNavigatorHome(sharedProps: StrategyNavigatorHomeProps) {
  return (
    <>
      <div className="lg:hidden">
        <StrategyNavigatorMobile {...sharedProps} />
      </div>

      <div className="hidden lg:block">
        <StrategyNavigatorDesktop {...sharedProps} />
      </div>
    </>
  )
}

export type { NavigatorEntry } from '@/components/strategies/strategy-navigator-types'
