export type PulseMood = 'great' | 'calm' | 'okay' | 'tired' | 'stressed' | 'low'

const PULSE_MOOD_VALUES: PulseMood[] = ['great', 'calm', 'okay', 'tired', 'stressed', 'low']

export function isPulseMood(value: unknown): value is PulseMood {
  return typeof value === 'string' && PULSE_MOOD_VALUES.includes(value as PulseMood)
}

export type CheckInType = 'daily' | 'legacy'

export interface DailyPulseInput {
  mood: PulseMood
  energy: number
  focus: number
  stress: number
  optionalNote?: string
}

export interface DailyPulseCheckIn extends Omit<DailyPulseInput, 'optionalNote'> {
  type: 'daily'
  userId: string
  date: string
  checkInTime: string
  optionalNote: string | null
  brainStatus: import('@/lib/data').BrainStatusType
  energyTank: number
  isGuest: boolean
}
