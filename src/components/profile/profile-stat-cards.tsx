import { cn } from '@/lib/utils'

interface ProfileStatCardsProps {
  totalCheckIns: number
  hasCheckedInToday: boolean
}

export function ProfileStatCards({ totalCheckIns, hasCheckedInToday }: ProfileStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <article className="rounded-[1.25rem] border border-green/10 bg-gradient-to-br from-surface-solid to-green-muted/30 p-4 text-center shadow-[var(--shadow-premium)]">
        <p className="font-display text-3xl font-semibold text-green">{totalCheckIns}</p>
        <p className="mt-1 text-sm font-medium text-text">Work check-ins</p>
        <p className="text-xs text-text-muted">All time</p>
      </article>

      <article
        className={cn(
          'rounded-[1.25rem] p-4 text-center shadow-[0_2px_16px_rgba(31,42,36,0.05)]',
          hasCheckedInToday
            ? 'border border-green/10 bg-gradient-to-br from-green-muted/60 to-sage-light/45'
            : 'border border-orange/10 bg-gradient-to-br from-yellow-soft/90 to-yellow/45',
        )}
      >
        <p className="font-display text-3xl font-semibold text-green">
          {hasCheckedInToday ? 'Done' : '—'}
        </p>
        <p className="mt-1 text-sm font-medium text-text">Today&apos;s check-in</p>
        <p className="text-xs text-text-muted">
          {hasCheckedInToday ? 'Checked in' : 'Not yet checked in'}
        </p>
      </article>
    </div>
  )
}
