import type { UserStrategyState } from '@/types/strategy'
import type { Strategy } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'
import { getPulseFields } from '@/lib/pulse-recommendations'

export interface PersonalInsight {
  id: string
  label: string
  value: string
}

export type InsightIconKey = 'drain' | 'energy' | 'strategy' | 'pattern'

export interface InsightHighlight {
  id: string
  icon: InsightIconKey
  title: string
  subtitle: string
}

export type QuickInsightIconKey = 'energy' | 'strategies' | 'drains' | 'recovery'

export interface QuickInsightCard {
  id: string
  icon: QuickInsightIconKey
  title: string
  description: string
  href: string
}

export const MONTHLY_INSIGHT_TARGET = 10

export function getMonthlyInsightProgress(monthlyCount: number) {
  const current = Math.min(monthlyCount, MONTHLY_INSIGHT_TARGET)
  return {
    current,
    target: MONTHLY_INSIGHT_TARGET,
    remaining: Math.max(0, MONTHLY_INSIGHT_TARGET - monthlyCount),
    unlocked: monthlyCount >= MONTHLY_INSIGHT_TARGET,
  }
}

const DAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
] as const

const DRAIN_LABELS: Record<string, string> = {
  'too-many-meetings': 'Too many meetings',
  'too-many-tasks': 'Too many tasks',
  'unexpected-changes': 'Unexpected changes',
  'too-many-interruptions': 'Too many interruptions',
  noise: 'Noise',
  'social-interaction': 'Social interaction',
  'trying-to-keep-up': 'Trying to keep up',
  'unclear-expectations': 'Unclear expectations',
  'time-pressure': 'Time pressure',
  other: 'Other drains',
}

const REFILL_LABELS: Record<string, string> = {
  'quiet-time': 'Quiet time',
  'finished-something': 'Finishing something',
  'deep-work': 'Deep work',
  'supportive-teammate': 'Supportive teammate',
  breaks: 'Breaks',
  movement: 'Movement',
  'food-or-coffee': 'Food or coffee',
  'listening-to-music': 'Listening to music',
  'clear-plan': 'A clear plan',
  other: 'Other refills',
}

function energyLabel(level: number): string {
  if (level <= 2) return 'Running low'
  if (level === 3) return 'Steady'
  if (level === 4) return 'Mostly full'
  return 'High energy'
}

