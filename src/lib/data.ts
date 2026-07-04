export interface CheckInQuestion {
  id: string
  question: string
  helper: string
  options: CheckInOption[]
}

export interface CheckInOption {
  value: number
  label: string
  description: string
}

export const CHECK_IN_QUESTIONS: CheckInQuestion[] = [
  {
    id: 'rest',
    question: 'How rested do you feel?',
    helper: 'Think about your sleep and how refreshed your body feels.',
    options: [
      { value: 1, label: 'Very low', description: 'Exhausted or drained' },
      { value: 2, label: 'Low', description: 'Running on empty' },
      { value: 3, label: 'Okay', description: 'Manageable, not great' },
      { value: 4, label: 'Good', description: 'Mostly refreshed' },
      { value: 5, label: 'Great', description: 'Well rested and ready' },
    ],
  },
  {
    id: 'focus',
    question: 'How focused is your mind right now?',
    helper: 'Notice whether thoughts feel scattered or steady.',
    options: [
      { value: 1, label: 'Very scattered', description: 'Hard to hold attention' },
      { value: 2, label: 'Scattered', description: 'Easily distracted' },
      { value: 3, label: 'Mixed', description: 'Some focus, some drift' },
      { value: 4, label: 'Focused', description: 'Can stay on task' },
      { value: 5, label: 'Sharp', description: 'Clear and engaged' },
    ],
  },
  {
    id: 'sensory',
    question: "How's your sensory environment?",
    helper: 'Consider noise, light, textures, and overall comfort.',
    options: [
      { value: 1, label: 'Overwhelming', description: 'Too much input' },
      { value: 2, label: 'Uncomfortable', description: 'Noticeably irritating' },
      { value: 3, label: 'Neutral', description: 'Tolerable but not ideal' },
      { value: 4, label: 'Comfortable', description: 'Mostly supportive' },
      { value: 5, label: 'Calm', description: 'Feels safe and regulated' },
    ],
  },
  {
    id: 'motivation',
    question: 'How motivated do you feel?',
    helper: 'Not pressure — just honest curiosity about your drive today.',
    options: [
      { value: 1, label: 'None', description: 'Starting feels impossible' },
      { value: 2, label: 'Low', description: 'Hard to get moving' },
      { value: 3, label: 'Moderate', description: 'Can start with effort' },
      { value: 4, label: 'Good', description: 'Ready to engage' },
      { value: 5, label: 'High', description: 'Eager to begin' },
    ],
  },
  {
    id: 'capacity',
    question: 'How manageable does today feel?',
    helper: 'Your sense of how much you can realistically handle.',
    options: [
      { value: 1, label: 'Too much', description: 'Everything feels heavy' },
      { value: 2, label: 'Heavy', description: 'More than I want' },
      { value: 3, label: 'Balanced', description: 'Doable with pacing' },
      { value: 4, label: 'Light', description: 'Feels within reach' },
      { value: 5, label: 'Open', description: 'Room to breathe and explore' },
    ],
  },
  {
    id: 'connection',
    question: 'How connected do you feel to others?',
    helper: 'Support, belonging, or gentle solitude — all are valid.',
    options: [
      { value: 1, label: 'Isolated', description: 'Feeling alone' },
      { value: 2, label: 'Distant', description: 'Disconnected from people' },
      { value: 3, label: 'Neutral', description: 'Fine on my own' },
      { value: 4, label: 'Supported', description: 'People are nearby' },
      { value: 5, label: 'Connected', description: 'Seen and supported' },
    ],
  },
]

export type BrainStatusType =
  | 'high-energy'
  | 'steady'
  | 'running-low'
  | 'recovery-needed'

export interface BrainStatus {
  type: BrainStatusType
  title: string
  description: string
  recommendations: string[]
  color: string
  bgColor: string
}

export function calculateBrainStatus(answers: Record<string, number>): BrainStatus {
  const values = Object.values(answers)
  const average =
    values.length > 0
      ? values.reduce((sum, value) => sum + value, 0) / values.length
      : 3

  if (average >= 4) {
    return {
      type: 'high-energy',
      title: 'High Energy',
      description:
        'Your brain has good capacity today. This is a great window for focused work — just remember to pace yourself.',
      recommendations: [
        'Tackle one meaningful task while your focus is strong.',
        'Set a gentle timer so you do not overextend.',
        'Schedule a short break before your energy dips.',
      ],
      color: 'text-green',
      bgColor: 'bg-green-muted',
    }
  }

  if (average >= 3) {
    return {
      type: 'steady',
      title: 'Steady',
      description:
        'You are in a balanced zone. Small, consistent steps will serve you well today.',
      recommendations: [
        'Pick one priority and break it into tiny steps.',
        'Use a body doubling session for gentle accountability.',
        'Keep your environment calm — reduce unnecessary tabs and noise.',
      ],
      color: 'text-green',
      bgColor: 'bg-yellow/40',
    }
  }

  if (average >= 2) {
    return {
      type: 'running-low',
      title: 'Running Low',
      description:
        'Your reserves are limited. Protecting your energy is the most productive thing you can do.',
      recommendations: [
        'Choose one small win instead of a full to-do list.',
        'Try a low-stimulation strategy from the Navigator.',
        'Eat, hydrate, or rest before pushing further.',
      ],
      color: 'text-orange',
      bgColor: 'bg-yellow/60',
    }
  }

  return {
    type: 'recovery-needed',
    title: 'Recovery Needed',
    description:
      'Your system is asking for care. Rest is not giving up — it is how you rebuild capacity.',
    recommendations: [
      'Cancel or defer non-essential tasks without guilt.',
      'Use sensory-friendly calming strategies.',
      'Consider joining a quiet body doubling session for gentle presence.',
    ],
    color: 'text-orange',
    bgColor: 'bg-orange/10',
  }
}

