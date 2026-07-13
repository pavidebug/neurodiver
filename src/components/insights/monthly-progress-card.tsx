import { Link } from 'react-router-dom'
import { ArrowRight, Check, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MONTHLY_INSIGHT_TARGET } from '@/lib/personal-insights'
import { cn } from '@/lib/utils'

interface MonthlyProgressCardProps {
  current: number
  target: number
  remaining: number
  unlocked: boolean
  className?: string
}

export function MonthlyProgressCard({
  current,
  target,
  remaining,
  unlocked,
  className,
}: MonthlyProgressCardProps) {
  const progress = Math.min(100, (current / target) * 100)

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#2D5A3D] to-[#3A6B4F] p-5 text-white shadow-[0_12px_40px_rgba(45,90,61,0.25)] sm:p-6',
        className,
      )}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <Lock className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="space-y-1.5">
            <h2 className="font-display text-xl font-semibold sm:text-2xl">
              {unlocked ? 'Your monthly graph is ready' : 'Unlock your monthly graph'}
            </h2>
            <p className="text-sm leading-relaxed text-white/80 sm:max-w-md">
              {unlocked
                ? 'You’ve built enough check-ins to see your energy, patterns, and trends.'
                : `Check in ${remaining} more time${remaining === 1 ? '' : 's'} this month to see your energy, patterns and trends.`}
            </p>
          </div>
        </div>

        <ProgressRing
          current={current}
          target={target}
          className="mx-auto shrink-0 sm:mx-0"
        />
      </div>

      <div
        className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:justify-start"
        aria-label={`${current} of ${target} check-ins this month`}
      >
        {Array.from({ length: target }, (_, index) => {
          const step = index + 1
          const complete = step <= current

          return (
            <span
              key={step}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                complete
                  ? 'bg-white text-[#2D5A3D]'
                  : 'bg-white/15 text-white/70',
              )}
            >
              {complete ? (
                <Check className="h-4 w-4" aria-hidden="true" />
              ) : (
                step
              )}
            </span>
          )
        })}
      </div>

      {unlocked ? (
        <Button
          asChild
          variant="secondary"
          className="mt-5 rounded-full bg-white text-[#2D5A3D] hover:bg-white/90"
        >
          <Link to="/weekly-insights">
            View your graph
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : (
        <p className="mt-4 text-xs text-white/60">
          {progress.toFixed(0)}% toward your monthly view — no pressure, just pattern-building.
        </p>
      )}
    </article>
  )
}

function ProgressRing({
  current,
  target,
  className,
}: {
  current: number
  target: number
  className?: string
}) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const progress = Math.min(1, current / target)
  const offset = circumference * (1 - progress)

  return (
    <div className={cn('relative h-24 w-24', className)}>
      <svg viewBox="0 0 96 96" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.2)"
          strokeWidth="8"
        />
        <circle
          cx="48"
          cy="48"
          r={radius}
          fill="none"
          stroke="white"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-[stroke-dashoffset] duration-700 ease-out"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-lg font-semibold leading-none">
          {current}/{MONTHLY_INSIGHT_TARGET}
        </span>
        <span className="mt-1 text-[10px] uppercase tracking-wide text-white/70">
          check-ins
        </span>
      </div>
    </div>
  )
}
