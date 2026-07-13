import { typeBodyMuted, typeHelper, typePageTitle } from '@/design-system/tokens'
import { getGreeting } from '@/lib/greeting'
import { cn } from '@/lib/utils'

interface TodayGreetingProps {
  name: string
  gentleSentence: string
  className?: string
}

export function TodayGreeting({ name, gentleSentence, className }: TodayGreetingProps) {
  const greeting = getGreeting()
  const dateLabel = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <header className={cn('space-y-2', className)}>
      <p className={typeHelper}>{dateLabel}</p>
      <h1 className={typePageTitle}>
        Good {greeting}, {name}
      </h1>
      <p className={cn(typeBodyMuted, 'max-w-lg')}>{gentleSentence}</p>
    </header>
  )
}
