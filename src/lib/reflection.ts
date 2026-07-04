import type { BrainStatus, BrainStatusType } from '@/lib/data'

export interface DailyQuote {
  id: string
  text: string
}

export const DAILY_QUOTES: DailyQuote[] = [
  { id: '1', text: 'Progress is built one small step at a time.' },
  { id: '2', text: 'Rest is part of productivity.' },
  { id: '3', text: 'Your pace is still progress.' },
  { id: '4', text: "Working differently doesn't mean working less." },
  { id: '5', text: 'Showing up today already counts.' },
  { id: '6', text: 'You do not have to earn your rest.' },
  { id: '7', text: 'Small steps still move you forward.' },
  { id: '8', text: 'Your brain is allowed to work its own way.' },
  { id: '9', text: 'Gentleness is a valid strategy.' },
  { id: '10', text: 'One calm choice can change the whole day.' },
  { id: '11', text: 'You are building awareness, not perfection.' },
  { id: '12', text: 'Energy comes and goes — both are okay.' },
]

export interface StatusPresentation {
  emoji: string
  label: string
  accentClass: string
  bgClass: string
  ringClass: string
}

export interface ReflectionRecommendation {
  title: string
  description: string
  href: string
}

export interface DailyReflectionContent {
  status: StatusPresentation
  summary: string
  energySnapshot: EnergySnapshotItem[]
  recommendation: ReflectionRecommendation
  quote: string
}

export interface EnergySnapshotItem {
  id: string
  label: string
  value: number
  colorClass: string
}

const ENERGY_SNAPSHOT_MAP: Array<{
  id: string
  answerKey: string
  label: string
  colorClass: string
  invert?: boolean
}> = [
  { id: 'sleep', answerKey: 'rest', label: 'Sleep', colorClass: 'bg-green' },
  { id: 'focus', answerKey: 'focus', label: 'Focus', colorClass: 'bg-green' },
  {
    id: 'overwhelm',
    answerKey: 'sensory',
    label: 'Overwhelm',
    colorClass: 'bg-orange',
    invert: true,
  },
  {
    id: 'motivation',
    answerKey: 'motivation',
    label: 'Motivation',
    colorClass: 'bg-yellow',
  },
] 

const STATUS_PRESENTATION: Record<BrainStatusType, StatusPresentation> = {
  'high-energy': {
    emoji: '🟢',
    label: 'High Energy',
    accentClass: 'text-green',
    bgClass: 'bg-green-muted',
    ringClass: 'ring-green/20',
  },
  steady: {
    emoji: '🟡',
    label: 'Steady',
    accentClass: 'text-green',
    bgClass: 'bg-yellow/40',
    ringClass: 'ring-yellow/40',
  },
  'running-low': {
    emoji: '🟠',
    label: 'Running Low',
    accentClass: 'text-orange',
    bgClass: 'bg-yellow/60',
    ringClass: 'ring-orange/20',
  },
  'recovery-needed': {
    emoji: '🔴',
    label: 'Recovery Needed',
    accentClass: 'text-orange',
    bgClass: 'bg-orange/10',
    ringClass: 'ring-orange/30',
  },
}

const DIMENSION_LABELS: Record<string, string> = {
  rest: 'rest',
  focus: 'focus',
  sensory: 'sensory comfort',
  motivation: 'motivation',
  capacity: 'capacity',
  connection: 'sense of connection',
}

function averageScore(answers: Record<string, number>): number {
  const values = Object.values(answers)
  if (values.length === 0) return 3
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function lowestDimension(
  answers: Record<string, number>,
): { key: string; value: number } | null {
  const entries = Object.entries(answers)
  if (entries.length === 0) return null

  const [key, value] = entries.reduce(([lowKey, lowVal], [key, val]) =>
    val < lowVal ? [key, val] : [lowKey, lowVal],
  )

  return { key, value }
}

function hashDate(date: string): number {
  let hash = 0
  for (let i = 0; i < date.length; i++) {
    hash = (hash << 5) - hash + date.charCodeAt(i)
    hash |= 0
  }
  return Math.abs(hash)
}

export function getDailyQuote(date: string): string {
  const index = hashDate(date) % DAILY_QUOTES.length
  return DAILY_QUOTES[index].text
}

export function getStatusPresentation(type: BrainStatusType): StatusPresentation {
  return STATUS_PRESENTATION[type]
}

function buildRecommendation(type: BrainStatusType): ReflectionRecommendation {
  switch (type) {
    case 'high-energy':
      return {
        title: 'Start with a Focus Strategy',
        description:
          'Your energy is on your side today. Pick one strategy and channel it into a meaningful task.',
        href: '/strategies',
      }
    case 'steady':
      return {
        title: 'Break work into smaller steps',
        description:
          'Keep momentum gentle and steady. One small step at a time is enough for today.',
        href: '/strategies',
      }
    case 'running-low':
      return {
        title: 'Book a Body Doubling session',
        description:
          'Gentle accountability can make starting easier when your energy is limited.',
        href: '/body-double',
      }
    case 'recovery-needed':
      return {
        title: 'Protect your energy today',
        description:
          'Keep tasks small, reduce stimulation, and give yourself permission to rest.',
        href: '/strategies',
      }
  }
}

export function buildEnergySnapshot(
  answers: Record<string, number>,
): EnergySnapshotItem[] {
  return ENERGY_SNAPSHOT_MAP.map(({ id, answerKey, label, colorClass, invert }) => {
    const raw = answers[answerKey] ?? 3
    const value = invert ? Math.max(1, Math.min(5, 6 - raw)) : raw

    return { id, label, value, colorClass }
  })
}

function buildPersonalizedSummary(
  answers: Record<string, number>,
  brainStatus: BrainStatus,
): string {
  const average = averageScore(answers)
  const lowest = lowestDimension(answers)
  const lowestLabel = lowest ? DIMENSION_LABELS[lowest.key] : null

  if (brainStatus.type === 'high-energy') {
    if (average >= 4.2) {
      return 'You seem to have enough energy for focused work today. Consider tackling your highest-priority task first.'
    }
    return 'You have solid energy today. Choose one meaningful task and give it your attention while it lasts.'
  }

  if (brainStatus.type === 'steady') {
    if (lowest && lowest.value <= 2 && lowestLabel) {
      return `You're in a balanced zone, though your ${lowestLabel} could use a little care. Steady progress beats pushing too hard.`
    }
    return 'You are in a workable middle ground today. Small, intentional steps will carry you further than rushing.'
  }

  if (brainStatus.type === 'running-low') {
    if (lowestLabel === 'focus' || lowestLabel === 'capacity') {
      return 'Today looks mentally demanding. Focus on smaller wins and give yourself permission to slow down.'
    }
    return 'Your reserves are running low today. Protect what energy you have and celebrate completing even one small thing.'
  }

  if (lowestLabel === 'rest') {
    return 'Your body and mind are asking for recovery. Rest is not falling behind — it is how you rebuild capacity.'
  }

  return 'Today is a day for gentleness. Lower the bar, reduce stimulation, and let recovery be the priority.'
}

export function buildDailyReflection(
  answers: Record<string, number>,
  brainStatus: BrainStatus,
  date: string,
): DailyReflectionContent {
  return {
    status: getStatusPresentation(brainStatus.type),
    summary: buildPersonalizedSummary(answers, brainStatus),
    energySnapshot: buildEnergySnapshot(answers),
    recommendation: buildRecommendation(brainStatus.type),
    quote: getDailyQuote(date),
  }
}
