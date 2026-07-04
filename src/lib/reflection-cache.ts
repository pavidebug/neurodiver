import type { CheckInResult } from '@/context/check-in-context'

const CACHE_KEY = 'neurodiver-pending-reflection'

interface CachedReflection extends CheckInResult {
  date: string
}

export function cacheReflectionResult(result: CheckInResult, date: string) {
  const payload: CachedReflection = { ...result, date }
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload))
}

export function readCachedReflectionResult(date: string): CheckInResult | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const cached = JSON.parse(raw) as CachedReflection
    if (cached.date !== date) return null

    return {
      brainStatus: cached.brainStatus,
      answers: cached.answers,
    }
  } catch {
    return null
  }
}

export function clearCachedReflectionResult() {
  sessionStorage.removeItem(CACHE_KEY)
}
