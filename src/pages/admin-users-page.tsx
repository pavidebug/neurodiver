import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { useAdminDashboard } from '@/context/admin-dashboard-context'
import { Mail } from 'lucide-react'
import type { AdminBodyDoubleInterest, AdminUserRow } from '@/types/admin-dashboard'

const columns = [
  { key: 'name', header: 'Name', cell: (row: AdminUserRow) => row.name },
  { key: 'email', header: 'Email', cell: (row: AdminUserRow) => row.email ?? '—' },
  { key: 'joined', header: 'Joined', cell: (row: AdminUserRow) => row.joinedAt ?? '—' },
  {
    key: 'lastActive',
    header: 'Last active',
    cell: (row: AdminUserRow) => row.lastActive ?? '—',
  },
  { key: 'checkIns', header: 'Check-ins', cell: (row: AdminUserRow) => row.totalCheckIns },
  { key: 'saves', header: 'Saved', cell: (row: AdminUserRow) => row.savedStrategies },
]

const interestColumns = [
  { key: 'email', header: 'Email', cell: (row: AdminBodyDoubleInterest) => row.email },
  {
    key: 'account',
    header: 'Account',
    cell: (row: AdminBodyDoubleInterest) => row.isGuest ? 'Guest visitor' : 'Signed-in user',
  },
  {
    key: 'joined',
    header: 'Added',
    cell: (row: AdminBodyDoubleInterest) => row.joinedAt ?? '—',
  },
]

export function AdminUsersPage() {
  const { data, loading } = useAdminDashboard()

  return (
    <div className="page-enter space-y-8">
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-text">Registered users</h2>
          <p className="mt-1 text-sm text-text-muted">
            Signup emails and aggregated engagement. Personal notes and health details are not shown.
          </p>
        </div>
        <AdminDataTable
          columns={columns}
          rows={data?.users ?? []}
          loading={loading}
          emptyMessage="No users yet."
          getRowKey={(row) => row.userId}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-purple/15 text-purple">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-xl font-semibold text-text">Body Double email interest</h2>
            <p className="mt-1 text-sm text-text-muted">
              Includes email addresses submitted by guest visitors who have not created an account.
            </p>
          </div>
        </div>
        <AdminDataTable
          columns={interestColumns}
          rows={data?.bodyDoubleInterests ?? []}
          loading={loading}
          emptyMessage="No Body Double email submissions yet."
          getRowKey={(row) => row.userId}
        />
      </section>
    </div>
  )
}
