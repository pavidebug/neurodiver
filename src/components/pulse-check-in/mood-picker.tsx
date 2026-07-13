import { Check } from 'lucide-react'
import { MoodIcon } from '@/components/pulse-check-in/mood-icon'
import type { PulseMood } from '@/types/pulse-check-in'
import { PULSE_MOODS } from '@/data/pulse-moods'
import { cn } from '@/lib/utils'

interface MoodPickerProps {
  value: PulseMood | null
  onChange: (mood: PulseMood) => void
}

export function MoodPicker({ value, onChange }: MoodPickerProps) {
  return (
    <fieldset className="space-y-4">
      <legend className="text-base font-medium text-text">
        How are you feeling right now?
      </legend>

      <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-6 lg:gap-3 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
        {PULSE_MOODS.map((mood) => {
          const selected = value === mood.value
          return (
            <button
              key={mood.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(mood.value)}
              className="flex w-[4.75rem] shrink-0 flex-col items-center gap-2 lg:w-auto"
            >
              <span
                className={cn(
                  'flex h-[4.75rem] w-[4.75rem] items-center justify-center rounded-2xl border-2 bg-surface-solid shadow-sm transition-all duration-200',
                  'lg:h-16 lg:w-full lg:max-w-[5.5rem]',
                  selected
                    ? 'border-green scale-[1.02] shadow-md'
                    : 'border-border/70 hover:border-green/30',
                )}
              >
                <MoodIcon mood={mood.value} />
              </span>
              <span className="text-xs font-medium text-text">{mood.label}</span>
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors',
                  selected
                    ? 'border-green bg-green text-white'
                    : 'border-border bg-transparent',
                )}
                aria-hidden="true"
              >
                {selected ? <Check className="h-3 w-3" strokeWidth={3} /> : null}
              </span>
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
