import { Stack } from '@/design-system/layout'
import { StrategyNavigatorHeader } from '@/components/strategies/strategy-navigator-header'
import { StrategySituationGrid } from '@/components/strategies/strategy-situation-grid'
import type { StrategyNavigatorSharedProps } from '@/components/strategies/strategy-navigator-mobile'

export function StrategyNavigatorDesktop({
  onSituationSelect,
  visibleSections = {},
}: StrategyNavigatorSharedProps) {
  return (
    <Stack gap="section" className="pb-4">
      {visibleSections.header !== false ? <StrategyNavigatorHeader desktop /> : null}

      {visibleSections.situations !== false ? <StrategySituationGrid onSelect={onSituationSelect} /> : null}
    </Stack>
  )
}
