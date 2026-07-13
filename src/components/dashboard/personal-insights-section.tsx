import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { typeBodyMuted, typeSectionTitle } from '@/design-system/tokens'
import type { PersonalInsight } from '@/lib/personal-insights'
import { cn } from '@/lib/utils'

interface PersonalInsightsSectionProps {
  insights: PersonalInsight[]
  compact?: boolean
  className?: string
}

export function PersonalInsightsSection({
  insights,
  compact = false,
  className,
}: PersonalInsightsSectionProps) {
  if (insights.length === 0) return null

  const visible = compact ? insights.slice(0, 2) : insights

  return (
    <section aria-labelledby="insights-heading" className={cn('space-y-4', className)}>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h2 id="insights-heading" className={typeSectionTitle}>
            What NeuroDiver has learned about you
          </h2>
          {!compact ? (
            <p className={cn(typeBodyMuted, 'mt-1')}>
              Simple patterns from your check-ins and saved strategies.
            </p>
          ) : null}
        </div>
        {compact ? (
          <Link to="/insights" className="text-sm font-medium text-green hover:opacity-80">
            See all
          </Link>
        ) : null}
      </div>

      <div className="space-y-3">
        {visible.map((insight) => (
          <article
            key={insight.id}
            className="rounded-[1.25rem] border border-border/60 bg-surface-solid px-5 py-4 shadow-[var(--shadow-premium)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
              {insight.label}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-text">{insight.value}</p>
          </article>
        ))}
      </div>

      {compact ? (
        <Button asChild variant="outline" className="rounded-full">
          <Link to="/insights">
            Open insights
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </section>
  )
}
