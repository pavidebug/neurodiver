import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BarChart3, Lock, RefreshCw } from 'lucide-react'
import {
  EnergyCurveChart,
  formatReportDateRange,
} from '@/components/weekly-report/energy-curve-chart'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { getWeekStart } from '@/lib/dates'
import {
  canViewFullWeeklyReport,
  isWeeklyReportPreviewOnly,
  WEEKLY_REPORT_GUEST_MESSAGE,
  WEEKLY_REPORT_PREVIEW_MESSAGE,
} from '@/lib/weekly-report-access'
import {
  countWeekCheckIns,
  fetchWeeklyReport,
  generateWeeklyReport,
  WEEKLY_REPORT_MIN_CHECK_INS,
} from '@/lib/weekly-report'
import type { WeeklyReport } from '@/types/work-energy'

export function WeeklyInsightsPage() {
  const { user, isGuest } = useAuth()
  const { checkIns, profile, currentWeekId, loading: checkInsLoading } =
    useWorkEnergy()

  const [report, setReport] = useState<WeeklyReport | null>(null)
  const [loadingReport, setLoadingReport] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const weekCheckInCount = countWeekCheckIns(checkIns, getWeekStart())
  const canViewFull = canViewFullWeeklyReport(isGuest, profile)
  const isPreviewOnly = isWeeklyReportPreviewOnly(isGuest, profile)
  const hasEnoughCheckIns = weekCheckInCount >= WEEKLY_REPORT_MIN_CHECK_INS

  const loadReport = useCallback(
    async (force = false) => {
      if (!user || isGuest || !hasEnoughCheckIns) {
        setReport(null)
        setLoadingReport(false)
        return
      }

      setLoadingReport(true)
      setError(null)

      try {
        const generated = await generateWeeklyReport(user.uid, getWeekStart(), {
          force,
          checkIns,
          profile,
          displayName: user.displayName,
          email: user.email ?? profile.email,
        })
        setReport(generated)
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : 'Could not load your weekly report.',
        )

        const cached = await fetchWeeklyReport(user.uid, currentWeekId)
        setReport(cached)
      } finally {
        setLoadingReport(false)
      }
    },
    [
      user,
      isGuest,
      hasEnoughCheckIns,
      checkIns,
      profile,
      currentWeekId,
    ],
  )

  useEffect(() => {
    if (checkInsLoading) return
    void loadReport(false)
  }, [checkInsLoading, loadReport])

  async function handleRegenerate() {
    setRegenerating(true)
    await loadReport(true)
    setRegenerating(false)
  }

  if (checkInsLoading || loadingReport) {
    return (
      <div className="flex min-h-[50dvh] items-center justify-center">
        <p className="text-sm text-text-muted">Loading weekly insights…</p>
      </div>
    )
  }

  if (isGuest) {
    return (
      <div className="page-enter space-y-6">
        <PageHeader />
        <Card className="border-yellow bg-yellow/20">
          <CardContent className="space-y-4 p-6 text-center">
            <Lock className="mx-auto h-10 w-10 text-orange" aria-hidden="true" />
            <p className="font-medium text-text">{WEEKLY_REPORT_GUEST_MESSAGE}</p>
            <Button asChild>
              <Link to="/">
                Create an account
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!hasEnoughCheckIns) {
    return (
      <div className="page-enter space-y-6">
        <PageHeader />
        <Card className="border-green/20 bg-green-muted/40">
          <CardHeader>
            <CardTitle>Your weekly report is building</CardTitle>
            <CardDescription>
              Complete {WEEKLY_REPORT_MIN_CHECK_INS} check-ins in a week to unlock
              your first insight report.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div
              className="h-3 overflow-hidden rounded-full bg-border"
              role="progressbar"
              aria-valuenow={weekCheckInCount}
              aria-valuemin={0}
              aria-valuemax={WEEKLY_REPORT_MIN_CHECK_INS}
              aria-label="Weekly check-in progress"
            >
              <div
                className="h-full rounded-full bg-green transition-all duration-300"
                style={{
                  width: `${(weekCheckInCount / WEEKLY_REPORT_MIN_CHECK_INS) * 100}%`,
                }}
              />
            </div>
            <p className="text-base text-text">
              You&apos;ve completed {weekCheckInCount} of {WEEKLY_REPORT_MIN_CHECK_INS}{' '}
              check-ins needed for your weekly report.
            </p>
            <Button asChild variant="outline">
              <Link to="/work-check-in">Start Today&apos;s Check-In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isPreviewOnly) {
    return (
      <div className="page-enter space-y-6">
        <PageHeader />
        <Card>
          <CardContent className="space-y-3 p-6">
            <Lock className="h-8 w-8 text-text-muted" aria-hidden="true" />
            <p className="font-medium text-text">Weekly insights preview</p>
            <p className="text-sm leading-relaxed text-text-muted">
              {WEEKLY_REPORT_PREVIEW_MESSAGE}
            </p>
          </CardContent>
        </Card>
        {report && (
          <div className="pointer-events-none select-none blur-sm">
            <ReportSections report={report} locked />
          </div>
        )}
      </div>
    )
  }

  if (!report) {
    return (
      <div className="page-enter space-y-6">
        <PageHeader />
        {error && (
          <p className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
            {error}
          </p>
        )}
        <Card>
          <CardContent className="p-6 text-center text-text-muted">
            Your report could not be generated yet. Try again in a moment.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-enter space-y-6 lg:max-w-3xl">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <PageHeader weekLabel={`Week ${report.weekNumber}`} />
        {canViewFull && (
          <Button
            variant="outline"
            disabled={regenerating}
            onClick={() => void handleRegenerate()}
          >
            <RefreshCw
              className={`h-4 w-4 ${regenerating ? 'animate-spin' : ''}`}
              aria-hidden="true"
            />
            Regenerate report
          </Button>
        )}
      </div>

      {error && (
        <p className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
          {error}
        </p>
      )}

      <ReportSections report={report} />
    </div>
  )
}

function PageHeader({ weekLabel }: { weekLabel?: string }) {
  return (
    <header>
      <p className="mb-1 text-sm font-medium uppercase tracking-widest text-green">
        Weekly Insights
      </p>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
        {weekLabel ? `${weekLabel} report` : 'Your weekly insight report'}
      </h1>
      <p className="mt-2 text-base text-text-muted">
        Patterns from your check-ins — calm, practical, and private to you.
      </p>
    </header>
  )
}

function ReportSections({
  report,
  locked = false,
}: {
  report: WeeklyReport
  locked?: boolean
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {report.profile.displayName ?? 'Your profile'}
          </CardTitle>
          <CardDescription>
            {formatReportDateRange(report.weekStart, report.weekEnd)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {report.profile.selfDescription && (
            <p className="text-text-muted">{report.profile.selfDescription}</p>
          )}
          {report.profile.email && (
            <p className="text-text-muted">{report.profile.email}</p>
          )}
          <div className="flex flex-wrap gap-3">
            <StatPill label="Days completed" value={String(report.profile.daysCompleted)} />
            <StatPill label="Status" value={report.profile.statusLabel} accent />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Week at a glance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Avg energy" value={report.averages.energyTank} />
          <Metric label="Avg masking" value={report.averages.maskingLoad} />
          <Metric label="Avg support" value={report.averages.supportFelt} />
          <Metric label="Would use again" value={report.averages.wouldUseAgain} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-green" aria-hidden="true" />
            Energy curve
          </CardTitle>
          <CardDescription>Energy tank and masking load across the week</CardDescription>
        </CardHeader>
        <CardContent>
          <EnergyCurveChart points={report.energyCurve} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">What your data shows</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-text-muted">
          <p>{report.insights.summary}</p>
          <p>{report.insights.relationshipNote}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Drains & refills</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <RankedList title="Top drains" items={report.topDrains} />
          <RankedList title="Top refills" items={report.topRefills} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Masking & accommodation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-text-muted">
          <p>{report.maskingSummary}</p>
          <p>{report.accommodationSummary}</p>
        </CardContent>
      </Card>

      <Card className="border-green/20 bg-green-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Recommendation for this week</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-text">{report.recommendation}</p>
        </CardContent>
      </Card>

      <Card className="border-yellow bg-yellow/15">
        <CardHeader>
          <CardTitle className="text-lg">Note to carry into this week</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-text">{report.noteForWeek}</p>
        </CardContent>
      </Card>

      {locked && (
        <p className="text-center text-xs text-text-muted">
          Preview only — full report requires pilot or paid access.
        </p>
      )}
    </div>
  )
}

function StatPill({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div
      className={`rounded-xl px-3 py-2 ${accent ? 'bg-green-muted text-green' : 'bg-cream/80 text-text'}`}
    >
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-border bg-cream/50 p-3 text-center">
      <p className="text-xs text-text-muted">{label}</p>
      <p className="font-display text-2xl font-semibold text-text">{value}</p>
    </div>
  )
}

function RankedList({
  title,
  items,
}: {
  title: string
  items: WeeklyReport['topDrains']
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-text">{title}</p>
      {items.length === 0 ? (
        <p className="text-sm text-text-muted">No clear pattern yet.</p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.option}
              className="flex items-center justify-between rounded-lg bg-cream/60 px-3 py-2 text-sm"
            >
              <span>{item.label}</span>
              <span className="font-medium text-green">{item.count}×</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
