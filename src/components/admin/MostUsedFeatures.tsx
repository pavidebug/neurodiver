import { BarChart3 } from 'lucide-react'
import { AdminEmptyState } from '@/components/admin/AdminEmptyState'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { AdminFeatureUsage } from '@/types/admin-dashboard'

interface MostUsedFeaturesProps {
  features: AdminFeatureUsage[]
  loading?: boolean
}

export function MostUsedFeatures({ features, loading = false }: MostUsedFeaturesProps) {
  const maxCount = features[0]?.count ?? 1

  return (
    <Card>
      <CardHeader>
        <CardTitle>Most used features</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-text-muted">Loading feature usage…</p>
        ) : features.length === 0 ? (
          <AdminEmptyState
            icon={BarChart3}
            title="No feature data yet."
            description="Usage will appear once analytics events are tracked."
          />
        ) : (
          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature.feature}>
                <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
                  <span className="font-medium text-text">{feature.feature}</span>
                  <span className="text-text-muted">{feature.count}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-cream-dark">
                  <div
                    className="h-full rounded-full bg-green transition-all"
                    style={{ width: `${(feature.count / maxCount) * 100}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}
