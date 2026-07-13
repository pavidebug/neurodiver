import { Link } from 'react-router-dom'
import { ArrowRight, NotebookPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  getWeekDayCheckIns,
  getWeeklyReviewCopy,
  getWeeklyReviewReadiness,
  WEEKDAY_LABELS,
} from '@/lib/weekly-check-in-progress'
import { countWeekCheckIns } from '@/lib/weekly-report'
import type { WorkCheckIn } from '@/types/work-energy'
import { typeBodyMuted, typeSectionTitle } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

interface WeeklyReviewCardProps {
  checkIns: WorkCheckIn[]
  loading?: boolean
  className?: string
}

export function WeeklyReviewCard({ checkIns, loading = false, className }: WeeklyReviewCardProps) {
  const weekCheckInCount = countWeekCheckIns(checkIns)
  const weekDayCheckIns = getWeekDayCheckIns(checkIns)
  const readiness = getWeeklyReviewReadiness(weekCheckInCount)
  const copy = getWeeklyReviewCopy(readiness)

  return (
    <article
      className={cn(
        'card-premium overflow-hidden rounded-[1.25rem] border border-lavender/20 bg-gradient-to-br from-lavender-muted via-[#F7F3FB] to-[#F3EDE8] p-5 shadow-[var(--shadow-premium)] lg:p-6',
        className,
      )}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/75 text-lavender-deep">
            <NotebookPen className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className={typeSectionTitle}>This Week With Your Brain</h2>
            <p className={typeBodyMuted}>
              A short story about what gave you energy, what drained you, and one gentle idea for next week.
            </p>
          </div>
        </div>

        <ul className="space-y-1.5 text-sm text-text-muted">
          <li>What gave you energy</li>
          <li>What drained you</li>
          <li>Strategy that helped most</li>
          <li>Pattern noticed</li>
          <li>One gentle suggestion for next week</li>
        </ul>

        <p className="text-sm font-medium text-text">
          {loading ? 'Loading your week…' : copy.message}
        </p>

        <div className="flex flex-wrap gap-2" aria-label={`${weekCheckInCount} of 7 check-ins this week`}>
          {WEEKDAY_LABELS.map((label, index) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className={cn(
                  'h-2 w-2 rounded-full',
                  weekDayCheckIns[index] ? 'bg-lavender-deep/80' : 'bg-lavender/25',
                )}
                aria-hidden="true"
              />
              <span className="text-[10px] font-medium text-text-muted uppercase">{label}</span>
            </div>
          ))}
        </div>

        <Button asChild className="rounded-full bg-lavender-deep text-white hover:bg-lavender-deep/90">
          <Link to="/weekly-reflection">
            {copy.cta}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </article>
  )
}
