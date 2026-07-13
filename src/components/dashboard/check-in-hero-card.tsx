import { Link } from 'react-router-dom'
import { ArrowRight, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface CheckInHeroCardProps {
  loading: boolean
  hasCheckedInToday: boolean
  monthlyCheckInCount: number
  className?: string
}

function PulseCheckSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-sage-light/60 to-green-muted/40 p-5 lg:p-6',
        className,
      )}
    >
      <div className="space-y-3">
        <div className="skeleton h-10 w-10 rounded-2xl" />
        <div className="skeleton h-7 w-48 rounded-xl" />
        <div className="skeleton h-4 w-full max-w-sm rounded-lg" />
        <div className="skeleton h-4 w-40 rounded-lg" />
        <div className="skeleton h-11 w-40 rounded-full" />
      </div>
    </div>
  )
}

export function CheckInHeroCard({
  loading,
  hasCheckedInToday,
  monthlyCheckInCount,
  className,
}: CheckInHeroCardProps) {
  if (loading) {
    return <PulseCheckSkeleton className={className} />
  }

  const countLabel = `You've checked in ${monthlyCheckInCount} time${monthlyCheckInCount === 1 ? '' : 's'} this month.`

  if (hasCheckedInToday) {
    return (
      <article
        className={cn(
          'card-premium slide-up overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#C5DBC9] via-sage-light to-green-muted p-5 shadow-[0_8px_32px_rgba(45,90,61,0.1)] lg:p-6',
          className,
        )}
      >
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/60 text-green shadow-sm">
            <Sun className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-semibold text-text lg:text-2xl">
              Today&apos;s check-in saved
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">{countLabel}</p>
            <p className="text-sm text-text-muted">No pressure — one check-in is enough.</p>
            <Button asChild variant="outline" className="mt-3 rounded-full">
              <Link to="/today-reflection">View today&apos;s reflection</Link>
            </Button>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article
      className={cn(
        'card-premium slide-up overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-[#B8D4BE] via-sage-light to-[#E8F0EB] p-5 shadow-[0_8px_32px_rgba(45,90,61,0.12)] lg:p-6',
        className,
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/55 text-green shadow-sm">
            <Sun className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-semibold text-text lg:text-2xl">
              Quick Pulse Check
            </h2>
            <p className="text-sm leading-relaxed text-text-muted">
              About 30 seconds. Mood, energy, focus and stress.
            </p>
            <p className="text-sm text-text-muted/90">{countLabel}</p>
          </div>
        </div>

        <Button
          asChild
          size="lg"
          className="w-full rounded-full bg-green shadow-[0_4px_16px_rgba(45,90,61,0.2)] transition-all hover:bg-green-soft sm:w-fit sm:px-8"
        >
          <Link to="/work-check-in">
            Start check-in
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  )
}
