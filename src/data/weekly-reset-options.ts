import type { LucideIcon } from 'lucide-react'
import {
  Calendar,
  Cloud,
  CloudSun,
  Coffee,
  Compass,
  Leaf,
  Lightbulb,
  MessageCircle,
  Sunrise,
  Sun,
  Users,
  VolumeX,
} from 'lucide-react'
import type {
  NextWeekIntentionId,
  WeeklyResetChipId,
  WeeklySummaryId,
} from '@/types/weekly-reflection'

export interface WeeklySummaryOption {
  id: WeeklySummaryId
  label: string
  icon: LucideIcon
}

export interface WeeklyResetChipOption {
  id: WeeklyResetChipId
  label: string
}

export interface NextWeekIntentionOption {
  id: NextWeekIntentionId
  label: string
  icon: LucideIcon
}

export const WEEKLY_SUMMARY_OPTIONS: WeeklySummaryOption[] = [
  {
    id: 'more-good-than-difficult',
    label: 'I had more good moments than difficult ones.',
    icon: Sun,
  },
  {
    id: 'mix-of-ups-and-downs',
    label: 'It was a mix of ups and downs.',
    icon: CloudSun,
  },
  {
    id: 'mostly-heavy',
    label: 'Most days felt quite heavy.',
    icon: Cloud,
  },
  {
    id: 'learned-what-works',
    label: 'I learned a lot about what works for me.',
    icon: Lightbulb,
  },
  {
    id: 'still-making-sense',
    label: 'I’m still trying to make sense of this week.',
    icon: Compass,
  },
]

export const ENERGY_GIVER_OPTIONS: WeeklyResetChipOption[] = [
  { id: 'deep-work', label: 'Deep work' },
  { id: 'quiet-time', label: 'Quiet time' },
  { id: 'supportive-people', label: 'Supportive people' },
  { id: 'finishing-something', label: 'Finishing something' },
  { id: 'flexible-schedule', label: 'Flexible schedule' },
  { id: 'clear-priorities', label: 'Clear priorities' },
  { id: 'breaks', label: 'Breaks' },
  { id: 'movement', label: 'Movement' },
  { id: 'learning', label: 'Learning' },
  { id: 'something-else', label: 'Something else' },
]

export const ENERGY_DRAIN_OPTIONS: WeeklyResetChipOption[] = [
  { id: 'too-many-meetings', label: 'Too many meetings' },
  { id: 'interruptions', label: 'Interruptions' },
  { id: 'context-switching', label: 'Context switching' },
  { id: 'decision-making', label: 'Decision making' },
  { id: 'noise', label: 'Noise' },
  { id: 'social-interaction', label: 'Social interaction' },
  { id: 'time-pressure', label: 'Time pressure' },
  { id: 'unclear-expectations', label: 'Unclear expectations' },
  { id: 'unexpected-changes', label: 'Unexpected changes' },
  { id: 'workload', label: 'Workload' },
  { id: 'something-else', label: 'Something else' },
]

export const SUPPORT_NEED_OPTIONS: WeeklyResetChipOption[] = [
  { id: 'fewer-meetings', label: 'Fewer meetings' },
  { id: 'written-instructions', label: 'Written instructions' },
  { id: 'quiet-workspace', label: 'Quiet workspace' },
  { id: 'flexible-hours', label: 'Flexible hours' },
  { id: 'clear-priorities', label: 'Clear priorities' },
  { id: 'predictable-routine', label: 'Predictable routine' },
  { id: 'body-doubling', label: 'Body doubling' },
  { id: 'async-communication', label: 'Async communication' },
  { id: 'regular-breaks', label: 'Regular breaks' },
  { id: 'workload-adjustment', label: 'Workload adjustment' },
  { id: 'something-else', label: 'Something else' },
]

export const NEXT_WEEK_INTENTION_OPTIONS: NextWeekIntentionOption[] = [
  { id: 'protect-mornings', label: 'Protect my mornings', icon: Sunrise },
  { id: 'take-proper-breaks', label: 'Take proper breaks', icon: Coffee },
  { id: 'plan-week-earlier', label: 'Plan my week earlier', icon: Calendar },
  { id: 'reduce-distractions', label: 'Reduce distractions', icon: VolumeX },
  { id: 'ask-for-clarification', label: 'Ask for clarification sooner', icon: MessageCircle },
  { id: 'join-focus-together', label: 'Join a Focus Together session', icon: Users },
  { id: 'decide-later', label: 'I’ll decide later', icon: Leaf },
]

export function getWeeklySummaryLabel(id: WeeklySummaryId): string {
  return WEEKLY_SUMMARY_OPTIONS.find((option) => option.id === id)?.label ?? id
}

export function getNextWeekIntentionLabel(id: NextWeekIntentionId): string {
  return NEXT_WEEK_INTENTION_OPTIONS.find((option) => option.id === id)?.label ?? id
}

export function getChipLabels(
  ids: WeeklyResetChipId[],
  options: WeeklyResetChipOption[],
): string[] {
  return ids.map(
    (id) => options.find((option) => option.id === id)?.label ?? id,
  )
}

export const NEXT_WEEK_INTENTION_REMINDERS: Record<NextWeekIntentionId, string> = {
  'protect-mornings': 'Next week, you’re focusing on protecting your mornings.',
  'take-proper-breaks': 'Next week, you’re focusing on taking proper breaks.',
  'plan-week-earlier': 'Next week, you’re focusing on planning a little earlier.',
  'reduce-distractions': 'Next week, you’re focusing on reducing distractions.',
  'ask-for-clarification': 'Next week, you’re focusing on asking for clarification sooner.',
  'join-focus-together': 'Next week, you’re focusing on joining a Focus Together session.',
  'decide-later': 'You can choose your focus when the week begins — no pressure.',
}

export const WEEKLY_RESET_NOTE_MAX = 280
