import { Link } from 'react-router-dom'
import { ArrowRight, Sun } from 'lucide-react'
import { CheckInMascot } from '@/components/dashboard/check-in-mascot'
import { Button } from '@/components/ui/button'
import { WORK_CHECK_IN_QUESTION_COUNT } from '@/data/work-check-in-questions'
import { getStatusColor, getStatusLabel } from '@/lib/data'
import type { BrainStatusType } from '@/lib/data'
import { getEnergySummary } from '@/lib/work-check-in-labels'
import { cn } from '@/lib/utils'

interface CheckInHeroCardProps {
  loading: boolean
  hasCheckedInToday: boolean
  brainStatus: BrainStatusType | null
  energyTank: number | null
  className?: string
}

export function CheckInHeroCard({
  loading,
  hasCheckedInToday,
  brainStatus,
  energyTank,
  className,
}: CheckInHeroCardProps) {
  if (loading) {
    return (
      <div
        className={cn(
          'flex min-h-[280px] items-center justify-center rounded-3xl border border-green/15 bg-green-muted/40 p-8 sm:min-h-[320px] lg:min-h-[min(520px,calc(100dvh-22rem))] lg:p-12',
          className,
        )}
      >
        <p className="text-sm text-text-muted lg:text-base">Loading your check-in status…</p>
      </div>
    )
  }

  if (hasCheckedInToday) {
    return (
      <div
        className={cn(
          'relative flex overflow-hidden rounded-3xl border border-green/20 bg-gradient-to-br from-[#D4E8DA] via-green-muted to-[#E8F0EB] p-6 shadow-md sm:p-8 lg:min-h-[min(520px,calc(100dvh-22rem))] lg:flex-col lg:justify-between lg:p-10',
          className,
        )}
      >
        <CheckInMascot className="pointer-events-none absolute -bottom-4 -right-2 h-40 w-40 opacity-90 sm:h-48 sm:w-48 lg:-bottom-6 lg:right-0 lg:h-72 lg:w-72 lg:opacity-95" />
        <div className="relative z-10 flex max-w-[85%] flex-col gap-5 lg:max-w-[72%] lg:gap-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/60 text-green shadow-sm lg:h-12 lg:w-12">
            <Sun className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
          </div>
          <div className="space-y-2 lg:space-y-3">
            <h2 className="font-display text-2xl font-semibold leading-snug text-text sm:text-3xl lg:text-4xl">
              Today&apos;s check-in complete
            </h2>
            <p className="text-sm leading-relaxed text-text-muted sm:text-base lg:text-lg">
              Thanks for showing up. Your responses stay private to you.
            </p>
          </div>
          {brainStatus && energyTank !== null && (
            <div className="rounded-2xl border border-white/60 bg-white/50 p-4 backdrop-blur-sm lg:p-5">
              <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
                Brain status
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`h-2.5 w-2.5 rounded-full ${getStatusColor(brainStatus)}`}
                  aria-hidden="true"
                />
                <p className="font-display text-lg font-semibold text-text lg:text-xl">
                  {getStatusLabel(brainStatus)}
                </p>
              </div>
              <p className="mt-2 text-sm text-text-muted lg:text-base">
                {getEnergySummary(energyTank)}
              </p>
            </div>
          )}
          <Button
            asChild
            size="lg"
            className="w-fit rounded-full bg-green px-6 shadow-md hover:bg-green-soft lg:px-8 lg:text-lg"
          >
            <Link to="/work-reflection">
              View Daily Reflection
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'relative flex overflow-hidden rounded-3xl border border-green/20 bg-gradient-to-br from-[#C5DBC9] via-[#D4E8DA] to-[#E8F0EB] p-6 shadow-md sm:min-h-[320px] sm:p-8 lg:min-h-[min(520px,calc(100dvh-22rem))] lg:flex-col lg:justify-between lg:p-10',
        className,
      )}
    >
      <CheckInMascot className="pointer-events-none absolute -bottom-2 -right-4 h-44 w-44 sm:h-52 sm:w-52 lg:-bottom-4 lg:right-0 lg:h-80 lg:w-80" />
      <div className="relative z-10 flex max-w-[78%] flex-col gap-5 sm:max-w-[70%] lg:max-w-[65%] lg:gap-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/50 text-green shadow-sm lg:h-12 lg:w-12">
          <Sun className="h-5 w-5 lg:h-6 lg:w-6" aria-hidden="true" />
        </div>
        <div className="space-y-2 lg:space-y-3">
          <h2 className="font-display text-2xl font-semibold leading-snug text-text sm:text-3xl lg:text-4xl lg:leading-tight">
            Your daily check-in is ready
          </h2>
          <p className="text-sm leading-relaxed text-text-muted sm:text-base lg:text-lg">
            {WORK_CHECK_IN_QUESTION_COUNT} quick questions · under 2 minutes · private to
            you
          </p>
        </div>
        <Button
          asChild
          size="lg"
          className="w-fit rounded-full bg-green px-6 shadow-md hover:bg-green-soft lg:px-8 lg:text-lg"
        >
          <Link to="/work-check-in">
            Start Today&apos;s Check-In
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
