import { cn } from '@/lib/utils'

interface TodayEncouragementProps {
  message: string
  className?: string
}

export function TodayEncouragement({ message, className }: TodayEncouragementProps) {
  return (
    <p className={cn('text-center text-sm leading-relaxed text-text-muted', className)}>
      {message}
    </p>
  )
}
