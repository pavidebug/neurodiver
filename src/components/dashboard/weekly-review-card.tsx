import { Link } from 'react-router-dom'
import { ArrowRight, Lock } from 'lucide-react'
import { countWeekCheckIns } from '@/lib/weekly-report'
import { WEEKDAY_LABELS } from '@/lib/weekly-check-in-progress'
import type { WorkCheckIn } from '@/types/work-energy'
import { WEEKLY_REPORT_MIN_CHECK_INS } from '@/types/work-energy'
import { typeSectionTitle } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

interface WeeklyReviewCardProps {
  checkIns: WorkCheckIn[]
  loading?: boolean
  className?: string
}

interface PatternPoint {
  energy: number
  drain: number
}

const EXAMPLE_WEEK: PatternPoint[] = [
  { energy: 3, drain: 2 },
  { energy: 4, drain: 1 },
  { energy: 2, drain: 4 },
  { energy: 3, drain: 3 },
  { energy: 5, drain: 1 },
  { energy: 4, drain: 2 },
  { energy: 3, drain: 2 },
]

function WeeklyPatternChart({ points, example }: { points: PatternPoint[]; example: boolean }) {
  const x = (index: number) => 38 + index * 84
  const y = (score: number) => 164 - (score - 1) * 29
  const energyPoints = points.map((point, index) => `${x(index)},${y(point.energy)}`).join(' ')

  return (
    <div className={cn('relative rounded-2xl border border-lavender/20 bg-surface-solid/65 px-2 pb-3 pt-9', example && 'opacity-90')}>
      {example ? (
        <span className="absolute left-3 top-3 rounded-full border border-border bg-surface-solid px-2.5 py-1 text-[0.6875rem] font-semibold text-text-muted">
          Example pattern · illustrative data
        </span>
      ) : null}
      <svg
        viewBox="0 0 580 220"
        className="h-auto w-full"
        role="img"
        aria-label={example ? 'Example weekly energy and drain pattern' : 'Your weekly energy and drain pattern'}
      >
        {[48, 77, 106, 135, 164].map((lineY) => (
          <line
            key={lineY}
            x1="28"
            x2="552"
            y1={lineY}
            y2={lineY}
            stroke="currentColor"
            className="text-border"
            strokeWidth="1"
          />
        ))}

        {points.map((point, index) => {
          const barHeight = point.drain * 11
          return (
            <rect
              key={`drain-${WEEKDAY_LABELS[index]}`}
              x={x(index) - 13}
              y={174 - barHeight}
              width="26"
              height={barHeight}
              rx="8"
              className="fill-text-muted/20"
            />
          )
        })}

        <polyline
          points={energyPoints}
          fill="none"
          stroke="currentColor"
          className="text-green"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((point, index) => (
          <g key={`energy-${WEEKDAY_LABELS[index]}`}>
            <circle cx={x(index)} cy={y(point.energy)} r="8" className="fill-surface-solid stroke-green" strokeWidth="4" />
            <circle cx={x(index)} cy={y(point.energy)} r="2.5" className="fill-green" />
          </g>
        ))}

        {WEEKDAY_LABELS.map((label, index) => (
          <text
            key={label}
            x={x(index)}
            y="207"
            textAnchor="middle"
            className="fill-text-muted text-[11px] font-semibold"
          >
            {label.slice(0, 1)}
          </text>
        ))}
      </svg>
    </div>
  )
}

export function WeeklyReviewCard({ checkIns, loading = false, className }: WeeklyReviewCardProps) {
  const weekCheckInCount = countWeekCheckIns(checkIns)
  const isUnlocked = weekCheckInCount >= WEEKLY_REPORT_MIN_CHECK_INS

  return (
    <article
      className={cn(
        'card-premium overflow-hidden rounded-[1.25rem] border border-lavender/20 bg-gradient-to-br from-lavender-muted via-[#F7F3FB] to-[#F3EDE8] p-5 shadow-[var(--shadow-premium)] lg:p-6',
        className,
      )}
      aria-busy={loading}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className={typeSectionTitle}>This Week With Your Brain</h2>
          {isUnlocked ? (
            <Link
              to="/weekly-reflection"
              aria-label="Open weekly reset"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lavender-deep text-white transition-transform active:scale-95"
            >
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              to="/weekly-reflection"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-surface-solid text-text-muted"
              aria-label="Preview weekly reset questions"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </div>

        <WeeklyPatternChart points={EXAMPLE_WEEK} example />

        <div className="flex items-center justify-center gap-2" aria-label={`${weekCheckInCount} of ${WEEKLY_REPORT_MIN_CHECK_INS} weekly check-ins`}>
          {Array.from({ length: WEEKLY_REPORT_MIN_CHECK_INS }, (_, index) => (
            <span
              key={index}
              className={cn('h-2 w-7 rounded-full', index < weekCheckInCount ? 'bg-green' : 'bg-border')}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="space-y-3 text-center">
          <p className="text-sm leading-relaxed text-text-muted">
            {isUnlocked
              ? 'Your weekly reset is unlocked.'
              : `Complete at least ${WEEKLY_REPORT_MIN_CHECK_INS} check-ins to unlock and save your weekly reset.`}
          </p>
          <Link
            to="/weekly-reflection"
            className="inline-flex items-center gap-2 rounded-full border border-lavender/25 bg-surface-solid px-4 py-2 text-sm font-medium text-text transition-colors hover:bg-lavender-muted/35"
          >
            {isUnlocked ? 'Start weekly reset' : 'Preview the questions'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
