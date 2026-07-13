import { MoodIcon } from '@/components/pulse-check-in/mood-icon'
import { PULSE_MOODS } from '@/data/pulse-moods'
import type { PulseMood } from '@/types/pulse-check-in'
import { cn } from '@/lib/utils'

interface ConversationalMoodPickerProps {
  value: PulseMood | null
  onChange: (mood: PulseMood) => void
}

export function ConversationalMoodPicker({ value, onChange }: ConversationalMoodPickerProps) {
  return (
    <div
      role="radiogroup"
      aria-label="How are you feeling right now?"
      className="grid grid-cols-3 gap-3 sm:grid-cols-6 sm:gap-4"
    >
      {PULSE_MOODS.map((mood) => {
        const selected = value === mood.value
        return (
          <button
            key={mood.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(mood.value)}
            className={cn(
              'flex flex-col items-center gap-2.5 rounded-[1.25rem] border-2 bg-white/80 px-2 py-4 shadow-sm transition-all duration-300',
              'hover:border-green/30 hover:shadow-md active:scale-[0.98]',
              selected
                ? 'border-green bg-green-muted/40 shadow-[0_8px_24px_rgba(45,90,61,0.12)] scale-[1.02]'
                : 'border-border/60',
            )}
          >
            <MoodIcon mood={mood.value} className="text-4xl sm:text-[2.5rem]" />
            <span className="text-sm font-medium text-text">{mood.label}</span>
          </button>
        )
      })}
    </div>
  )
}
