import { Link } from 'react-router-dom'
import { ArrowRight, Battery, CheckCircle2, Cloud, Crosshair, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PULSE_MOODS } from '@/data/pulse-moods'
import { getPulseFields } from '@/lib/pulse-recommendations'
import type { WorkCheckIn } from '@/types/work-energy'
import { cn } from '@/lib/utils'

interface TodayCheckInCardProps {
  loading: boolean
  hasCheckedInToday: boolean
  checkIn?: WorkCheckIn | null
  className?: string
}

const MOOD_LABELS = Object.fromEntries(
  PULSE_MOODS.map((mood) => [mood.value, mood.label]),
)

const MOOD_EMOJIS = Object.fromEntries(
  PULSE_MOODS.map((mood) => [mood.value, mood.emoji]),
)

function scaleLabel(value: number | null, low: string, high: string): string {
  if (value == null) return '—'
  if (value <= 2) return low
  if (value >= 4) return high
  return 'In the middle'
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

function MetricResult({
  icon: Icon,
  label,
  value,
  score,
  tone,
}: {
  icon: typeof Battery
  label: string
  value: string
  score: number | null
  tone: 'green' | 'lavender' | 'orange'
}) {
  const activeBars = score == null ? 0 : Math.round(score)
  const toneClasses = {
    green: 'bg-green',
    lavender: 'bg-lavender-deep',
    orange: 'bg-orange',
  }

  return (
    <div className="rounded-2xl border border-white/80 bg-white/65 p-3.5 shadow-[0_8px_22px_rgba(45,90,61,0.06)] backdrop-blur-xl ring-1 ring-green/8">
      <div className="flex items-center gap-2 text-green">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-muted/80">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-text-muted">
          {label}
        </p>
      </div>
      <p className="mt-3 min-h-10 text-sm font-semibold leading-snug text-text">{value}</p>
      <div className="mt-3 flex gap-1" aria-hidden="true">
        {Array.from({ length: 5 }, (_, index) => (
          <span
            key={index}
            className={cn(
              'h-1.5 flex-1 rounded-full',
              index < activeBars ? toneClasses[tone] : 'bg-border/60',
            )}
          />
        ))}
      </div>
    </div>
  )
}

export function TodayCheckInCard({
  loading,
  hasCheckedInToday,
  checkIn = null,
  className,
}: TodayCheckInCardProps) {
  if (loading) {
    return <CheckInSkeleton className={className} />
  }

  if (hasCheckedInToday && checkIn) {
    const pulse = getPulseFields(checkIn)
    const moodLabel = pulse.mood ? MOOD_LABELS[pulse.mood] ?? pulse.mood : 'Not shared'
    const moodEmoji = pulse.mood ? MOOD_EMOJIS[pulse.mood] ?? '✨' : '✨'
    const metrics = [
      {
        id: 'energy',
        icon: Battery,
        label: 'Energy',
        value: scaleLabel(pulse.energy, 'Running low', 'Feeling charged'),
        score: pulse.energy,
        tone: 'green' as const,
      },
      {
        id: 'focus',
        icon: Crosshair,
        label: 'Focus',
        value: scaleLabel(pulse.focus, 'Hard to focus', 'In the flow'),
        score: pulse.focus,
        tone: 'lavender' as const,
      },
      {
        id: 'overwhelm',
        icon: Cloud,
        label: 'Overwhelm',
        value: scaleLabel(pulse.stress, 'Calm and clear', 'Quite overwhelmed'),
        score: pulse.stress,
        tone: 'orange' as const,
      },
    ]

    return (
      <article
        className={cn(
          'relative overflow-hidden rounded-[1.75rem] border border-green/15 bg-gradient-to-br from-white via-green-muted/55 to-lavender-muted/65 px-5 py-5 shadow-[0_18px_44px_rgba(45,90,61,0.11)] backdrop-blur-xl xl:px-6 xl:py-6',
          className,
        )}
      >
        <div className="pointer-events-none absolute -right-14 -top-16 h-40 w-40 rounded-full bg-white/80 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-10 h-44 w-44 rounded-full bg-sage/20 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-white" />

        <div className="relative flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green text-white shadow-[0_8px_20px_rgba(45,90,61,0.22)]">
              <Sparkles className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green">
                Today&apos;s check-in
              </p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-text">
                Your results
              </h2>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green/10 bg-white/65 px-3 py-1.5 text-[11px] font-semibold text-green backdrop-blur-lg">
            <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
            Checked in
          </span>
        </div>

        <div className="relative mt-5 rounded-[1.5rem] border border-white/80 bg-white/55 p-4 shadow-[0_10px_28px_rgba(45,90,61,0.07)] backdrop-blur-xl ring-1 ring-green/8">
          <div className="flex items-center gap-3">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow/60 to-lavender-muted text-3xl shadow-inner">
              {moodEmoji}
            </span>
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-text-muted">Mood</p>
              <p className="mt-0.5 font-display text-xl font-semibold text-text">{moodLabel}</p>
            </div>
          </div>
        </div>

        <div className="relative mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricResult key={metric.id} {...metric} />
          ))}
        </div>

        {checkIn.optionalNote ? (
          <p className="relative mt-4 rounded-2xl border border-white/70 bg-white/45 px-4 py-3 text-sm italic leading-relaxed text-text-muted backdrop-blur-lg">
            {checkIn.optionalNote}
          </p>
        ) : null}
      </article>
    )
  }

  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-orange/15 bg-gradient-to-br from-white via-white to-yellow/30 px-5 py-5 shadow-[var(--shadow-premium)] xl:px-6 xl:py-6',
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
