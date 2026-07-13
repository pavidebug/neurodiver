import { cn } from '@/lib/utils'
import { typeBodyMuted } from '@/design-system/tokens'

interface AdaptiveHomeBannerProps {
  message: string
  className?: string
}

export function AdaptiveHomeBanner({ message, className }: AdaptiveHomeBannerProps) {
  return (
    <p
      className={cn(
        'fade-in rounded-2xl border border-green/15 bg-green-muted/40 px-4 py-3 text-sm leading-relaxed text-text',
        className,
      )}
    >
      {message}
    </p>
  )
}

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
}

export function ExpandableSection({
  title,
  children,
  defaultOpen = false,
  className,
}: ExpandableSectionProps) {
  return (
    <details
      className={cn(
        'group rounded-[1.25rem] border border-border/70 bg-surface-solid shadow-[var(--shadow-premium)]',
        className,
      )}
      open={defaultOpen}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-medium text-text marker:content-none [&::-webkit-details-marker]:hidden">
        {title}
        <span
          className="text-text-muted transition-transform duration-200 group-open:rotate-180"
          aria-hidden="true"
        >
          ▾
        </span>
      </summary>
      <div className="expand-panel border-t border-border/50 px-5 py-4">{children}</div>
    </details>
  )
}

interface TodayCheckInInsightProps {
  insight: string
  energyLevel?: number | null
  calmMode?: boolean
  className?: string
}

export function TodayCheckInInsight({
  insight,
  energyLevel = null,
  calmMode = false,
  className,
}: TodayCheckInInsightProps) {
  const fillPercent =
    energyLevel != null ? Math.min(100, Math.max(12, (energyLevel / 5) * 100)) : null

  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/60 bg-surface-solid px-5 py-4 shadow-[var(--shadow-premium)]',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-[0.1em] text-text-muted">
            Today&apos;s check-in
          </p>
          <p className={cn(typeBodyMuted, 'mt-2')}>{insight}</p>
        </div>
        {fillPercent != null ? (
          <EnergyTankIndicator fillPercent={fillPercent} calmMode={calmMode} />
        ) : null}
      </div>
    </article>
  )
}

interface EnergyTankIndicatorProps {
  fillPercent: number
  calmMode?: boolean
}

function EnergyTankIndicator({ fillPercent, calmMode = false }: EnergyTankIndicatorProps) {
  return (
    <div
      className="shrink-0 space-y-1.5"
      role="img"
      aria-label={`Energy level at ${Math.round(fillPercent)} percent`}
    >
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-text-muted">
        Energy
      </p>
      <div className="energy-tank flex h-16 w-8 flex-col justify-end rounded-full border border-green/20 bg-cream/80 p-1">
        <div
          className={cn(
            'energy-tank-fill w-full rounded-full bg-gradient-to-t from-green to-green-soft',
            calmMode && 'energy-tank-fill-calm',
          )}
          style={{ height: `${fillPercent}%` }}
        />
      </div>
    </div>
  )
}
