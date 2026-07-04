import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  calculateStreak,
  getBrainStatusForDate,
  getFirestoreErrorMessage,
  mapCheckInsToEnergyHistory,
  saveDailyIntention,
  submitDailyCheckIn,
  subscribeToUserCheckIns,
  type UserCheckInDocument,
} from '@/lib/check-ins'
import { Timestamp } from 'firebase/firestore'
import { getTodayString } from '@/lib/dates'
import {
  cacheReflectionResult,
  clearCachedReflectionResult,
} from '@/lib/reflection-cache'
import {
  type BrainStatus,
  type EnergyEntry,
} from '@/lib/data'
import { useAuth } from '@/context/auth-context'

export interface CheckInResult {
  brainStatus: BrainStatus
  answers: Record<string, number>
}

interface CheckInContextValue {
  answers: Record<string, number>
  todayAnswers: Record<string, number> | null
  brainStatus: BrainStatus | null
  energyHistory: EnergyEntry[]
  hasCheckedInToday: boolean
  lastCheckInDate: string | null
  todayIntention: string
  loading: boolean
  submitting: boolean
  savingIntention: boolean
  error: string | null
  setAnswer: (questionId: string, value: number) => void
  resetCheckIn: () => void
  completeCheckIn: () => Promise<CheckInResult>
  saveTodayIntention: (intention: string) => Promise<void>
  getStreak: () => number
  clearError: () => void
}

const CheckInContext = createContext<CheckInContextValue | null>(null)

const emptyDocument: UserCheckInDocument = {
  lastCheckIn: null,
  checkIns: {},
}

export function CheckInProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [document, setDocument] = useState<UserCheckInDocument>(emptyDocument)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [savingIntention, setSavingIntention] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingResult, setPendingResult] = useState<CheckInResult | null>(null)

  const today = getTodayString()
  const energyHistory = useMemo(
    () => mapCheckInsToEnergyHistory(document.checkIns),
    [document.checkIns],
  )
  const hasCheckedInToday = Boolean(document.checkIns[today] ?? pendingResult)
  const brainStatus = useMemo(() => {
    return (
      getBrainStatusForDate(document.checkIns, today) ??
      pendingResult?.brainStatus ??
      null
    )
  }, [document.checkIns, today, pendingResult])
  const todayAnswers = useMemo(() => {
    return document.checkIns[today]?.answers ?? pendingResult?.answers ?? null
  }, [document.checkIns, today, pendingResult])
  const todayIntention = document.checkIns[today]?.intention ?? ''

  useEffect(() => {
    if (!user) {
      setDocument(emptyDocument)
      setAnswers({})
      setLoading(false)
      return
    }

    setLoading(true)

    const unsubscribe = subscribeToUserCheckIns(
      user.uid,
      (data) => {
        setDocument((prev) => {
          const localTodayCheckIn = prev.checkIns[today]
          const remoteHasToday = Boolean(data.checkIns[today])

          if (localTodayCheckIn && !remoteHasToday) {
            return {
              ...data,
              lastCheckIn: data.lastCheckIn ?? today,
              checkIns: {
                ...data.checkIns,
                [today]: localTodayCheckIn,
              },
            }
          }

          return data
        })

        if (data.checkIns[today]) {
          setPendingResult(null)
          clearCachedReflectionResult()
        }

        setLoading(false)
      },
      (subscriptionError) => {
        setError(getFirestoreErrorMessage(subscriptionError))
        setLoading(false)
      },
    )

    return unsubscribe
  }, [user])

  const setAnswer = useCallback((questionId: string, value: number) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: value,
    }))
  }, [])

  const resetCheckIn = useCallback(() => {
    setAnswers({})
    setError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const completeCheckIn = useCallback(async (): Promise<CheckInResult> => {
    if (!user) {
      throw new Error('You must be signed in to complete a check-in.')
    }

    const existingCheckIn = document.checkIns[today]
    if (existingCheckIn) {
      const existing = getBrainStatusForDate(document.checkIns, today)
      if (existing) {
        return { brainStatus: existing, answers: existingCheckIn.answers }
      }
    }

    setSubmitting(true)
    setError(null)

    const submittedAnswers = { ...answers }

    try {
      const result = await submitDailyCheckIn(user.uid, submittedAnswers, today)

      setDocument((prev) => ({
        ...prev,
        lastCheckIn: today,
        checkIns: {
          ...prev.checkIns,
          [today]: {
            answers: submittedAnswers,
            status: result.brainStatus.type,
            average: result.entry.average,
            completedAt: Timestamp.now(),
          },
        },
      }))

      const completed: CheckInResult = {
        brainStatus: result.brainStatus,
        answers: submittedAnswers,
      }
      setPendingResult(completed)
      cacheReflectionResult(completed, today)
      setAnswers({})

      return completed
    } catch (submitError) {
      const message =
        submitError instanceof Error
          ? submitError.message
          : getFirestoreErrorMessage(submitError)
      setError(message)
      throw submitError
    } finally {
      setSubmitting(false)
    }
  }, [user, document.checkIns, answers, today])

  const saveTodayIntention = useCallback(
    async (intention: string) => {
      if (!user) {
        throw new Error('You must be signed in to save your intention.')
      }

      setSavingIntention(true)
      setError(null)

      try {
        await saveDailyIntention(user.uid, intention, today)
      } catch (saveError) {
        const message =
          saveError instanceof Error
            ? saveError.message
            : getFirestoreErrorMessage(saveError)
        setError(message)
        throw saveError
      } finally {
        setSavingIntention(false)
      }
    },
    [user, today],
  )

  const getStreak = useCallback(() => {
    return calculateStreak(energyHistory, today)
  }, [energyHistory, today])

  const value = useMemo<CheckInContextValue>(
    () => ({
      answers,
      todayAnswers,
      brainStatus,
      energyHistory,
      hasCheckedInToday,
      lastCheckInDate: document.lastCheckIn,
      todayIntention,
      loading,
      submitting,
      savingIntention,
      error,
      setAnswer,
      resetCheckIn,
      completeCheckIn,
      saveTodayIntention,
      getStreak,
      clearError,
    }),
    [
      answers,
      todayAnswers,
      brainStatus,
      energyHistory,
      hasCheckedInToday,
      document.lastCheckIn,
      todayIntention,
      loading,
      submitting,
      savingIntention,
      error,
      setAnswer,
      resetCheckIn,
      completeCheckIn,
      saveTodayIntention,
      getStreak,
      clearError,
    ],
  )

  return (
    <CheckInContext.Provider value={value}>{children}</CheckInContext.Provider>
  )
}

export function useCheckIn() {
  const context = useContext(CheckInContext)
  if (!context) {
    throw new Error('useCheckIn must be used within CheckInProvider')
  }
  return context
}

// Re-export for pages that need direct Firestore access without React state.
export { submitDailyCheckIn } from '@/lib/check-ins'
