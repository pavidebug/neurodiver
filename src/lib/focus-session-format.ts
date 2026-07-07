import type { FocusSession } from '@/types/body-doubling'

export function getSessionEnd(session: Pick<FocusSession, 'startsAt' | 'durationMinutes'>): Date {
  return new Date(session.startsAt.getTime() + session.durationMinutes * 60_000)
}

export function isSessionUpcoming(session: Pick<FocusSession, 'startsAt'>): boolean {
  return session.startsAt.getTime() > Date.now()
}

export function isSessionLive(session: Pick<FocusSession, 'startsAt' | 'durationMinutes'>): boolean {
  const now = Date.now()
  const start = session.startsAt.getTime()
  const end = getSessionEnd(session).getTime()
  return now >= start && now < end
}

export function isSessionEnded(session: Pick<FocusSession, 'startsAt' | 'durationMinutes'>): boolean {
  return Date.now() >= getSessionEnd(session).getTime()
}

export function formatSessionDate(startsAt: Date): string {
  return startsAt.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function formatSessionTime(startsAt: Date): string {
  return startsAt.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function formatSessionDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainder = minutes % 60
  if (remainder === 0) return `${hours} hr`
  return `${hours} hr ${remainder} min`
}

export function getRemainingSeats(session: FocusSession): number {
  return Math.max(0, session.capacity - session.bookedCount)
}

export interface CountdownParts {
  totalMs: number
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function getCountdownTo(target: Date, now = Date.now()): CountdownParts {
  const totalMs = Math.max(0, target.getTime() - now)
  const totalSeconds = Math.floor(totalMs / 1000)

  return {
    totalMs,
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

export function formatCountdown(parts: CountdownParts): string {
  if (parts.totalMs <= 0) return 'Starting now'

  if (parts.days > 0) {
    return `${parts.days}d ${parts.hours}h ${parts.minutes}m`
  }

  if (parts.hours > 0) {
    return `${parts.hours}h ${parts.minutes}m ${parts.seconds}s`
  }

  return `${parts.minutes}m ${parts.seconds}s`
}