export function buildPersonalInsights(
  checkIns: WorkCheckIn[],
  strategies: Strategy[],
  userState: UserStrategyState,
): PersonalInsight[] {
  const insights: PersonalInsight[] = []
  const recent = checkIns.slice(0, 14)

  if (recent.length === 0) {
    return [
      {
        id: 'getting-started',
        label: 'Getting started',
        value: 'Check in a few times and your personal playbook will begin to take shape.',
      },
    ]
  }

  const energyCounts = new Map<string, number>()
  for (const checkIn of recent) {
    const pulse = getPulseFields(checkIn)
    const energy = pulse.energy ?? checkIn.energyTank
    if (energy == null) continue
    const label = energyLabel(energy)
    energyCounts.set(label, (energyCounts.get(label) ?? 0) + 1)
  }

  const topEnergy = [...energyCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (topEnergy) {
    insights.push({
      id: 'energy-state',
      label: 'Most common energy state',
      value: `${topEnergy[0]} — showing up in ${topEnergy[1]} of your recent check-ins.`,
    })
  }

  const saved = strategies.filter((s) => userState.savedIds.includes(s.id))
  if (saved.length > 0) {
    insights.push({
      id: 'saved-strategies',
      label: 'Strategies you save most',
      value: saved
        .slice(0, 3)
        .map((s) => s.title)
        .join(', '),
    })
  }

  const helpfulIds = Object.entries(userState.usage)
    .filter(([, usage]) => (usage.timesMarkedHelpful ?? 0) > 0)
    .sort((a, b) => (b[1].timesMarkedHelpful ?? 0) - (a[1].timesMarkedHelpful ?? 0))
    .slice(0, 2)
    .map(([id]) => strategies.find((s) => s.id === id)?.title)
    .filter(Boolean)

  if (helpfulIds.length > 0) {
    insights.push({
      id: 'helpful-strategies',
      label: 'Strategies that helped',
      value: helpfulIds.join(' and '),
    })
  }

  const drainCounts = new Map<string, number>()
  const refillCounts = new Map<string, number>()
  for (const checkIn of recent) {
    for (const drain of checkIn.drains ?? []) {
      const label = DRAIN_LABELS[drain] ?? drain
      drainCounts.set(label, (drainCounts.get(label) ?? 0) + 1)
    }
    for (const refill of checkIn.refills ?? []) {
      const label = REFILL_LABELS[refill] ?? refill
      refillCounts.set(label, (refillCounts.get(label) ?? 0) + 1)
    }
  }

  const topDrain = [...drainCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (topDrain) {
    insights.push({
      id: 'biggest-drains',
      label: 'Biggest drains lately',
      value: topDrain[0],
    })
  }

  const topRefill = [...refillCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (topRefill) {
    insights.push({
      id: 'recovery-patterns',
      label: 'Best recovery patterns',
      value: topRefill[0],
    })
  }

  const overloadDays = recent.filter((checkIn) => {
    const pulse = getPulseFields(checkIn)
    return (pulse.stress ?? 0) >= 4 || (pulse.energy ?? 5) <= 2
  }).length

  if (overloadDays >= 3) {
    insights.push({
      id: 'overload-pattern',
      label: 'When overload shows up',
      value: `You've had ${overloadDays} heavier days in your last ${recent.length} check-ins. Mid-week tends to be worth watching.`,
    })
  }

  return insights.slice(0, 5)
}

function shortenDrainLabel(label: string): string {
  const lower = label.toLowerCase()
  if (lower.includes('meeting')) return 'Meetings drain you most'
  if (lower.includes('task')) return 'Too many tasks drain you most'
  if (lower.includes('interruption')) return 'Interruptions drain you most'
  if (lower.includes('noise')) return 'Noise drains you most'
  if (lower.includes('social')) return 'Social interaction drains you most'
  if (lower.includes('pressure')) return 'Time pressure drains you most'
  return `${label} drains you most`
}

function getEnergyTimeHighlight(checkIns: WorkCheckIn[]): InsightHighlight | null {
  const morning: number[] = []
  const afternoon: number[] = []

  for (const checkIn of checkIns) {
    const pulse = getPulseFields(checkIn)
    const energy = pulse.energy ?? checkIn.energyTank
    if (energy == null || !checkIn.checkInTime) continue

    const hour = new Date(checkIn.checkInTime).getHours()
    if (hour < 12) morning.push(energy)
    else afternoon.push(energy)
  }

  if (morning.length < 2 && afternoon.length < 2) return null

  const avg = (values: number[]) =>
    values.reduce((sum, value) => sum + value, 0) / values.length

  const morningAvg = morning.length > 0 ? avg(morning) : 0
  const afternoonAvg = afternoon.length > 0 ? avg(afternoon) : 0

  if (morning.length >= 2 && morningAvg >= afternoonAvg + 0.25) {
    return {
      id: 'energy-morning',
      icon: 'energy',
      title: 'You have more energy in the mornings',
      subtitle: `Seen in ${morning.length} check-in${morning.length === 1 ? '' : 's'}`,
    }
  }

  if (afternoon.length >= 2 && afternoonAvg > morningAvg + 0.25) {
    return {
      id: 'energy-afternoon',
      icon: 'energy',
      title: 'Afternoons tend to feel steadier',
      subtitle: `Seen in ${afternoon.length} check-in${afternoon.length === 1 ? '' : 's'}`,
    }
  }

  return null
}

function getCheckInDayHighlight(checkIns: WorkCheckIn[]): InsightHighlight | null {
  const dayCounts = new Map<number, number>()

  for (const checkIn of checkIns) {
    const day = new Date(`${checkIn.date}T12:00:00`).getDay()
    dayCounts.set(day, (dayCounts.get(day) ?? 0) + 1)
  }

  const top = [...dayCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (!top || top[1] < 2) return null

  const dayName = DAY_NAMES[top[0]]
  return {
    id: 'check-in-day',
    icon: 'pattern',
    title: `You check in more on ${dayName}s`,
    subtitle: 'Your pattern',
  }
}

export interface PrimaryInsight {
  kind: 'insight' | 'progress'
  sentence: string
  detail?: string
}

export interface ExploreInsightTile {
  id: QuickInsightIconKey
  title: string
  subtitle: string
  href: string
}

export const EXPLORE_INSIGHT_TILES: ExploreInsightTile[] = [
  { id: 'energy', title: 'Energy', subtitle: 'Highs and lows', href: '/weekly-insights' },
  { id: 'strategies', title: 'Strategies', subtitle: 'What helps most', href: '/strategies' },
  { id: 'drains', title: 'Drains', subtitle: 'What takes energy', href: '/weekly-insights' },
  { id: 'recovery', title: 'Recovery', subtitle: 'What helps you reset', href: '/weekly-insights' },
]

export function hasVeryLittleInsightData(
  checkIns: WorkCheckIn[],
  userState: UserStrategyState,
): boolean {
  return checkIns.length < 2 && userState.savedIds.length === 0
}

export function shouldShowWeeklyResetCard(
  weekCheckInCount: number,
  date = new Date(),
): boolean {
  const day = date.getDay()
  const isWeekendWindow = day === 0 || day === 1 || day === 5 || day === 6
  return weekCheckInCount >= 2 || isWeekendWindow
}

function formatSavedStrategyInsight(
  strategies: Strategy[],
  userState: UserStrategyState,
): string | null {
  const saved = strategies.filter((strategy) => userState.savedIds.includes(strategy.id))
  if (saved.length === 0) return null

  const topSaved = saved[saved.length - 1]
  return `${topSaved.title} is one of your most saved strategies.`
}

export function getPrimaryInsight(
  checkIns: WorkCheckIn[],
  strategies: Strategy[],
  userState: UserStrategyState,
): PrimaryInsight {
  const recent = checkIns.slice(0, 30)

  const energyHighlight = getEnergyTimeHighlight(recent)
  if (energyHighlight) {
    const sentence =
      energyHighlight.id === 'energy-morning'
        ? 'You tend to have more energy in the morning.'
        : 'You tend to feel steadier in the afternoon.'
    return { kind: 'insight', sentence, detail: energyHighlight.subtitle }
  }

  const drainCounts = new Map<string, number>()
  for (const checkIn of recent) {
    for (const drain of checkIn.drains ?? []) {
      const label = DRAIN_LABELS[drain] ?? drain
      drainCounts.set(label, (drainCounts.get(label) ?? 0) + 1)
    }
  }

  const topDrain = [...drainCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (topDrain) {
    const drainPhrase = topDrain[0].toLowerCase().includes('meeting')
      ? 'Meetings seem to drain you most.'
      : `${topDrain[0]} seems to drain you most.`
    return {
      kind: 'insight',
      sentence: drainPhrase,
      detail: `Seen in ${topDrain[1]} check-in${topDrain[1] === 1 ? '' : 's'}`,
    }
  }

  const highStressDays = recent.filter(
    (checkIn) => (getPulseFields(checkIn).stress ?? 0) >= 4,
  ).length
  if (highStressDays >= 2) {
    return {
      kind: 'insight',
      sentence: 'High-stress days seem to take the most out of you.',
      detail: `Seen in ${highStressDays} recent check-ins`,
    }
  }

  const savedInsight = formatSavedStrategyInsight(strategies, userState)
  if (savedInsight) {
    return { kind: 'insight', sentence: savedInsight }
  }

  const helpful = Object.entries(userState.usage)
    .filter(([, usage]) => (usage.timesMarkedHelpful ?? 0) > 0)
    .sort((a, b) => (b[1].timesMarkedHelpful ?? 0) - (a[1].timesMarkedHelpful ?? 0))
    .map(([id]) => strategies.find((strategy) => strategy.id === id)?.title)
    .filter(Boolean)[0]

  if (helpful) {
    return {
      kind: 'insight',
      sentence: `${helpful} is one of the strategies that has helped you most.`,
    }
  }

  const dayHighlight = getCheckInDayHighlight(recent)
  if (dayHighlight) {
    return {
      kind: 'insight',
      sentence: dayHighlight.title.replace(
        'You check in more on',
        'You check in more often on',
      ) + '.',
      detail: dayHighlight.subtitle,
    }
  }

  return {
    kind: 'progress',
    sentence: 'Your brain, in progress',
    detail: 'We\u2019re learning what helps you feel more balanced and in control.',
  }
}

const PLACEHOLDER_HIGHLIGHTS: InsightHighlight[] = [
  {
    id: 'placeholder-drain',
    icon: 'drain',
    title: 'Your biggest drains will show here',
    subtitle: 'After a few check-ins',
  },
  {
    id: 'placeholder-energy',
    icon: 'energy',
    title: 'Energy patterns emerge over time',
    subtitle: 'Morning vs afternoon',
  },
  {
    id: 'placeholder-strategy',
    icon: 'strategy',
    title: 'Saved strategies will appear here',
    subtitle: 'Save what helps',
  },
  {
    id: 'placeholder-pattern',
    icon: 'pattern',
    title: 'Weekly rhythms take shape slowly',
    subtitle: 'Your pattern',
  },
]

export function buildInsightHighlights(
  checkIns: WorkCheckIn[],
  strategies: Strategy[],
  userState: UserStrategyState,
): InsightHighlight[] {
  const recent = checkIns.slice(0, 30)
  const highlights: InsightHighlight[] = []

  const drainCounts = new Map<string, number>()
  for (const checkIn of recent) {
    for (const drain of checkIn.drains ?? []) {
      const label = DRAIN_LABELS[drain] ?? drain
      drainCounts.set(label, (drainCounts.get(label) ?? 0) + 1)
    }
  }

  const topDrain = [...drainCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  if (topDrain) {
    highlights.push({
      id: 'top-drain',
      icon: 'drain',
      title: shortenDrainLabel(topDrain[0]),
      subtitle: `Seen in ${topDrain[1]} check-in${topDrain[1] === 1 ? '' : 's'}`,
    })
  } else {
    const highStressDays = recent.filter(
      (checkIn) => (getPulseFields(checkIn).stress ?? 0) >= 4,
    ).length
    if (highStressDays >= 2) {
      highlights.push({
        id: 'stress-drain',
        icon: 'drain',
        title: 'High-stress days drain you most',
        subtitle: `Seen in ${highStressDays} check-in${highStressDays === 1 ? '' : 's'}`,
      })
    }
  }

  const energyHighlight = getEnergyTimeHighlight(recent)
  if (energyHighlight) highlights.push(energyHighlight)

  const saved = strategies.filter((s) => userState.savedIds.includes(s.id))
  if (saved.length > 0) {
    const titles = saved
      .slice(0, 2)
      .map((s) => s.title)
      .join(' & ')
    highlights.push({
      id: 'saved-strategies',
      icon: 'strategy',
      title: `${titles} help you most`,
      subtitle:
        saved.length === 1
          ? 'Saved once'
          : `Saved ${saved.length} time${saved.length === 1 ? '' : 's'}`,
    })
  } else {
    const helpful = Object.entries(userState.usage)
      .filter(([, usage]) => (usage.timesMarkedHelpful ?? 0) > 0)
      .sort((a, b) => (b[1].timesMarkedHelpful ?? 0) - (a[1].timesMarkedHelpful ?? 0))
      .slice(0, 2)
      .map(([id]) => strategies.find((s) => s.id === id)?.title)
      .filter(Boolean)

    if (helpful.length > 0) {
      highlights.push({
        id: 'helpful-strategies',
        icon: 'strategy',
        title: `${helpful.join(' & ')} help you most`,
        subtitle: 'Marked as helpful',
      })
    }
  }

  const dayHighlight = getCheckInDayHighlight(recent)
  if (dayHighlight) highlights.push(dayHighlight)

  if (highlights.length === 0) return PLACEHOLDER_HIGHLIGHTS

  const filled = [...highlights]
  for (const placeholder of PLACEHOLDER_HIGHLIGHTS) {
    if (filled.length >= 4) break
    if (!filled.some((item) => item.icon === placeholder.icon)) {
      filled.push(placeholder)
    }
  }

  return filled.slice(0, 4)
}

export function buildQuickInsights(
  checkIns: WorkCheckIn[],
  _strategies: Strategy[],
  userState: UserStrategyState,
): QuickInsightCard[] {
  const recent = checkIns.slice(0, 14)
  const hasData = recent.length > 0

  const savedCount = userState.savedIds.length
  const strategyDescription = savedCount
    ? `${savedCount} saved in your playbook`
    : 'Save strategies that feel useful'

  const drainCounts = new Map<string, number>()
  for (const checkIn of recent) {
    for (const drain of checkIn.drains ?? []) {
      drainCounts.set(drain, (drainCounts.get(drain) ?? 0) + 1)
    }
  }
  const topDrain = [...drainCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  const drainDescription = topDrain
    ? `${DRAIN_LABELS[topDrain[0]] ?? topDrain[0]} shows up often`
    : 'Patterns appear after check-ins'

  const refillCounts = new Map<string, number>()
  for (const checkIn of recent) {
    for (const refill of checkIn.refills ?? []) {
      refillCounts.set(refill, (refillCounts.get(refill) ?? 0) + 1)
    }
  }
  const topRefill = [...refillCounts.entries()].sort((a, b) => b[1] - a[1])[0]
  const recoveryDescription = topRefill
    ? `${REFILL_LABELS[topRefill[0]] ?? topRefill[0]} helps you recover`
    : 'What refills you will show here'

  return [
    {
      id: 'energy-trend',
      icon: 'energy',
      title: 'Energy trend',
      description: hasData ? 'Your highs & lows this week' : 'Check in to see your week',
      href: '/weekly-insights',
    },
    {
      id: 'top-strategies',
      icon: 'strategies',
      title: 'Top strategies',
      description: strategyDescription,
      href: '/strategies',
    },
    {
      id: 'biggest-drains',
      icon: 'drains',
      title: 'Biggest drains',
      description: drainDescription,
      href: '/insights#all-insights',
    },
    {
      id: 'recovery-patterns',
      icon: 'recovery',
      title: 'Recovery patterns',
      description: recoveryDescription,
      href: '/insights#all-insights',
    },
  ]
}
