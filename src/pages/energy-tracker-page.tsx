import { useMemo } from 'react'
import { Download, Flame, TrendingUp } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCheckIn } from '@/context/check-in-context'
import { getStatusColor, getStatusLabel } from '@/lib/data'

export function EnergyTrackerPage() {
  const { energyHistory, getStreak } = useCheckIn()
  const streak = getStreak()

  const weeklyAverage = useMemo(() => {
    const recent = energyHistory.slice(-7)
    if (recent.length === 0) return 0
    return (
      Math.round(
        (recent.reduce((sum, entry) => sum + entry.average, 0) / recent.length) *
          10,
      ) / 10
    )
  }, [energyHistory])

  const handleDownload = (period: 'weekly' | 'monthly') => {
    const entries =
      period === 'weekly' ? energyHistory.slice(-7) : energyHistory

    const csv = [
      'Date,Status,Average Score',
      ...entries.map(
        (entry) =>
          `${entry.date},${getStatusLabel(entry.status)},${entry.average}`,
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `neurodiver-${period}-report.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="page-enter space-y-8">
      <header>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          Energy Tracker
        </h1>
        <p className="mt-2 text-base text-text-muted">
          Patterns over time — not perfection.
        </p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-green-muted/50">
          <CardContent className="flex flex-col items-center p-5 text-center">
            <Flame className="mb-2 h-8 w-8 text-orange" aria-hidden="true" />
            <p className="text-3xl font-bold text-text">{streak}</p>
            <p className="text-sm text-text-muted">Day streak</p>
          </CardContent>
        </Card>
        <Card className="bg-yellow/30">
          <CardContent className="flex flex-col items-center p-5 text-center">
            <TrendingUp
              className="mb-2 h-8 w-8 text-green"
              aria-hidden="true"
            />
            <p className="text-3xl font-bold text-text">{weeklyAverage}</p>
            <p className="text-sm text-text-muted">Weekly avg</p>
          </CardContent>
        </Card>
      </div>

      <section aria-labelledby="trend-heading">
        <h2
          id="trend-heading"
          className="font-display mb-4 text-xl font-semibold text-text"
        >
          Recent check-ins
        </h2>
        <div className="space-y-3">
          {[...energyHistory].reverse().map((entry) => (
            <Card key={entry.date} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-3 w-3 rounded-full ${getStatusColor(entry.status)}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p className="font-medium text-text">
                      {formatDate(entry.date)}
                    </p>
                    <p className="text-sm text-text-muted">
                      Score: {entry.average}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">{getStatusLabel(entry.status)}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section aria-labelledby="reports-heading">
        <h2
          id="reports-heading"
          className="font-display mb-4 text-xl font-semibold text-text"
        >
          Download reports
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => handleDownload('weekly')}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Weekly report
          </Button>
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => handleDownload('monthly')}
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            Monthly report
          </Button>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Visual trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="flex h-32 items-end justify-between gap-2"
            role="img"
            aria-label="Bar chart of recent energy scores"
          >
            {energyHistory.slice(-7).map((entry) => (
              <div
                key={entry.date}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className={`w-full max-w-8 rounded-t-lg ${getStatusColor(entry.status)} transition-all`}
                  style={{ height: `${(entry.average / 5) * 100}%` }}
                />
                <span className="text-[10px] text-text-muted">
                  {new Date(entry.date).toLocaleDateString('en-US', {
                    weekday: 'narrow',
                  })}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
