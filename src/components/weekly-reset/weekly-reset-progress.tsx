import { cn } from '@/lib/utils'

const STEP_COUNT = 6

interface WeeklyResetProgressProps {
  activeIndex: number
  className?: string
}

export function WeeklyResetProgress({ activeIndex, className }: WeeklyResetProgressProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      aria-label={`Step ${activeIndex + 1} of ${STEP_COUNT}`}
    >
      {Array.from({ length: STEP_COUNT }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            index === activeIndex
              ? 'w-6 bg-lavender-deep'
              : index < activeIndex
                ? 'w-2 bg-lavender-deep/45'
                : 'w-2 bg-lavender/25',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

export { STEP_COUNT as WEEKLY_RESET_STEP_COUNT }
