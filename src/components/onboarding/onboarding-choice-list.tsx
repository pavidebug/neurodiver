import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface OnboardingChoiceOption<T extends string> {
  value: T
  label: string
}

interface OnboardingChoiceListProps<T extends string> {
  options: OnboardingChoiceOption<T>[]
  value: T | null
  onChange: (value: T) => void
  className?: string
}

export function OnboardingChoiceList<T extends string>({
  options,
  value,
  onChange,
  className,
}: OnboardingChoiceListProps<T>) {
  return (
    <div className={cn('space-y-2.5', className)} role="listbox" aria-label="Choose one option">
      {options.map((option) => {
        const selected = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            role="option"
            aria-selected={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              'flex min-h-[3.25rem] w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-[0.9375rem] font-medium transition-all duration-200',
              'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green',
              selected
                ? 'border-green/30 bg-green-muted/60 text-text shadow-sm'
                : 'border-border/70 bg-white/90 text-text hover:border-green/20 hover:bg-cream/60',
            )}
          >
            <span>{option.label}</span>
            {selected ? (
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green text-white">
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
