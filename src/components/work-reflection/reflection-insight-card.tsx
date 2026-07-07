import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ReflectionInsightCardProps {
  icon: LucideIcon
  label: string
  value: string
  supportText: string
  /** 0–100 for the accent bar width */
  accentPercent?: number
  tintClass: string
  iconTintClass: string
}

export function ReflectionInsightCard({
  icon: Icon,
  label,
  value,
  supportText,
  accentPercent,
  tintClass,
  iconTintClass,
}: ReflectionInsightCardProps) {
  const barWidth =
    accentPercent !== undefined
      ? Math.min(100, Math.max(8, accentPercent))
      : 48

  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-3xl p-4 shadow-sm ring-1 ring-black/[0.04]',
        tintClass,
      )}
    >
      <div
        className={cn(
          'mb-3 flex h-11 w-11 items-center justify-center rounded-full',
          iconTintClass,
        )}
        aria-hidden="true"
      >
        <Icon className="h-5 w-5" strokeWidth={1.75} />
      </div>

      <p className="text-xs font-medium text-text-muted">{label}</p>
      <p className="mt-1 font-display text-base font-semibold leading-snug text-text">
        {value}
      </p>
      <p className="mt-2 flex-1 text-xs leading-relaxed text-text-muted">
        {supportText}
      </p>

      <div
        className="mt-3 h-1 overflow-hidden rounded-full bg-white/50"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-current opacity-40 transition-all duration-500"
          style={{ width: `${barWidth}%` }}
        />
      </div>
    </article>
  )
}
