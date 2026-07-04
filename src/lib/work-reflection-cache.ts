import type { WorkCheckIn } from '@/types/work-energy'

const CACHE_KEY = 'neurodiver-work-reflection'

interface CachedWorkReflection {
  date: string
  checkIn: WorkCheckIn
}

/** Strip Firestore Timestamp for reliable sessionStorage round-trip */
function toCachedCheckIn(checkIn: WorkCheckIn): WorkCheckIn {
  return {
    ...checkIn,
    createdAt: checkIn.createdAt,
  }
}

export function cacheWorkReflection(checkIn: WorkCheckIn, date: string) {
  const payload: CachedWorkReflection = {
    date,
    checkIn: toCachedCheckIn(checkIn),
  }
  sessionStorage.setItem(CACHE_KEY, JSON.stringify(payload))
}

export function readCachedWorkReflection(date: string): WorkCheckIn | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const cached = JSON.parse(raw) as CachedWorkReflection
    if (cached.date !== date) return null

    return cached.checkIn
  } catch {
    return null
  }
}

export function clearCachedWorkReflection() {
  sessionStorage.removeItem(CACHE_KEY)
}
