import { Leaf } from 'lucide-react'
import { typePageTitle, typeBodyMuted } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

interface InsightsPageHeaderProps {
  className?: string
}

export function InsightsPageHeader({ className }: InsightsPageHeaderProps) {
  return (
    <header
      className={cn(
        'flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between',
        className,
      )}
    >
      <div className="space-y-2">
        <h1 className={typePageTitle}>Insights</h1>
        <p className={cn(typeBodyMuted, 'max-w-xl')}>
          Simple patterns from your check-ins and saved strategies.
        </p>
      </div>

      <span className="inline-flex w-fit shrink-0 items-center gap-2 rounded-full border border-border/70 bg-cream/50 px-3 py-1.5 text-xs font-medium text-text-muted">
        <Leaf className="h-3.5 w-3.5 text-green" aria-hidden="true" />
        Private &amp; yours
      </span>
    </header>
  )
}
