import { cn } from '@/lib/utils'

const ENERGY_LABELS = [
  'Running on empty',
  'Low energy',
  'Steady',
  'Good energy',
  'Feeling charged',
] as const

const FOCUS_LABELS = [
  'Very hard to focus',
  'Hard to focus',
  'Some effort',
  'Fairly easy',
  'In the flow',
] as const

const OVERWHELM_LABELS = [
  'Calm and clear',
  'Mostly okay',
  'A little busy',
  'Quite a lot',
  'Quite overwhelmed',
] as const

export type PulseSliderKind = 'energy' | 'focus' | 'overwhelm'

const LABELS_BY_KIND: Record<PulseSliderKind, readonly string[]> = {
  energy: ENERGY_LABELS,
  focus: FOCUS_LABELS,
  overwhelm: OVERWHELM_LABELS,
}

const ACCENT_BY_KIND: Record<PulseSliderKind, string> = {
  energy: 'accent-orange',
  focus: 'accent-green',
  overwhelm: 'accent-lavender',
}

interface PulseSliderProps {
  kind: PulseSliderKind
  value: number | null
  onChange: (value: number) => void
  className?: string
}

export function PulseSlider({ kind, value, onChange, className }: PulseSliderProps) {
  const currentValue = value ?? 3
  const labels = LABELS_BY_KIND[kind]
  const label = labels[currentValue - 1]
  const fillPercent = ((currentValue - 1) / 4) * 100

  return (
    <div className={cn('space-y-8', className)}>
      <p
        className="min-h-[1.75rem] text-center font-display text-xl font-medium text-text transition-opacity duration-300"
        aria-live="polite"
      >
        {label}
      </p>

      <div className="space-y-4 px-1">
        <div className="relative h-3">
          <div className="absolute inset-0 rounded-full bg-cream-dark/80" />
          <div
            className={cn(
              'absolute inset-y-0 left-0 rounded-full transition-all duration-300 ease-out',
              ACCENT_BY_KIND[kind] === 'accent-orange' && 'bg-gradient-to-r from-yellow to-orange/80',
              ACCENT_BY_KIND[kind] === 'accent-green' && 'bg-gradient-to-r from-green-muted to-green/70',
              ACCENT_BY_KIND[kind] === 'accent-lavender' &&
                'bg-gradient-to-r from-lavender-muted to-lavender-deep/70',
            )}
            style={{ width: `${fillPercent}%` }}
            aria-hidden="true"
          />
          <input
            type="range"
            min={1}
            max={5}
            step={1}
            value={currentValue}
            onChange={(event) => onChange(Number(event.target.value))}
            className={cn(
              'pulse-slider absolute inset-0 z-10 h-3 w-full cursor-pointer appearance-none bg-transparent',
              ACCENT_BY_KIND[kind],
            )}
            aria-valuemin={1}
            aria-valuemax={5}
            aria-valuenow={currentValue}
            aria-valuetext={label}
          />
        </div>

        <div className="flex justify-between text-xs font-medium text-text-muted">
          <span>{labels[0]}</span>
          <span>{labels[4]}</span>
        </div>
      </div>
    </div>
  )
}
