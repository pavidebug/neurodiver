import { UserPlus } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminSignUp } from '@/types/admin-dashboard'

interface NewSignUpsProps {
  signUps: AdminSignUp[]
  loading?: boolean
}

export function NewSignUps({ signUps, loading = false }: NewSignUpsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New sign-ups</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-text-muted">Loading sign-ups…</p>
        ) : signUps.length === 0 ? (
          <AdminEmptyState icon={UserPlus} title="No users yet." />
        ) : (
          <ul className="space-y-3">
            {signUps.map((signUp) => (
              <li
                key={signUp.userId}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-cream/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-medium text-text">{signUp.name}</p>
                  <p className="truncate text-sm text-text-muted">
                    {signUp.email ?? 'No email available'}
                  </p>
                  <p className="truncate text-sm text-text-muted">
                    Joined {signUp.joinedAt ?? 'recently'}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-text-muted">
                  {signUp.joinedAt ?? '—'}
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