export interface Strategy {
  id: string
  title: string
  category: string
  description: string
  tip: string
}

export const STRATEGIES: Strategy[] = [
  {
    id: '1',
    title: 'Two-Minute Start',
    category: 'Task Initiation',
    description:
      'Commit to just two minutes of a task. Often, starting is the hardest part — and two minutes feels safe.',
    tip: 'Set a timer. When it rings, you can stop guilt-free.',
  },
  {
    id: '2',
    title: 'Body Doubling',
    category: 'Accountability',
    description:
      'Work alongside someone else, virtually or in person. Their presence helps anchor your focus.',
    tip: 'Browse sessions in the Body Double tab.',
  },
  {
    id: '3',
    title: 'Sensory Reset',
    category: 'Regulation',
    description:
      'Step away for 5 minutes. Adjust lighting, put on headphones, or change your physical position.',
    tip: 'Small environmental shifts can reset overwhelm quickly.',
  },
  {
    id: '4',
    title: 'Brain Dump',
    category: 'Clarity',
    description:
      'Write every thought onto paper without organizing. Externalizing reduces the mental load of holding it all.',
    tip: 'Do not edit — just release. Sort later if needed.',
  },
  {
    id: '5',
    title: 'Single-Tab Focus',
    category: 'Attention',
    description:
      'Close everything except one window. One task, one tab, one intention.',
    tip: 'Hide your dock or taskbar if visual clutter distracts you.',
  },
  {
    id: '6',
    title: 'Reward First',
    category: 'Motivation',
    description:
      'Pair a small pleasant activity with a task you are avoiding. The reward makes starting easier.',
    tip: 'Example: favorite tea while answering emails.',
  },
]

export interface BodyDoubleSession {
  id: string
  title: string
  host: string
  time: string
  duration: string
  spots: number
  totalSpots: number
  vibe: 'Quiet' | 'Chatty' | 'Focused'
  tags: string[]
}

export const BODY_DOUBLE_SESSIONS: BodyDoubleSession[] = [
  {
    id: '1',
    title: 'Morning Focus Hour',
    host: 'Alex M.',
    time: 'Today, 9:00 AM',
    duration: '60 min',
    spots: 3,
    totalSpots: 8,
    vibe: 'Quiet',
    tags: ['Deep work', 'Camera optional'],
  },
  {
    id: '2',
    title: 'Afternoon Admin Block',
    host: 'Jordan K.',
    time: 'Today, 2:00 PM',
    duration: '45 min',
    spots: 5,
    totalSpots: 10,
    vibe: 'Focused',
    tags: ['Emails', 'Paperwork'],
  },
  {
    id: '3',
    title: 'Gentle Co-Working',
    host: 'Sam R.',
    time: 'Today, 4:30 PM',
    duration: '30 min',
    spots: 2,
    totalSpots: 6,
    vibe: 'Chatty',
    tags: ['Low pressure', 'Check-ins welcome'],
  },
  {
    id: '4',
    title: 'Evening Wind-Down Work',
    host: 'Taylor P.',
    time: 'Today, 7:00 PM',
    duration: '45 min',
    spots: 6,
    totalSpots: 8,
    vibe: 'Quiet',
    tags: ['Low stimulation', 'Recovery friendly'],
  },
]

export interface EnergyEntry {
  date: string
  status: BrainStatusType
  average: number
}

export function getMockEnergyHistory(): EnergyEntry[] {
  const statuses: BrainStatusType[] = [
    'steady',
    'high-energy',
    'running-low',
    'steady',
    'steady',
    'recovery-needed',
    'steady',
  ]
  const today = new Date()

  return statuses.map((status, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (statuses.length - 1 - index))
    const averages: Record<BrainStatusType, number> = {
      'high-energy': 4.3,
      steady: 3.4,
      'running-low': 2.5,
      'recovery-needed': 1.6,
    }
    return {
      date: date.toISOString().split('T')[0],
      status,
      average: averages[status],
    }
  })
}

export function getStatusLabel(status: BrainStatusType): string {
  const labels: Record<BrainStatusType, string> = {
    'high-energy': 'High Energy',
    steady: 'Steady',
    'running-low': 'Running Low',
    'recovery-needed': 'Recovery Needed',
  }
  return labels[status]
}

export function getStatusColor(status: BrainStatusType): string {
  const colors: Record<BrainStatusType, string> = {
    'high-energy': 'bg-green',
    steady: 'bg-yellow',
    'running-low': 'bg-orange/70',
    'recovery-needed': 'bg-orange',
  }
  return colors[status]
}
