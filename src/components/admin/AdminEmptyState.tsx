import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminEmptyStateProps {
  icon: LucideIcon
  title: string
  description?: string
  className?: string
}

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  className,
}: AdminEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-lavender-muted">
        <Icon className="h-6 w-6 text-lavender-deep" aria-hidden="true" />
      </div>
      <p className="font-display text-lg font-semibold text-text">{title}</p>
      {description ? (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-text-muted">
          {description}
        </p>
      ) : null}
    </div>
  )
}
