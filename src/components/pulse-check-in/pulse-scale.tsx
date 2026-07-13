import { type ReactNode } from 'react'
import { cn } from '@/lib/utils'

const SCALE_STEPS = [1, 2, 3, 4, 5] as const

interface PulseScaleProps {
  label: string
  icon: ReactNode
  iconClassName?: string
  lowLabel: string
  highLabel: string
  value: number | null
  onChange: (value: number) => void
  selectedClassName?: string
}

export function PulseScale({
  label,
  icon,
  iconClassName,
  lowLabel,
  highLabel,
  value,
  onChange,
  selectedClassName = 'border-green bg-green text-white shadow-md',
}: PulseScaleProps) {
  return (
    <div className="rounded-3xl border border-border/80 bg-surface-solid p-4 shadow-sm lg:p-5">
      <div className="mb-4 flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
            iconClassName,
          )}
        >
          {icon}
        </div>
        <p className="font-medium text-text">{label}</p>
      </div>

      <div className="relative px-1">
        <div
          className="relative flex items-center justify-between"
          role="group"
          aria-label={`${label} scale`}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-6 left-6 h-0.5 -translate-y-1/2 rounded-full bg-border lg:right-3 lg:left-3"
          />

          {SCALE_STEPS.map((step) => {
            const selected = value === step
            return (
              <button
                key={step}
                type="button"
                aria-label={`${label} ${step} of 5`}
                aria-pressed={selected}
                onClick={() => onChange(step)}
                className={cn(
                  'relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 text-base font-semibold transition-all duration-200 sm:h-14 sm:w-14 sm:text-lg',
                  'lg:h-9 lg:w-9 lg:text-sm xl:h-10 xl:w-10',
                  selected
                    ? selectedClassName
                    : 'border-border bg-cream text-text-muted hover:border-green/30 hover:bg-yellow/20',
                )}
              >
                {step}
              </button>
            )
          })}
        </div>

        <div className="mt-3 flex justify-between text-xs text-text-muted">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  )
}
