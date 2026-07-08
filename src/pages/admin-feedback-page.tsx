import { AdminDataTable } from '@/components/admin/AdminDataTable'
import { useAdminDashboard } from '@/context/admin-dashboard-context'
import type { AdminFeedbackRow } from '@/types/admin-dashboard'

const columns = [
  {
    key: 'rating',
    header: 'Rating',
    cell: (row: AdminFeedbackRow) => `${row.rating}/5`,
  },
  {
    key: 'comment',
    header: 'Comment',
    cell: (row: AdminFeedbackRow) => row.comment?.trim() || '—',
    className: 'max-w-md',
  },
  {
    key: 'date',
    header: 'Date',
    cell: (row: AdminFeedbackRow) => row.date ?? '—',
  },
]

export function AdminFeedbackPage() {
  const { data, loading } = useAdminDashboard()

  return (
    <div className="page-enter space-y-4">
      <p className="text-sm text-text-muted">
        Session feedback submitted after Focus Together sessions.
      </p>
      <AdminDataTable
        columns={columns}
        rows={data?.feedback ?? []}
        loading={loading}
        emptyMessage="No feedback yet."
        getRowKey={(row) => row.id}
      />
    </div>
  )
}
