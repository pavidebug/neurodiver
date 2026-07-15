import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { useAdminDashboard } from '@/context/admin-dashboard-context'
import { Mail, RefreshCw } from 'lucide-react'
import type { AdminBodyDoubleInterest, AdminUserRow } from '@/types/admin-dashboard'

function formatAnswers(values: string[]): string {
  return values.length > 0 ? values.join(', ') : 'Skipped'
}

const columns = [
  { key: 'name', header: 'Preferred name', cell: (row: AdminUserRow) => row.name },
  { key: 'email', header: 'Email', cell: (row: AdminUserRow) => row.email ?? '—' },
  {
    key: 'broughtHere',
    header: 'What brought them here',
    cell: (row: AdminUserRow) => row.broughtHere ?? 'Skipped',
    className: 'min-w-52',
  },
  {
    key: 'experiences',
    header: 'Familiar experiences',
    cell: (row: AdminUserRow) => formatAnswers(row.familiarExperiences),
    className: 'min-w-64',
  },
  {
    key: 'energyDrains',
    header: 'Energy drains',
    cell: (row: AdminUserRow) => formatAnswers(row.energyDrains),
    className: 'min-w-56',
  },
  {
    key: 'supportStyle',
    header: 'Preferred support',
    cell: (row: AdminUserRow) => row.supportStyle ?? 'Skipped',
    className: 'min-w-48',
  },
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
  const { data, loading, reload } = useAdminDashboard()

  return (
    <div className="page-enter space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-text">Registered users</h2>
            <p className="mt-1 text-sm text-text-muted">
              Account details, onboarding responses and aggregated engagement. Skipped optional
              questions are clearly marked.
            </p>
          </div>
          <button
            type="button"
            onClick={reload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-3.5 py-2 text-sm font-medium text-text transition-colors hover:bg-cream disabled:opacity-50"
          >
            <RefreshCw className={loading ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} aria-hidden="true" />
            Refresh users
          </button>
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
