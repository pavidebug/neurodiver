import type { PrimaryInsight } from '@/lib/personal-insights'
import { cn } from '@/lib/utils'

interface MainInsightCardProps {
  insight: PrimaryInsight
  className?: string
}

export function MainInsightCard({ insight, className }: MainInsightCardProps) {
  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/50 bg-surface-solid px-5 py-5 sm:px-6 sm:py-6',
        className,
      )}
    >
      <p className="text-xs font-medium uppercase tracking-[0.08em] text-text-muted">
        What NeuroDiver has learned
      </p>
      <p className="mt-3 font-display text-xl font-semibold leading-snug text-text sm:text-2xl">
        {insight.sentence}
      </p>
      {insight.detail ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{insight.detail}</p>
      ) : null}
    </article>
  )
}
