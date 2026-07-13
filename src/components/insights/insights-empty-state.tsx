import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InsightsEmptyStateProps {
  className?: string
}

export function InsightsEmptyState({ className }: InsightsEmptyStateProps) {
  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/50 bg-cream/30 px-5 py-6 sm:px-6',
        className,
      )}
    >
      <h2 className="font-display text-xl font-semibold text-text">
        Your patterns will appear here slowly.
      </h2>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-text-muted">
        Check-ins help NeuroDiver notice what supports you, what drains you, and what
        helps you recover.
      </p>
      <Button asChild className="mt-4 rounded-full">
        <Link to="/work-check-in">
          Start today&apos;s check-in
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  )
}
