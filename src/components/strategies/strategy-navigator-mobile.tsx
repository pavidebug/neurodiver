import { Stack } from '@/design-system/layout'
import { StrategyNavigatorHeader } from '@/components/strategies/strategy-navigator-header'
import { StrategySituationGrid } from '@/components/strategies/strategy-situation-grid'

export interface StrategyNavigatorSharedProps {
  onSituationSelect: (situationId: string) => void
  visibleSections?: Record<string, boolean>
}

export function StrategyNavigatorMobile({
  onSituationSelect,
  visibleSections = {},
}: StrategyNavigatorSharedProps) {
  return (
    <Stack gap="section" className="pb-4">
      {visibleSections.header !== false ? <StrategyNavigatorHeader /> : null}

      {visibleSections.situations !== false ? <StrategySituationGrid onSelect={onSituationSelect} /> : null}
    </Stack>
  )
}
