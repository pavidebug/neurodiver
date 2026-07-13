import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TodayCheckInCardProps {
  loading: boolean
  hasCheckedInToday: boolean
  energyState?: string | null
  className?: string
}

function CheckInSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-[1.25rem] border border-border/60 bg-surface-solid p-5',
        className,
      )}
    >
      <div className="space-y-3">
        <div className="skeleton h-6 w-40 rounded-lg" />
        <div className="skeleton h-4 w-56 rounded-lg" />
        <div className="skeleton h-10 w-44 rounded-full" />
      </div>
    </div>
  )
}

export function TodayCheckInCard({
  loading,
  hasCheckedInToday,
  energyState = null,
  className,
}: TodayCheckInCardProps) {
  if (loading) {
    return <CheckInSkeleton className={className} />
  }

  if (hasCheckedInToday) {
    return (
      <article
        className={cn(
          'rounded-[1.25rem] border border-green/15 bg-green-muted/35 px-5 py-5 xl:px-6 xl:py-6',
          className,
        )}
      >
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-text">Today&apos;s check-in saved</h2>
          {energyState ? (
            <p className="text-sm text-text-muted">
              Energy today: <span className="font-medium text-text">{energyState}</span>
            </p>
          ) : null}
        </div>
        <Button asChild variant="outline" className="mt-4 rounded-full">
          <Link to="/today-reflection">View today&apos;s reflection</Link>
        </Button>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/60 bg-surface-solid px-5 py-5 shadow-[var(--shadow-premium)] xl:px-6 xl:py-6',
        className,
      )}
    >
      <div className="space-y-2">
        <h2 className="text-lg font-medium text-text">How&apos;s your brain today?</h2>
        <p className="text-sm leading-relaxed text-text-muted">
          About 30 seconds — mood, energy, focus, and stress.
        </p>
      </div>
      <Button asChild className="mt-4 rounded-full">
        <Link to="/work-check-in">
          Start check-in
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  )
}
