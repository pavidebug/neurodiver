import { typeBodyMuted, typeHelper, typePageTitle } from '@/design-system/tokens'
import { getGreeting } from '@/lib/greeting'
import { cn } from '@/lib/utils'

interface DashboardHeroProps {
  name: string
  headline?: string
  companionMessage?: string
  className?: string
}

export function DashboardHero({
  name,
  headline,
  companionMessage,
  className,
}: DashboardHeroProps) {
  const greeting = getGreeting()
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className={cn('slide-up space-y-2', className)}>
      <p className={typeHelper}>{dateLabel}</p>
      <h1 className={typePageTitle}>
        Good {greeting}, {name}
      </h1>
      <p className={cn(typeBodyMuted, 'max-w-xl')}>
        {headline ?? 'Let’s make today a little easier.'}
      </p>
      {companionMessage ? (
        <p className={cn(typeBodyMuted, 'max-w-xl text-text')}>{companionMessage}</p>
      ) : null}
    </header>
  )
}
