import { Bookmark } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { SavedStrategyCount } from '@/types/admin-dashboard'

interface MostSavedStrategiesProps {
  strategies: SavedStrategyCount[]
  loading?: boolean
}

export function MostSavedStrategies({
  strategies,
  loading = false,
}: MostSavedStrategiesProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Most saved strategies</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-text-muted">Loading saved strategy data…</p>
        ) : strategies.length === 0 ? (
          <AdminEmptyState
            icon={Bookmark}
            title="No saved strategy data yet."
            description="When users save strategies, the most popular ones will show up here."
          />
        ) : (
          <ul className="space-y-3">
            {strategies.map((strategy, index) => (
              <li
                key={strategy.strategyId}
                className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-cream/60 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    #{index + 1}
                  </p>
                  <p className="truncate font-medium text-text">{strategy.title}</p>
                </div>
                <span className="shrink-0 rounded-full bg-green-muted px-3 py-1 text-sm font-semibold text-green">
                  {strategy.saveCount} saved
                </span>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
