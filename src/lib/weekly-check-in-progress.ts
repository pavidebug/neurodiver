import { getTodayString, getWeekStart } from '@/lib/dates'
import type { WorkCheckIn } from '@/types/work-energy'

export const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export function getWeekDayCheckIns(
  checkIns: WorkCheckIn[],
  weekStart = getWeekStart(),
): boolean[] {
  return WEEKDAY_LABELS.map((_, index) => {
    const day = new Date(weekStart)
    day.setDate(day.getDate() + index)
    const dateStr = getTodayString(day)
    return checkIns.some((checkIn) => checkIn.date === dateStr)
  })
}

export type WeeklyReviewReadiness = 'early' | 'building' | 'ready'

export function getWeeklyReviewReadiness(weekCheckInCount: number): WeeklyReviewReadiness {
  if (weekCheckInCount >= 5) return 'ready'
  if (weekCheckInCount >= 3) return 'building'
  return 'early'
}

export function getWeeklyReviewCopy(readiness: WeeklyReviewReadiness): {
  message: string
  cta: string
  secondary?: string
} {
  switch (readiness) {
    case 'ready':
      return {
        message: 'Your weekly reset is ready when you are.',
        cta: 'Start weekly reset',
      }
    case 'building':
      return {
        message: 'You’re starting to build a weekly pattern.',
        cta: 'Start weekly reset',
      }
    default:
      return {
        message: 'Weekly Reset works best after a few check-ins.',
        cta: 'Reset anyway',
        secondary: 'No pressure — you can reflect anytime.',
      }
  }
}
