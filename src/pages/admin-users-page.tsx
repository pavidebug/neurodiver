import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { useAdminDashboard } from '@/context/admin-dashboard-context'
import type { AdminUserRow } from '@/types/admin-dashboard'

const columns = [
  { key: 'name', header: 'Name', cell: (row: AdminUserRow) => row.name },
  { key: 'joined', header: 'Joined', cell: (row: AdminUserRow) => row.joinedAt ?? '—' },
  {
    key: 'lastActive',
    header: 'Last active',
    cell: (row: AdminUserRow) => row.lastActive ?? '—',
  },
  { key: 'checkIns', header: 'Check-ins', cell: (row: AdminUserRow) => row.totalCheckIns },
  { key: 'saves', header: 'Saved', cell: (row: AdminUserRow) => row.savedStrategies },
]

export function AdminUsersPage() {
  const { data, loading } = useAdminDashboard()

  return (
    <div className="page-enter space-y-4">
      <p className="text-sm text-text-muted">
        Aggregated engagement only — no personal notes or health details are shown here.
      </p>
      <AdminDataTable
        columns={columns}
        rows={data?.users ?? []}
        loading={loading}
        emptyMessage="No users yet."
        getRowKey={(row) => row.userId}
      />
    </div>
  )
}
