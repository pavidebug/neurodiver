import { cn } from '@/lib/utils'

interface ProfileStatCardsProps {
  totalCheckIns: number
  hasCheckedInToday: boolean
}

export function ProfileStatCards({ totalCheckIns, hasCheckedInToday }: ProfileStatCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <article className="rounded-[1.25rem] bg-surface-solid p-4 text-center shadow-[0_2px_16px_rgba(31,42,36,0.05)]">
        <p className="font-display text-3xl font-semibold text-green">{totalCheckIns}</p>
        <p className="mt-1 text-sm font-medium text-text">Work check-ins</p>
        <p className="text-xs text-text-muted">All time</p>
      </article>

      <article
        className={cn(
          'rounded-[1.25rem] p-4 text-center shadow-[0_2px_16px_rgba(31,42,36,0.05)]',
          hasCheckedInToday ? 'bg-green-muted/50' : 'bg-yellow-soft/80',
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
