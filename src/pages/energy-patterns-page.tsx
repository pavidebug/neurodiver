import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDisplayDate, getWeekStart, getTodayString } from '@/lib/dates'
import {
  countWeekCheckIns,
  WEEKLY_REPORT_MIN_CHECK_INS,
} from '@/lib/weekly-report'
import {
  getEaseLabel,
  getEnergyTankLabel,
  getSupportLabel,
} from '@/lib/work-check-in-labels'
import { getCheckInsForDateRange } from '@/lib/work-check-ins'
import { useWorkEnergy } from '@/context/work-energy-context'

export function EnergyPatternsPage() {
  const { checkIns, loading, currentWeekId } = useWorkEnergy()

  const weekStart = getWeekStart()
  const weekStartStr = getTodayString(weekStart)
  const weekEndStr = getTodayString()
  const weekCheckIns = getCheckInsForDateRange(checkIns, weekStartStr, weekEndStr)
  const weekCheckInCount = countWeekCheckIns(checkIns, weekStart)

  if (loading) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <p className="text-sm text-text-muted">Loading patterns…</p>
      </div>
    )
  }

  return (
    <div className="page-enter space-y-8">
      <header>
        <p className="mb-1 text-sm font-medium uppercase tracking-widest text-green">
          Energy Patterns
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          Your work energy over time
        </h1>
        <p className="mt-2 text-base text-text-muted">
          Patterns, not perfection — weekly reports start Monday ({currentWeekId}).
        </p>
      </header>

      <Card className="border-green/20 bg-green-muted/30">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <BarChart3 className="mt-0.5 h-6 w-6 shrink-0 text-green" aria-hidden="true" />
            <div>
              <p className="font-medium text-text">Weekly Insights</p>
              <p className="text-sm text-text-muted">
                {weekCheckInCount >= WEEKLY_REPORT_MIN_CHECK_INS
                  ? 'Your weekly report is ready to view.'
                  : `You've completed ${weekCheckInCount} of ${WEEKLY_REPORT_MIN_CHECK_INS} check-ins this week.`}
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/weekly-insights">View Weekly Insights</Link>
          </Button>
        </CardContent>
      </Card>

      {weekCheckIns.length === 0 ? (
        <Card className="border-yellow bg-yellow/20">
          <CardContent className="space-y-4 p-6 text-center">
            <Activity
              className="mx-auto h-10 w-10 text-green"
              aria-hidden="true"
            />
            <p className="font-medium text-text">No check-ins this week yet</p>
            <p className="text-sm leading-relaxed text-text-muted">
              Complete your first Work Energy Check-in to start seeing patterns
              here.
            </p>
            <Button asChild>
              <Link to="/work-check-in">
                Start Work Check-in
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <section aria-labelledby="recent-heading">
          <h2
            id="recent-heading"
            className="font-display mb-4 text-xl font-semibold text-text"
          >
            This week
          </h2>
          <div className="space-y-3">
            {weekCheckIns.map((checkIn) => (
              <Card key={checkIn.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text">
                      {formatDisplayDate(checkIn.date)}
                    </p>
                    <p className="text-sm text-text-muted">
                      {getEnergyTankLabel(checkIn.energyTank)} ·{' '}
                      {getEaseLabel(checkIn.maskingLoad)}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-green">
                    {getSupportLabel(checkIn.supportFelt)}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
