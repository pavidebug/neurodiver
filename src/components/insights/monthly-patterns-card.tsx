import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface MonthlyPatternsCardProps {
  current: number
  target: number
  remaining: number
  unlocked: boolean
  className?: string
}

export function MonthlyPatternsCard({
  current,
  target,
  remaining,
  unlocked,
  className,
}: MonthlyPatternsCardProps) {
  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/50 bg-cream/25 px-5 py-5 sm:px-6',
        className,
      )}
    >
      <h2 className="text-base font-medium text-text">
        {unlocked ? 'Your monthly patterns' : 'Unlock your monthly patterns'}
      </h2>

      {unlocked ? (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          You&apos;ve built enough check-ins to see your energy rhythms, common drains,
          and strategies that help most.
        </p>
      ) : (
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          Check in {remaining} more time{remaining === 1 ? '' : 's'} this month to see
          your energy rhythms, common drains, and strategies that help most.
        </p>
      )}

      <p className="mt-4 text-sm font-medium text-text">
        {current} of {target} check-ins this month
      </p>

      <div
        className="mt-2 h-1.5 overflow-hidden rounded-full bg-border/40"
        aria-hidden="true"
      >
        <div
          className="h-full rounded-full bg-green/70 transition-all duration-500"
          style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
        />
      </div>

      {unlocked ? (
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/weekly-insights">
            View monthly patterns
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : (
        <p className="mt-3 text-xs text-text-muted">No pressure — patterns take time.</p>
      )}
    </article>
  )
}
