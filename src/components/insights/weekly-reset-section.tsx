import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WeeklyResetCardProps {
  className?: string
}

export function WeeklyResetCard({ className }: WeeklyResetCardProps) {
  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/50 bg-surface-solid px-5 py-4 sm:px-6',
        className,
      )}
    >
      <h2 className="text-base font-medium text-text">This Week With Your Brain</h2>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">
        A short reflection on what helped, what felt heavy, and one gentle intention for
        next week.
      </p>
      <Button asChild variant="outline" className="mt-4 rounded-full">
        <Link to="/weekly-reflection">
          Open weekly reset
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  )
}

interface WeeklyResetLinkProps {
  className?: string
}

export function WeeklyResetLink({ className }: WeeklyResetLinkProps) {
  return (
    <p className={cn('text-sm text-text-muted', className)}>
      <Link
        to="/weekly-reflection"
        className="inline-flex items-center gap-1 font-medium text-green hover:opacity-80"
      >
        This Week With Your Brain
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </p>
  )
}
