import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getTodayString, getWeekId } from '@/lib/dates'
import {
  getWorkCheckInErrorMessage,
  getWorkCheckInForDate,
  hasWorkCheckInForDate,
  subscribeToUserWorkProfile,
  subscribeToWorkCheckIns,
} from '@/lib/work-check-ins'
import { getMonthlyCheckInCount, submitDailyPulseCheckIn } from '@/lib/pulse-check-in'
import type { DailyPulseInput } from '@/types/pulse-check-in'
import type {
  UserWorkProfile,
  WorkCheckIn,
} from '@/types/work-energy'
import { DEFAULT_USER_WORK_PROFILE } from '@/types/work-energy'
import { useAuth } from '@/context/auth-context'
import { useTheme } from '@/context/theme-context'
import { applyAccessibilityPreferences } from '@/lib/onboarding'
import { ensureUserDocument } from '@/lib/user-document-service'

interface WorkEnergyContextValue {
  checkIns: WorkCheckIn[]
  profile: UserWorkProfile
  todayCheckIn: WorkCheckIn | null
  hasCheckedInToday: boolean
  currentWeekId: string
  loading: boolean
  submitting: boolean
  error: string | null
  monthlyCheckInCount: number
  submitPulseCheckIn: (input: DailyPulseInput) => Promise<WorkCheckIn>
  clearError: () => void
}

const WorkEnergyContext = createContext<WorkEnergyContextValue | null>(null)

export function WorkEnergyProvider({ children }: { children: ReactNode }) {
  const { user, isGuest } = useAuth()
  const { setPreference } = useTheme()
  const [checkIns, setCheckIns] = useState<WorkCheckIn[]>([])
  const [profile, setProfile] = useState<UserWorkProfile>(DEFAULT_USER_WORK_PROFILE)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = getTodayString()
  const todayCheckIn = useMemo(
    () => getWorkCheckInForDate(checkIns, today),
    [checkIns, today],
  )
  const hasCheckedInToday = hasWorkCheckInForDate(checkIns, today)
  const currentWeekId = getWeekId()
  const monthlyCheckInCount = useMemo(
    () => getMonthlyCheckInCount(checkIns),
    [checkIns],
  )

  useEffect(() => {
    if (!user) {
      setCheckIns([])
      setProfile(DEFAULT_USER_WORK_PROFILE)
      setLoading(false)
      return
    }

    setLoading(true)
    let checkInsReady = false
    let profileReady = false

    void ensureUserDocument(user).catch(() => {
      // Non-blocking — profile subscription still loads user data
    })

    function updateLoadingState() {
      if (checkInsReady && profileReady) {
        setLoading(false)
      }
    }

    const unsubscribeCheckIns = subscribeToWorkCheckIns(
      user.uid,
      (data) => {
        setCheckIns(data)
        checkInsReady = true
        updateLoadingState()
      },
      (subscriptionError) => {
        setError(getWorkCheckInErrorMessage(subscriptionError))
        checkInsReady = true
        updateLoadingState()
      },
    )

    const unsubscribeProfile = subscribeToUserWorkProfile(
      user.uid,
      (nextProfile) => {
        setProfile(nextProfile)
        profileReady = true
        updateLoadingState()
      },
      (subscriptionError) => {
        setError(getWorkCheckInErrorMessage(subscriptionError))
        profileReady = true
        updateLoadingState()
      },
    )

    return () => {
      unsubscribeCheckIns()
      unsubscribeProfile()
    }
  }, [user])

  useEffect(() => {
    if (!profile.onboardingCompleted) return
    applyAccessibilityPreferences(profile.accessibilityPreferences, setPreference)
  }, [profile.accessibilityPreferences, profile.onboardingCompleted, setPreference])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const submitPulseCheckIn = useCallback(
    async (input: DailyPulseInput) => {
      if (!user) {
        throw new Error('You must be signed in to complete a check-in.')
      }

      setSubmitting(true)
      setError(null)

      try {
        const result = await submitDailyPulseCheckIn(
          user.uid,
          input,
          { date: today, isGuest, organisationId: profile.organisationId },
        )
        setCheckIns((current) => {
          const withoutToday = current.filter((entry) => entry.date !== today)
          return [result, ...withoutToday].sort((a, b) => b.date.localeCompare(a.date))
        })
        return result
      } catch (submitError) {
        const message = getWorkCheckInErrorMessage(submitError)
        setError(message)
        throw submitError
      } finally {
        setSubmitting(false)
      }
    },
    [user, profile.organisationId, today, isGuest],
  )

  const value = useMemo<WorkEnergyContextValue>(
    () => ({
      checkIns,
      profile,
      todayCheckIn,
      hasCheckedInToday,
      currentWeekId,
      loading,
      submitting,
      error,
      monthlyCheckInCount,
      submitPulseCheckIn,
      clearError,
    }),
    [
      checkIns,
      profile,
      todayCheckIn,
      hasCheckedInToday,
      currentWeekId,
      loading,
      submitting,
      error,
      monthlyCheckInCount,
      submitPulseCheckIn,
      clearError,
    ],
  )

  return (
    <WorkEnergyContext.Provider value={value}>{children}</WorkEnergyContext.Provider>
  )
}

export function useWorkEnergy() {
  const context = useContext(WorkEnergyContext)
  if (!context) {
    throw new Error('useWorkEnergy must be used within WorkEnergyProvider')
  }
  return context
}

export { submitDailyPulseCheckIn } from '@/lib/pulse-check-in'
