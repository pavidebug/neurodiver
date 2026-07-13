import { PULSE_MOODS } from '@/data/pulse-moods'
import type { PulseMood } from '@/types/pulse-check-in'
import { cn } from '@/lib/utils'

const MOOD_EMOJI = Object.fromEntries(
  PULSE_MOODS.map((mood) => [mood.value, mood.emoji]),
) as Record<PulseMood, string>

export function MoodIcon({ mood, className }: { mood: PulseMood; className?: string }) {
  return (
    <span className={cn('text-3xl leading-none lg:text-4xl', className)} aria-hidden="true">
      {MOOD_EMOJI[mood]}
    </span>
  )
}
