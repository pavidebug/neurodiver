import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CheckInProgressDotsProps {
  activeIndex: number
  className?: string
}

export function CheckInProgressDots({ activeIndex, className }: CheckInProgressDotsProps) {
  return (
    <div
      className={cn('flex items-center justify-center gap-2', className)}
      aria-label={`Step ${Math.min(activeIndex + 1, 4)} of 4`}
    >
      {Array.from({ length: 4 }, (_, index) => (
        <span
          key={index}
          className={cn(
            'h-2 rounded-full transition-all duration-300',
            index === activeIndex
              ? 'w-6 bg-green'
              : index < activeIndex
                ? 'w-2 bg-green/45'
                : 'w-2 bg-border',
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  )
}

interface CheckInStepShellProps {
  stepKey: string
  children: ReactNode
  className?: string
}

export function CheckInStepShell({ stepKey, children, className }: CheckInStepShellProps) {
  return (
    <div
      key={stepKey}
      className={cn(
        'check-in-step flex flex-1 flex-col justify-center fade-in',
        className,
      )}
    >
      {children}
    </div>
  )
}
