import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface WeeklyResetStepShellProps {
  stepKey: string
  children: ReactNode
  className?: string
}

export function WeeklyResetStepShell({
  stepKey,
  children,
  className,
}: WeeklyResetStepShellProps) {
  return (
    <div key={stepKey} className={cn('fade-in space-y-6', className)}>
      {children}
    </div>
  )
}

interface WeeklyResetQuestionProps {
  children: ReactNode
  className?: string
}

export function WeeklyResetQuestion({ children, className }: WeeklyResetQuestionProps) {
  return (
    <h2
      className={cn(
        'text-center font-display text-[1.625rem] font-semibold leading-snug tracking-tight text-text sm:text-3xl',
        className,
      )}
    >
      {children}
    </h2>
  )
}
