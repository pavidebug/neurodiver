import type {
  AbleToAskNeedsOption,
  AccommodationOption,
  DrainOption,
  DrainingTimeOption,
  RefillOption,
} from '@/types/work-energy'

const ENERGY_TANK_LABELS: Record<number, string> = {
  1: 'Nearly empty',
  2: 'Running low',
  3: 'Somewhere in the middle',
  4: 'Mostly full',
  5: 'Fully charged',
}

const MASKING_LABELS: Record<number, string> = {
  1: 'Hardly at all',
  2: 'A little',
  3: 'A moderate amount',
  4: 'Quite a lot',
  5: 'Nearly all day',
}

const SUPPORT_LABELS: Record<number, string> = {
  1: 'Not at all',
  2: 'A little',
  3: 'Somewhat',
  4: 'Mostly',
  5: 'Very supported',
}

const WOULD_USE_AGAIN_LABELS: Record<number, string> = {
  1: 'Probably not',
  2: 'Unlikely',
  3: 'Maybe',
  4: 'Likely',
  5: 'Yes, definitely',
}

const DRAIN_LABELS: Record<DrainOption, string> = {
  'too-many-meetings': 'Too many meetings',
  'too-many-tasks': 'Too many tasks at once',
  'unexpected-changes': 'Unexpected changes',
  'too-many-interruptions': 'Too many interruptions',
  noise: 'Noise or sensory overload',
  'social-interaction': 'Social interaction',
  'trying-to-keep-up': 'Trying to keep up',
  'unclear-expectations': 'Unclear expectations',
  'time-pressure': 'Deadlines or time pressure',
  other: 'Something else',
}

const REFILL_LABELS: Record<RefillOption, string> = {
  'quiet-time': 'Quiet time alone',
  'finished-something': 'Finishing something',
  'deep-work': 'Uninterrupted focus time',
  'supportive-teammate': 'A supportive teammate',
  breaks: 'Taking breaks',
  movement: 'Moving my body',
  'food-or-coffee': 'Food, water, or coffee',
  'listening-to-music': 'Music or a podcast',
  'clear-plan': 'Having a clear plan',
  other: 'Something else',
}

const ACCOMMODATION_LABELS: Record<AccommodationOption, string> = {
  'quiet-space': 'A quieter workspace',
  'flexible-schedule': 'Flexible schedule',
  'fewer-meetings': 'Fewer meetings',
  'written-instructions': 'Written instructions',
  'async-communication': 'More async communication',
  'regular-breaks': 'Protected break time',
  'fewer-interruptions': 'Fewer interruptions',
  'clearer-expectations': 'Clearer expectations',
  'predictable-routine': 'More predictable routine',
  'workload-adjustment': 'Lighter workload',
  other: 'Something else',
}

const DRAINING_TIME_LABELS: Record<DrainingTimeOption, string> = {
  morning: 'Morning',
  midday: 'Midday',
  afternoon: 'Afternoon',
  'end-of-day': 'End of day',
  'after-work': 'After I clocked off',
}

const ASK_NEEDS_LABELS: Record<AbleToAskNeedsOption, string> = {
  yes: 'Yes, comfortably',
  mostly: 'Mostly, with some hesitation',
  'not-really': 'Not really',
  no: 'No, not at all',
  'not-needed': "I didn't need to today",
}

export function getEnergyTankLabel(value: number): string {
  return ENERGY_TANK_LABELS[value] ?? '—'
}

export function getEaseLabel(value: number): string {
  return MASKING_LABELS[value] ?? '—'
}

export function getSupportLabel(value: number): string {
  return SUPPORT_LABELS[value] ?? '—'
}

export function getWouldUseAgainLabel(value: number): string {
  return WOULD_USE_AGAIN_LABELS[value] ?? '—'
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

export function getAccommodationLabel(
  value: AccommodationOption,
  otherDetail?: string | null,
): string {
  if (value === 'other' && otherDetail?.trim()) {
    return otherDetail.trim()
  }
  return ACCOMMODATION_LABELS[value] ?? '—'
}

export function formatDrainLabels(
  drains: DrainOption[],
  otherDetail?: string | null,
): string {
  if (drains.length === 0) return '—'
  return drains
    .map((drain) => getDrainLabel(drain, drain === 'other' ? otherDetail : null))
    .join(', ')
}

export function formatRefillLabels(
  refills: RefillOption[],
  otherDetail?: string | null,
): string {
  if (refills.length === 0) return '—'
  return refills
    .map((refill) =>
      getRefillLabel(refill, refill === 'other' ? otherDetail : null),
    )
    .join(', ')
}

export function formatAccommodationLabels(
  needs: AccommodationOption[],
  otherDetail?: string | null,
): string {
  if (needs.length === 0) return '—'
  return needs
    .map((need) =>
      getAccommodationLabel(need, need === 'other' ? otherDetail : null),
    )
    .join(', ')
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
    return 'Your energy landed somewhere in the middle — not full, not empty.'
  }
  return 'You ended the day with some energy still in the tank.'
}

export { DRAIN_LABELS, REFILL_LABELS, ACCOMMODATION_LABELS }
