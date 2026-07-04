import { Link } from 'react-router-dom'
import { Activity, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatDisplayDate, getWeekStart, getTodayString } from '@/lib/dates'
import {
  getEaseLabel,
  getEnergyTankLabel,
  getSupportLabel,
} from '@/lib/work-check-in-labels'
import { getCheckInsForDateRange } from '@/lib/work-check-ins'
import { useWorkEnergy } from '@/context/work-energy-context'

export function EnergyPatternsPage() {
  const { checkIns, loading, currentWeekId } = useWorkEnergy()

  const weekStart = getTodayString(getWeekStart())
  const weekEnd = getTodayString()
  const weekCheckIns = getCheckInsForDateRange(checkIns, weekStart, weekEnd)

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
              here. Reports and trends arrive in a later phase.
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

      <Card>
        <CardContent className="space-y-2 p-5">
          <p className="font-medium text-text">Coming in Phase D</p>
          <p className="text-sm leading-relaxed text-text-muted">
            Weekly and monthly reports, trend charts, and downloadable summaries
            will build on the check-in data saved here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
