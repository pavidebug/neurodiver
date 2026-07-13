import { useMemo } from 'react'
import { ExploreInsightsTiles } from '@/components/insights/explore-insights-tiles'
import { InsightsEmptyState } from '@/components/insights/insights-empty-state'
import { InsightsPageHeader } from '@/components/insights/insights-page-header'
import { MainInsightCard } from '@/components/insights/main-insight-card'
import { MonthlyPatternsCard } from '@/components/insights/monthly-patterns-card'
import {
  WeeklyResetCard,
  WeeklyResetLink,
} from '@/components/insights/weekly-reset-section'
import { Stack } from '@/design-system/layout'
import { useStrategies } from '@/context/strategy-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import {
  EXPLORE_INSIGHT_TILES,
  getMonthlyInsightProgress,
  getPrimaryInsight,
  hasVeryLittleInsightData,
  shouldShowWeeklyResetCard,
} from '@/lib/personal-insights'
import { countWeekCheckIns } from '@/lib/weekly-report'

export function InsightsPage() {
  const { checkIns, monthlyCheckInCount } = useWorkEnergy()
  const { strategies, userState } = useStrategies()

  const primaryInsight = useMemo(
    () => getPrimaryInsight(checkIns, strategies, userState),
    [checkIns, strategies, userState],
  )
  const monthlyProgress = getMonthlyInsightProgress(monthlyCheckInCount)
  const weekCheckInCount = countWeekCheckIns(checkIns)
  const veryLittleData = hasVeryLittleInsightData(checkIns, userState)
  const showWeeklyCard = shouldShowWeeklyResetCard(weekCheckInCount)

  return (
    <Stack className="mx-auto w-full max-w-3xl pb-6 lg:max-w-4xl lg:pb-10">
      <InsightsPageHeader className="mb-8" />

      <div className="space-y-6">
        {veryLittleData ? (
          <InsightsEmptyState />
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            <MainInsightCard insight={primaryInsight} />
            <MonthlyPatternsCard
              current={monthlyProgress.current}
              target={monthlyProgress.target}
              remaining={monthlyProgress.remaining}
              unlocked={monthlyProgress.unlocked}
            />
          </div>
        )}

        {veryLittleData ? (
          <MonthlyPatternsCard
            current={monthlyProgress.current}
            target={monthlyProgress.target}
            remaining={monthlyProgress.remaining}
            unlocked={monthlyProgress.unlocked}
          />
        ) : null}

        {showWeeklyCard ? (
          <WeeklyResetCard />
        ) : (
          <WeeklyResetLink />
        )}

        <ExploreInsightsTiles tiles={EXPLORE_INSIGHT_TILES} muted={veryLittleData} />
      </div>
    </Stack>
  )
}
