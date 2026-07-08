import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { useAdminDashboard } from '@/context/admin-dashboard-context'
import type { AdminUserRow } from '@/types/admin-dashboard'

const columns = [
  {
    key: 'name',
    header: 'Name',
    cell: (row: AdminUserRow) => row.name,
  },
  {
    key: 'email',
    header: 'Email',
    cell: (row: AdminUserRow) => row.email ?? '—',
  },
  {
    key: 'joined',
    header: 'Joined',
    cell: (row: AdminUserRow) => row.joinedAt ?? '—',
  },
  {
    key: 'lastActive',
    header: 'Last active',
    cell: (row: AdminUserRow) => row.lastActive ?? '—',
  },
  {
    key: 'profession',
    header: 'Profession',
    cell: (row: AdminUserRow) => row.profession ?? '—',
  },
  {
    key: 'ndStatus',
    header: 'ND status',
    cell: (row: AdminUserRow) => row.ndStatus ?? '—',
  },
  {
    key: 'checkIns',
    header: 'Check-ins',
    cell: (row: AdminUserRow) => row.totalCheckIns,
  },
  {
    key: 'saves',
    header: 'Saved',
    cell: (row: AdminUserRow) => row.savedStrategies,
  },
  {
    key: 'energy',
    header: 'Latest energy',
    cell: (row: AdminUserRow) =>
      row.latestEnergy !== null ? `${row.latestEnergy}/5` : '—',
  },
  {
    key: 'burnout',
    header: 'Latest burnout',
    cell: (row: AdminUserRow) => row.latestBurnout ?? '—',
  },
]

export function AdminUsersPage() {
  const { data, loading } = useAdminDashboard()

  return (
    <div className="page-enter space-y-4">
      <p className="text-sm text-text-muted">
        Pilot user profiles and engagement at a glance.
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
