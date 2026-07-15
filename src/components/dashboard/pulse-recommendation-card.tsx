import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { Strategy } from '@/types/strategy'

interface PulseRecommendationCardProps {
  copy: string
  strategy: Strategy
  className?: string
}

export function PulseRecommendationCard({
  copy,
  strategy,
  className,
}: PulseRecommendationCardProps) {
  return (
    <article
      className={cn(
        'card-premium slide-up rounded-[1.5rem] bg-surface-solid p-6 shadow-[0_4px_24px_rgba(31,42,36,0.06)] lg:rounded-[1.75rem] lg:p-7',
        className,
      )}
      style={{ animationDelay: '60ms' }}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green">
        Today&apos;s recommendation
      </p>
      <p className="mt-3 text-sm leading-relaxed text-text-muted">{copy}</p>
      <h2 className="mt-2 font-display text-xl font-semibold text-text lg:text-2xl">
        &ldquo;{strategy.situation}&rdquo;
      </h2>
      <Button
        asChild
        variant="outline"
        className="mt-5 w-fit rounded-full border-green/30 px-6 hover:bg-green-muted/50"
      >
        <Link to={`/strategies?strategy=${encodeURIComponent(strategy.id)}`}>
          Open Strategy Navigator
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  )
}
