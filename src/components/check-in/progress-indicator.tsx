import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface ProgressIndicatorProps {
  current: number
  total: number
  className?: string
}

export function ProgressIndicator({
  current,
  total,
  className,
}: ProgressIndicatorProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={cn('space-y-2', className)} aria-live="polite">
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span>
          Question {current} of {total}
        </span>
        <span>{percentage}%</span>
      </div>
      <Progress
        value={percentage}
        aria-label={`Check-in progress: question ${current} of ${total}`}
      />
    </div>
  )
}
