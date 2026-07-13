import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'

interface OnboardingProgressProps {
  current: number
  total: number
  className?: string
}

export function OnboardingProgress({
  current,
  total,
  className,
}: OnboardingProgressProps) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className={cn('space-y-2', className)} aria-live="polite">
      <div className="flex items-center justify-between text-sm text-text-muted">
        <span className="font-medium">
          {current} of {total}
        </span>
      </div>
      <Progress
        value={percentage}
        aria-label={`Onboarding progress: ${current} of ${total}`}
        className="h-1.5 bg-green-muted/40"
      />
    </div>
  )
}
