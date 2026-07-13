import { RefreshCw } from 'lucide-react'
import { MostSavedStrategies } from '@/components/admin/MostSavedStrategies'
import { MostUsedFeatures } from '@/components/admin/MostUsedFeatures'
import { NewSignUps } from '@/components/admin/NewSignUps'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { StatCard } from '@/components/admin/StatCard'
import { Button } from '@/components/ui/button'
import { useAdminDashboard } from '@/context/admin-dashboard-context'
import { Activity, Bookmark, ClipboardList, Users } from 'lucide-react'

function AdminErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="page-enter mx-auto max-w-lg rounded-3xl border border-border bg-surface p-8 text-center">
      <p className="font-display text-xl font-semibold text-text">
        Couldn&apos;t load dashboard
      </p>
      <p className="mt-2 text-sm text-text-muted">{message}</p>
      <Button className="mt-6" onClick={onRetry}>
        <RefreshCw className="h-4 w-4" aria-hidden="true" />
        Try again
      </Button>
    </div>
  )
}

export function AdminPage() {
  const { data, loading, error, reload } = useAdminDashboard()

  if (error) {
    return <AdminErrorState message={error} onRetry={reload} />
  }

  const stats = data?.stats ?? {
    totalUsers: 0,
    activeToday: 0,
    totalCheckIns: 0,
    totalStrategySaves: 0,
    avgEnergy: null,
    avgFocus: null,
    avgStress: null,
  }

  return (
    <div className="page-enter space-y-8">
      <section aria-labelledby="overview-stats-heading">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2
            id="overview-stats-heading"
            className="font-display text-xl font-semibold text-text"
          >
            Product snapshot
          </h2>
          <Button
            variant="outline"
            onClick={reload}
            disabled={loading}
            className="min-h-10 px-4 text-sm"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" value={stats.totalUsers} icon={Users} loading={loading} />
          <StatCard
            label="Active today"
            value={stats.activeToday}
            icon={Activity}
            accentClass="bg-lavender-muted text-lavender-deep"
            loading={loading}
          />
          <StatCard
            label="Total check-ins"
            value={stats.totalCheckIns}
            icon={ClipboardList}
            accentClass="bg-yellow/40 text-orange"
            loading={loading}
          />
          <StatCard
            label="Total strategy saves"
            value={stats.totalStrategySaves}
            icon={Bookmark}
            accentClass="bg-sage-light text-green"
            loading={loading}
          />
        </div>

        {(stats.avgEnergy !== null || stats.avgFocus !== null || stats.avgStress !== null) && (
          <div className="grid gap-4 sm:grid-cols-3">
            {stats.avgEnergy !== null ? (
              <StatCard label="Avg energy" value={stats.avgEnergy} icon={Activity} loading={loading} />
            ) : null}
            {stats.avgFocus !== null ? (
              <StatCard
                label="Avg focus"
                value={stats.avgFocus}
                icon={ClipboardList}
                accentClass="bg-lavender-muted text-lavender-deep"
                loading={loading}
              />
            ) : null}
            {stats.avgStress !== null ? (
              <StatCard
                label="Avg stress"
                value={stats.avgStress}
                icon={Bookmark}
                accentClass="bg-yellow/40 text-orange"
                loading={loading}
              />
            ) : null}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <NewSignUps signUps={data?.newSignUps ?? []} loading={loading} />
        <RecentActivity activity={data?.recentActivity ?? []} loading={loading} />
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <MostUsedFeatures features={data?.mostUsedFeatures ?? []} loading={loading} />
        <MostSavedStrategies
          strategies={data?.mostSavedStrategies ?? []}
          loading={loading}
        />
      </div>
    </div>
  )
}
