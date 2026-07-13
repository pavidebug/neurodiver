import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Battery, Cloud, Crosshair, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStrategies } from '@/context/strategy-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { getTodayString } from '@/lib/dates'
import {
  getPulseFields,
  getPulseRecommendationCopy,
  getRecommendedStrategiesFromPulse,
} from '@/lib/pulse-recommendations'
import { clearCachedWorkReflection, readCachedWorkReflection } from '@/lib/work-reflection-cache'
import { PULSE_MOODS } from '@/data/pulse-moods'
import type { WorkCheckIn } from '@/types/work-energy'
import { cn } from '@/lib/utils'

const MOOD_LABELS = Object.fromEntries(PULSE_MOODS.map((mood) => [mood.value, mood.label]))

function scaleLabel(value: number, low: string, high: string): string {
  if (value <= 2) return low
  if (value >= 4) return high
  return 'Somewhere in the middle'
}

export function TodayReflectionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const today = getTodayString()
  const { todayCheckIn } = useWorkEnergy()
  const { strategies } = useStrategies()

  const navigationCheckIn = (location.state as { checkIn?: WorkCheckIn } | null)?.checkIn
  const cachedCheckIn = readCachedWorkReflection(today)
  const checkIn = navigationCheckIn ?? cachedCheckIn ?? todayCheckIn ?? null

  const handleContinue = () => {
    clearCachedWorkReflection()
    navigate('/home', { replace: true })
  }

  if (!checkIn) {
    return (
      <div className="page-enter flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="max-w-xs text-lg leading-relaxed text-text-muted">
          Complete today&apos;s check-in to see your reflection.
        </p>
        <Button asChild size="lg">
          <Link to="/work-check-in">Start check-in</Link>
        </Button>
      </div>
    )
  }

  const pulse = getPulseFields(checkIn)
  const topStrategy = getRecommendedStrategiesFromPulse(strategies, checkIn, 1)[0]
  const summary = getPulseRecommendationCopy(pulse)

  const snapshots = [
    {
      id: 'mood',
      icon: Sparkles,
      label: 'How you felt',
      value: pulse.mood ? MOOD_LABELS[pulse.mood] ?? pulse.mood : '—',
      tint: 'bg-lavender-muted text-lavender-deep',
    },
    {
      id: 'energy',
      icon: Battery,
      label: 'Energy today',
      value: pulse.energy
        ? scaleLabel(pulse.energy, 'Running low', 'Feeling charged')
        : '—',
      tint: 'bg-yellow/35 text-orange',
    },
    {
      id: 'focus',
      icon: Crosshair,
      label: 'Focus today',
      value: pulse.focus
        ? scaleLabel(pulse.focus, 'Hard to focus', 'In the flow')
        : '—',
      tint: 'bg-green-muted text-green',
    },
    {
      id: 'overwhelm',
      icon: Cloud,
      label: 'Overwhelm',
      value: pulse.stress
        ? scaleLabel(pulse.stress, 'Calm and clear', 'Quite overwhelmed')
        : '—',
      tint: 'bg-lavender-muted/80 text-lavender-deep',
    },
  ]

  return (
    <div className="page-enter mx-auto flex min-h-[calc(100dvh-2rem)] max-w-lg flex-col gap-8 py-2 pb-8 lg:max-w-xl">
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium text-green">Today&apos;s reflection</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl">
          What we noticed
        </h1>
        <p className="text-base leading-relaxed text-text-muted">{summary}</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {snapshots.map(({ id, icon: Icon, label, value, tint }) => (
          <article
            key={id}
            className="rounded-[1.25rem] border border-border/50 bg-white/80 p-4 shadow-sm"
          >
            <span className={cn('inline-flex rounded-xl p-2', tint)}>
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <p className="mt-3 text-xs font-medium uppercase tracking-wide text-text-muted">
              {label}
            </p>
            <p className="mt-1 font-display text-lg font-semibold text-text">{value}</p>
          </article>
        ))}
      </div>

      {checkIn.optionalNote ? (
        <section className="rounded-[1.25rem] border border-border/50 bg-yellow/15 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
            For Future You
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text">{checkIn.optionalNote}</p>
        </section>
      ) : null}

      {topStrategy ? (
        <section className="rounded-[1.5rem] border border-green/15 bg-green-muted/35 p-5 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-green">
            One gentle suggestion
          </p>
          <p className="mt-2 font-display text-xl font-semibold text-text">{topStrategy.title}</p>
          <p className="mt-2 text-sm leading-relaxed text-text-muted">{topStrategy.gentleReminder}</p>
          <Button asChild variant="outline" className="mt-4 w-full sm:w-fit">
            <Link to="/strategies">Browse strategies</Link>
          </Button>
        </section>
      ) : null}

      <section
        aria-label="Encouragement"
        className="rounded-3xl bg-yellow/20 px-6 py-7 text-center ring-1 ring-yellow/25"
      >
        <p className="font-display text-xl font-semibold text-text">You showed up for yourself.</p>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">
          That&apos;s enough for today.
        </p>
      </section>

      <div className="mt-auto pt-2">
        <Button size="lg" className="w-full rounded-full" onClick={handleContinue}>
          Back to home
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
