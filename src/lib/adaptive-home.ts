import type { PulseRecommendationContext } from '@/lib/pulse-recommendations'
import { getPulseFields } from '@/lib/pulse-recommendations'
import type { WorkCheckIn } from '@/types/work-energy'

export type BrainDayState = 'calm' | 'busy' | 'overloaded' | 'exhausted'

export interface AdaptiveHomeConfig {
  brainState: BrainDayState
  headline: string
  companionMessage: string
  simplifiedMessage: string | null
  strategyLimit: number
  showWeeklyReview: boolean
  showBodyDouble: boolean
  showExploreMore: boolean
  showInsightsPreview: boolean
  calmMode: boolean
  primaryAction: 'check-in' | 'strategy' | 'recovery' | 'reflection'
}

export function getBrainDayState(pulse: PulseRecommendationContext): BrainDayState {
  const energy = pulse.energy ?? 3
  const stress = pulse.stress ?? 3
  const focus = pulse.focus ?? 3

  if (energy <= 1 || (energy <= 2 && stress >= 4 && pulse.mood === 'low')) {
    return 'exhausted'
  }

  if (stress >= 4 || energy <= 2) {
    return 'overloaded'
  }

  if (focus <= 2 || stress >= 3 || pulse.mood === 'stressed') {
    return 'busy'
  }

  return 'calm'
}

const STATE_CONFIG: Record<
  BrainDayState,
  Omit<AdaptiveHomeConfig, 'brainState' | 'primaryAction'> & {
    primaryAction: AdaptiveHomeConfig['primaryAction']
  }
> = {
  calm: {
    headline: 'Let’s make today a little easier.',
    companionMessage: 'Here’s one thing that might help you stay focused.',
    simplifiedMessage: null,
    strategyLimit: 3,
    showWeeklyReview: true,
    showBodyDouble: true,
    showExploreMore: true,
    showInsightsPreview: true,
    calmMode: false,
    primaryAction: 'strategy',
  },
  busy: {
    headline: 'No need to solve everything right now.',
    companionMessage: 'A grounding step and one priority might be enough for today.',
    simplifiedMessage: null,
    strategyLimit: 3,
    showWeeklyReview: true,
    showBodyDouble: true,
    showExploreMore: false,
    showInsightsPreview: true,
    calmMode: false,
    primaryAction: 'strategy',
  },
  overloaded: {
    headline: 'It looks like today asked a lot from you.',
    companionMessage: 'We’ve kept things simple — recovery comes first.',
    simplifiedMessage: 'Based on how you’re feeling today, we’ve simplified your space.',
    strategyLimit: 2,
    showWeeklyReview: false,
    showBodyDouble: false,
    showExploreMore: false,
    showInsightsPreview: true,
    calmMode: true,
    primaryAction: 'recovery',
  },
  exhausted: {
    headline: 'One small step is enough today.',
    companionMessage: 'Rest counts. Here’s a single low-effort support if you want it.',
    simplifiedMessage: 'Based on how you’re feeling today, we’ve simplified your space.',
    strategyLimit: 1,
    showWeeklyReview: false,
    showBodyDouble: false,
    showExploreMore: false,
    showInsightsPreview: false,
    calmMode: true,
    primaryAction: 'recovery',
  },
}

export function getAdaptiveHomeConfig(
  checkIn: WorkCheckIn | null,
  hasCheckedInToday: boolean,
): AdaptiveHomeConfig {
  if (!hasCheckedInToday || !checkIn) {
    return {
      brainState: 'calm',
      headline: 'Let’s make today a little easier.',
      companionMessage: 'A quick check-in helps NeuroDiver understand what kind of day you’re having.',
      simplifiedMessage: null,
      strategyLimit: 0,
      showWeeklyReview: true,
      showBodyDouble: true,
      showExploreMore: true,
      showInsightsPreview: false,
      calmMode: false,
      primaryAction: 'check-in',
    }
  }

  const pulse = getPulseFields(checkIn)
  const brainState = getBrainDayState(pulse)

  return {
    brainState,
    ...STATE_CONFIG[brainState],
  }
}

export function getTodayCheckInInsight(checkIn: WorkCheckIn | null): string | null {
  if (!checkIn) return null

  const pulse = getPulseFields(checkIn)
  const parts: string[] = []

  if (pulse.energy !== null) {
    if (pulse.energy <= 2) parts.push('Your energy is running low today')
    else if (pulse.energy >= 4) parts.push('Your energy looks steady today')
  }

  if (pulse.stress !== null && pulse.stress >= 4) {
    parts.push('stress feels elevated')
  } else if (pulse.focus !== null && pulse.focus <= 2) {
    parts.push('focus may be harder to hold right now')
  }

  if (parts.length === 0) {
    return 'You checked in today — that’s a solid start.'
  }

  if (parts.length === 1) return `${parts[0]}.`

  return `${parts[0]}, and ${parts[1]}.`
}
