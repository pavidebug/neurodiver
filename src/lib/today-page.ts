import type { FocusSession, SessionBooking } from '@/types/body-doubling'
import type { Strategy, UserStrategyState } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'
import {
  getAdaptiveHomeConfig,
  getBrainDayState,
  type BrainDayState,
} from '@/lib/adaptive-home'
import { buildInsightHighlights } from '@/lib/personal-insights'
import {
  getPulseFields,
  getRecommendedStrategiesFromPulse,
} from '@/lib/pulse-recommendations'

export type PrimaryActionKind = 'strategy' | 'body-double' | 'explore'

export interface TodayPrimaryAction {
  kind: PrimaryActionKind
  title: string
  description: string
  ctaLabel: string
  href: string
  strategyId?: string
  sessionId?: string
}

export type ContinueKind = 'saved-strategy' | 'body-double' | 'reflection' | 'recent-strategy'

export interface TodayContinueItem {
  kind: ContinueKind
  title: string
  description: string
  ctaLabel: string
  href: string
  strategyId?: string
}

function getStrategyHref(strategyId: string): string {
  return `/strategies?strategy=${encodeURIComponent(strategyId)}`
}

function energyStateLabel(energy: number): string {
  if (energy <= 2) return 'Running low'
  if (energy === 3) return 'Steady'
  if (energy === 4) return 'Mostly full'
  return 'High energy'
}

export function getTodayEnergyState(checkIn: WorkCheckIn | null): string | null {
  if (!checkIn) return null
  const pulse = getPulseFields(checkIn)
  const energy = pulse.energy ?? checkIn.energyTank
  if (energy == null) return null
  return energyStateLabel(energy)
}

export function getGentleSentence(
  hasCheckedInToday: boolean,
  brainState: BrainDayState,
  simplifiedMessage: string | null,
): string {
  if (!hasCheckedInToday) {
    return 'A quick check-in helps us suggest something useful for right now.'
  }

  if (simplifiedMessage) return simplifiedMessage

  switch (brainState) {
    case 'exhausted':
      return 'One small step is enough — we’ve kept things simple today.'
    case 'overloaded':
      return 'Recovery comes first. No need to solve everything right now.'
    case 'busy':
      return 'A grounding step or one priority might be enough for today.'
    default:
      return 'Here’s one thing that might help you right now.'
  }
}

function formatStrategyActionTitle(strategy: Strategy, brainState: BrainDayState): string {
  const lower = strategy.title.toLowerCase()

  if (lower.includes('brain dump')) return 'Try a 5-minute brain dump'
  if (lower.includes('priority') || lower.includes('one thing')) return 'Pick one priority'
  if (lower.includes('two minute') || lower.includes('2 minute')) return 'Try a two-minute start'

  if (brainState === 'overloaded' || brainState === 'exhausted') {
    return 'Take a recovery break'
  }

  if (brainState === 'busy') {
    return 'Try a grounding step'
  }

  return strategy.title
}

function shouldRecommendBodyDouble(
  brainState: BrainDayState,
  pulse: ReturnType<typeof getPulseFields>,
): boolean {
  const focus = pulse.focus ?? 3
  return (
    (brainState === 'busy' && focus <= 2) ||
    (pulse.mood === 'stressed' && focus <= 2) ||
    (pulse.energy !== null && pulse.energy <= 2 && focus <= 2)
  )
}

