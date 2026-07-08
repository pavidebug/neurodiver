import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { useAdminDashboard } from '@/context/admin-dashboard-context'
import type { AdminStrategyRow } from '@/types/admin-dashboard'

const columns = [
  {
    key: 'name',
    header: 'Strategy name',
    cell: (row: AdminStrategyRow) => row.name,
  },
  {
    key: 'views',
    header: 'Views',
    cell: (row: AdminStrategyRow) => row.views,
  },
  {
    key: 'saves',
    header: 'Saves',
    cell: (row: AdminStrategyRow) => row.saves,
  },
  {
    key: 'lastUsed',
    header: 'Last used',
    cell: (row: AdminStrategyRow) =>
      row.lastUsed
        ? new Date(row.lastUsed).toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })
        : '—',
  },
]

export function AdminStrategiesPage() {
  const { data, loading } = useAdminDashboard()

  return (
    <div className="page-enter space-y-4">
      <p className="text-sm text-text-muted">
        Strategy engagement across all pilot users.
      </p>
      <AdminDataTable
        columns={columns}
        rows={data?.strategies ?? []}
        loading={loading}
        emptyMessage="No strategy data yet."
        getRowKey={(row) => row.strategyId}
      />
    </div>
  )
}
