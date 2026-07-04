import type {
  AbleToAskNeedsOption,
  DrainOption,
  DrainingTimeOption,
  RefillOption,
} from '@/types/work-energy'

const ENERGY_TANK_LABELS: Record<number, string> = {
  1: 'Nearly empty',
  2: 'Running low',
  3: 'Doing okay',
  4: 'Mostly full',
  5: 'Completely full',
}

const EASE_LABELS: Record<number, string> = {
  1: 'Very easy',
  2: 'Mostly easy',
  3: 'Mixed',
  4: 'Quite difficult',
  5: 'Very difficult',
}

const SUPPORT_LABELS: Record<number, string> = {
  1: 'Not at all',
  2: 'A little',
  3: 'Somewhat',
  4: 'Mostly',
  5: 'Very much',
}

const DRAIN_LABELS: Record<DrainOption, string> = {
  'too-many-meetings': 'Too many meetings',
  'too-many-tasks': 'Too many tasks',
  'unexpected-changes': 'Unexpected changes',
  'too-many-interruptions': 'Too many interruptions',
  noise: 'Noise',
  'social-interaction': 'Social interaction',
  'trying-to-keep-up': 'Trying to keep up',
  'unclear-expectations': 'Unclear expectations',
  'time-pressure': 'Time pressure',
  other: 'Something else',
}

const REFILL_LABELS: Record<RefillOption, string> = {
  'quiet-time': 'Quiet time',
  'finished-something': 'Finishing something',
  'deep-work': 'Deep work',
  'supportive-teammate': 'Supportive teammate',
  breaks: 'Breaks',
  movement: 'Movement',
  'food-or-coffee': 'Food or coffee',
  'listening-to-music': 'Listening to music',
  'clear-plan': 'Clear plan',
  other: 'Something else',
}

const DRAINING_TIME_LABELS: Record<DrainingTimeOption, string> = {
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  'end-of-day': 'End of day',
  'after-work': 'After work',
}

const ASK_NEEDS_LABELS: Record<AbleToAskNeedsOption, string> = {
  yes: 'Yes',
  mostly: 'Mostly',
  'not-really': 'Not really',
  no: 'No',
  'not-needed': "I didn't need to",
}

export function getEnergyTankLabel(value: number): string {
  return ENERGY_TANK_LABELS[value] ?? '—'
}

export function getEaseLabel(value: number): string {
  return EASE_LABELS[value] ?? '—'
}

export function getSupportLabel(value: number): string {
  return SUPPORT_LABELS[value] ?? '—'
}

export function getDrainLabel(
  value: DrainOption,
  otherDetail?: string | null,
): string {
  if (value === 'other' && otherDetail?.trim()) {
    return otherDetail.trim()
  }
  return DRAIN_LABELS[value] ?? '—'
}

export function getRefillLabel(
  value: RefillOption,
  otherDetail?: string | null,
): string {
  if (value === 'other' && otherDetail?.trim()) {
    return otherDetail.trim()
  }
  return REFILL_LABELS[value] ?? '—'
}

export function getDrainingTimeLabel(value: DrainingTimeOption): string {
  return DRAINING_TIME_LABELS[value] ?? '—'
}

export function getAskNeedsLabel(value: AbleToAskNeedsOption): string {
  return ASK_NEEDS_LABELS[value] ?? '—'
}

export function getEnergySummary(value: number): string {
  if (value <= 2) {
    return 'Your tank felt pretty low after work today.'
  }
  if (value === 3) {
    return 'Your energy felt steady — not full, not empty.'
  }
  return 'You ended the day with some energy left.'
}