export function getTodayPrimaryAction(
  strategies: Strategy[],
  checkIn: WorkCheckIn | null,
  hasCheckedInToday: boolean,
  userState: UserStrategyState,
  upcomingSession: FocusSession | null,
): TodayPrimaryAction {
  const referenceCheckIn = checkIn
  const pulse = getPulseFields(referenceCheckIn)
  const brainState =
    referenceCheckIn && hasCheckedInToday
      ? getBrainDayState(pulse)
      : referenceCheckIn
        ? getBrainDayState(pulse)
        : 'calm'

  if (
    upcomingSession &&
    shouldRecommendBodyDouble(brainState, pulse)
  ) {
    const timeLabel = upcomingSession.startsAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })

    return {
      kind: 'body-double',
      title: 'Join a focus session',
      description: `${upcomingSession.title} starts at ${timeLabel}. Quiet company can help you get started.`,
      ctaLabel: 'View session',
      href: '/body-double',
      sessionId: upcomingSession.id,
    }
  }

  const recommended = getRecommendedStrategiesFromPulse(
    strategies,
    referenceCheckIn,
    1,
    userState.usage,
  )

  const strategy = recommended[0] ?? strategies.find((item) => item.isActive)

  if (strategy) {
    return {
      kind: 'strategy',
      title: formatStrategyActionTitle(strategy, brainState),
      description: strategy.situation,
      ctaLabel: 'Try this now',
      href: getStrategyHref(strategy.id),
      strategyId: strategy.id,
    }
  }

  return {
    kind: 'explore',
    title: hasCheckedInToday ? 'Browse strategies' : 'Explore strategies',
    description: hasCheckedInToday
      ? 'Explore your personal playbook when you have a little capacity.'
      : 'Find a gentle starting point while you get into the rhythm of checking in.',
    ctaLabel: 'Open strategies',
    href: '/strategies',
  }
}

export function getTodayContinueItem(
  strategies: Strategy[],
  userState: UserStrategyState,
  userBookings: SessionBooking[],
  upcomingSessions: FocusSession[],
): TodayContinueItem | null {
  const bookedSession = userBookings
    .filter((booking) => booking.attendanceStatus === 'booked')
    .map((booking) => {
      const session = upcomingSessions.find((item) => item.id === booking.sessionId)
      return session ? { booking, session } : null
    })
    .filter(Boolean)
    .sort((a, b) => a!.session.startsAt.getTime() - b!.session.startsAt.getTime())[0]

  if (bookedSession) {
    const { session } = bookedSession
    const timeLabel = session.startsAt.toLocaleTimeString('en-US', {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    })

    return {
      kind: 'body-double',
      title: 'Your upcoming focus session',
      description: `${session.title} · ${timeLabel}`,
      ctaLabel: 'View booking',
      href: '/body-double',
    }
  }

  const savedIds = userState.savedIds
  if (savedIds.length > 0) {
    const lastSavedId = savedIds[savedIds.length - 1]
    const strategy = strategies.find((item) => item.id === lastSavedId)
    if (strategy) {
      return {
        kind: 'saved-strategy',
        title: 'Continue your saved strategy',
        description: strategy.title,
        ctaLabel: 'Open strategy',
        href: getStrategyHref(strategy.id),
        strategyId: strategy.id,
      }
    }
  }

  if (userState.lastViewedId) {
    const strategy = strategies.find((item) => item.id === userState.lastViewedId)
    if (strategy) {
      return {
        kind: 'recent-strategy',
        title: 'Recently viewed',
        description: strategy.title,
        ctaLabel: 'Pick up where you left off',
        href: getStrategyHref(strategy.id),
        strategyId: strategy.id,
      }
    }
  }

  return null
}

export function getTinyEncouragement(
  monthlyCheckInCount: number,
  checkIns: WorkCheckIn[],
  strategies: Strategy[],
  userState: UserStrategyState,
): string {
  if (monthlyCheckInCount > 0) {
    return `You’ve checked in ${monthlyCheckInCount} time${monthlyCheckInCount === 1 ? '' : 's'} this month.`
  }

  if (userState.savedIds.length > 0) {
    return 'Your personal playbook is growing.'
  }

  const highlights = buildInsightHighlights(checkIns, strategies, userState)
  const drainHighlight = highlights.find((item) => item.icon === 'drain')
  if (drainHighlight && !drainHighlight.id.startsWith('placeholder')) {
    return drainHighlight.title.replace(' drain you most', ' seem to drain you most') + '.'
  }

  return 'Small steps add up — no pressure.'
}

export function getTodayPageConfig(
  checkIn: WorkCheckIn | null,
  hasCheckedInToday: boolean,
) {
  return getAdaptiveHomeConfig(checkIn, hasCheckedInToday)
}
