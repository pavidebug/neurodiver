import { cn } from '@/lib/utils'

interface OnboardingMultiChoiceOption<T extends string> {
  value: T
  label: string
}

interface OnboardingMultiChoiceProps<T extends string> {
  options: OnboardingMultiChoiceOption<T>[]
  values: T[]
  limit: number
  onChange: (values: T[]) => void
  className?: string
}

export function OnboardingMultiChoice<T extends string>({
  options,
  values,
  limit,
  onChange,
  className,
}: OnboardingMultiChoiceProps<T>) {
  function toggle(value: T) {
    if (values.includes(value)) {
      onChange(values.filter((item) => item !== value))
      return
    }

    if (values.length >= limit) return
    onChange([...values, value])
  }

  return (
    <div className={cn('space-y-2', className)}>
      <p className="text-xs font-medium text-text-muted">
        {values.length} of {limit} selected
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = values.includes(option.value)
          const disabled = !selected && values.length >= limit

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              disabled={disabled}
              onClick={() => toggle(option.value)}
              className={cn(
                'min-h-11 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition-all duration-200',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green',
                selected
                  ? 'border-green/30 bg-green-muted/60 text-text'
                  : 'border-border/70 bg-white/90 text-text hover:border-green/20 hover:bg-cream/60',
                disabled && 'cursor-not-allowed opacity-45',
              )}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
