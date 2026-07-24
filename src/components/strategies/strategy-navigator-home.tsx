import { StrategyNavigatorDesktop } from '@/components/strategies/strategy-navigator-desktop'
import {
  StrategyNavigatorMobile,
  type StrategyNavigatorSharedProps,
} from '@/components/strategies/strategy-navigator-mobile'
type StrategyNavigatorHomeProps = StrategyNavigatorSharedProps

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
