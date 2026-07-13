import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface OnboardingStepShellProps {
  title: string
  helper?: string
  children: ReactNode
  className?: string
}

export function OnboardingStepShell({
  title,
  helper,
  children,
  className,
}: OnboardingStepShellProps) {
  return (
    <div className={cn('onboarding-step-enter space-y-6', className)}>
      <div className="space-y-2">
        <h1 className="font-display text-[1.75rem] font-semibold leading-tight text-text sm:text-3xl">
          {title}
        </h1>
        {helper ? <p className="text-base leading-relaxed text-text-muted">{helper}</p> : null}
      </div>
      {children}
    </div>
  )
}
