import { Activity, Sun } from 'lucide-react'
import { NeuroDiverLogo } from '@/components/brand/neurodiver-logo'
import { getGreeting } from '@/lib/greeting'

interface PulseCheckInHeaderProps {
  name: string
}

export function PulseCheckInHeader({ name }: PulseCheckInHeaderProps) {
  const greeting = getGreeting()

  return (
    <header className="space-y-4 lg:space-y-5">
      <div className="flex items-center justify-between gap-4 lg:hidden">
        <NeuroDiverLogo size="sm" showText={false} />
        <p className="flex items-center gap-1.5 text-sm text-text-muted">
          <Sun className="h-4 w-4 text-orange" aria-hidden="true" />
          Good {greeting}, {name}
          <span aria-hidden="true">👋</span>
        </p>
      </div>

      <p className="hidden items-center gap-1.5 text-base text-text-muted lg:flex">
        <Sun className="h-4 w-4 text-orange" aria-hidden="true" />
        Good {greeting}, {name}
        <span aria-hidden="true">👋</span>
      </p>

      <div className="space-y-2">
        <h1 className="flex items-center gap-2 font-display text-3xl font-semibold tracking-tight text-text lg:text-4xl">
          Quick pulse check
          <Activity className="h-6 w-6 text-orange lg:h-7 lg:w-7" aria-hidden="true" />
        </h1>
        <p className="text-sm leading-relaxed text-text-muted lg:text-base">
          About 30 seconds. No pressure — skip if today isn&apos;t the day.
        </p>
      </div>
    </header>
  )
}
