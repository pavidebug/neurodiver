import { ChevronRight, Leaf } from 'lucide-react'
import { cn } from '@/lib/utils'

interface InsightsEncouragementBannerProps {
  monthlyCheckInCount: number
  className?: string
}

export function InsightsEncouragementBanner({
  monthlyCheckInCount,
  className,
}: InsightsEncouragementBannerProps) {
  const countLabel =
    monthlyCheckInCount === 0
      ? 'Your first check-in is a great place to start.'
      : `You've checked in ${monthlyCheckInCount} time${monthlyCheckInCount === 1 ? '' : 's'} this month. Thank you for showing up.`

  return (
    <article
      className={cn(
        'flex items-center gap-4 rounded-[1.5rem] border border-green/15 bg-gradient-to-r from-green-muted/50 to-[#E8F0EB]/80 px-5 py-4',
        className,
      )}
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/70 text-green">
        <Leaf className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1 space-y-0.5">
        <p className="text-sm font-medium text-text">Small steps, real change.</p>
        <p className="text-sm text-text-muted">{countLabel}</p>
      </div>
      <ChevronRight className="h-5 w-5 shrink-0 text-text-muted/40" aria-hidden="true" />
    </article>
  )
}
