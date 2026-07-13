import { cn } from '@/lib/utils'

interface CompactScaleProps {
  label: string
  lowLabel?: string
  highLabel?: string
  value: number | null
  onChange: (value: number) => void
}

export function CompactScale({
  label,
  lowLabel = 'Low',
  highLabel = 'High',
  value,
  onChange,
}: CompactScaleProps) {
  return (
    <fieldset>
      <legend className="mb-3 text-sm font-medium text-text">{label}</legend>
      <div className="flex items-center justify-between gap-2">
        <span className="w-10 text-xs text-text-muted">{lowLabel}</span>
        <div className="flex flex-1 justify-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <button
              key={step}
              type="button"
              aria-label={`${label} ${step} of 5`}
              aria-pressed={value === step}
              onClick={() => onChange(step)}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                value === step
                  ? 'border-green bg-green text-white shadow-sm'
                  : 'border-border bg-surface text-text-muted hover:border-green/30',
              )}
            >
              {step}
            </button>
          ))}
        </div>
        <span className="w-10 text-right text-xs text-text-muted">{highLabel}</span>
      </div>
    </fieldset>
  )
}
