import { Activity } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminActivityItem } from '@/types/admin-dashboard'

interface RecentActivityProps {
  activity: AdminActivityItem[]
  loading?: boolean
}

export function RecentActivity({ activity, loading = false }: RecentActivityProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-text-muted">Loading activity…</p>
        ) : activity.length === 0 ? (
          <AdminEmptyState
            icon={Activity}
            title="No activity yet."
            description="User actions will appear here as people use NeuroDiver."
          />
        ) : (
          <ul className="space-y-3">
            {activity.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-border/70 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-text">
                    {item.userName}{' '}
                    <span className="font-normal text-text-muted">
                      · {item.label.toLowerCase()}
                    </span>
                  </p>
                  <p className="text-xs text-text-muted">{item.userId.slice(0, 10)}…</p>
                </div>
                <span className="shrink-0 text-xs text-text-muted">
                  {item.createdAt ?? '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
