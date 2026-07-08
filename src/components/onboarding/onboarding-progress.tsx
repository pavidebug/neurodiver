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
      <div className="flex items-center justify-between text-sm text-[#6B6B63]">
        <span className="font-medium">
          Step {current} of {total}
        </span>
      </div>
      <Progress
        value={percentage}
        aria-label={`Onboarding progress: step ${current} of ${total}`}
        className="h-2 bg-[#EBDFAD]/50"
      />
    </div>
  )
}
