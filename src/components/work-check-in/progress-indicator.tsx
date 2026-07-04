import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface WorkCheckInProgressProps {
  current: number
  total: number
  className?: string
}

export function WorkCheckInProgress({
  current,
  total,
  className,
}: WorkCheckInProgressProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={cn('space-y-3', className)} aria-live="polite">
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          {current} of {total}
        </span>
      </div>
      <Progress
        value={percentage}
        aria-label={`Check-in progress: ${current} of ${total}`}
      />
    </div>
  )
}
