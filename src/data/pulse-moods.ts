import type { PulseMood } from '@/types/pulse-check-in'

export const PULSE_MOODS: Array<{
  value: PulseMood
  emoji: string
  label: string
}> = [
  { value: 'great', emoji: '😊', label: 'Good' },
  { value: 'calm', emoji: '🙂', label: 'Calm' },
  { value: 'okay', emoji: '😐', label: 'Okay' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'stressed', emoji: '😰', label: 'Stressed' },
  { value: 'low', emoji: '😔', label: 'Low' },
]

export const PULSE_SCALE_LABELS = {
  low: 'Low',
  high: 'High',
} as const
