import type { LucideIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: number | string
  icon: LucideIcon
  accentClass?: string
  loading?: boolean
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accentClass = 'bg-green-muted text-green',
  loading = false,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div className="min-w-0">
          <p className="text-sm font-medium text-text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight text-text">
            {loading ? '—' : value}
          </p>
        </div>
        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
            accentClass,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  )
}
