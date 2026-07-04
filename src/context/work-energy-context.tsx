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
  submitWorkCheckIn,
  subscribeToUserWorkProfile,
  subscribeToWorkCheckIns,
} from '@/lib/work-check-ins'
import type {
  UserWorkProfile,
  WorkCheckIn,
  WorkCheckInInput,
} from '@/types/work-energy'
import { DEFAULT_USER_WORK_PROFILE } from '@/types/work-energy'
import { useAuth } from '@/context/auth-context'

interface WorkEnergyContextValue {
  checkIns: WorkCheckIn[]
  profile: UserWorkProfile
  todayCheckIn: WorkCheckIn | null
  hasCheckedInToday: boolean
  currentWeekId: string
  loading: boolean
  submitting: boolean
  error: string | null
  submitCheckIn: (input: WorkCheckInInput) => Promise<WorkCheckIn>
  clearError: () => void
}

const WorkEnergyContext = createContext<WorkEnergyContextValue | null>(null)

export function WorkEnergyProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
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

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const submitCheckIn = useCallback(
    async (input: WorkCheckInInput) => {
      if (!user) {
        throw new Error('You must be signed in to complete a work check-in.')
      }

      setSubmitting(true)
      setError(null)

      try {
        const organisationId = input.organisationId ?? profile.organisationId
        const result = await submitWorkCheckIn(
          user.uid,
          { ...input, organisationId },
          today,
        )
        setCheckIns((current) => {
          const withoutToday = current.filter((entry) => entry.date !== today)
          return [result, ...withoutToday].sort((a, b) =>
            b.date.localeCompare(a.date),
          )
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
    [user, profile.organisationId, today],
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
      submitCheckIn,
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
      submitCheckIn,
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

export { submitWorkCheckIn } from '@/lib/work-check-ins'
