import { useEffect, useMemo, useState } from 'react'
import { TodayCheckInCard } from '@/components/dashboard/today-check-in-card'
import { TodayContinueCard } from '@/components/dashboard/today-continue-card'
import { TodayEncouragement } from '@/components/dashboard/today-encouragement'
import { TodayGreeting } from '@/components/dashboard/today-greeting'
import { TodayPrimaryActionCard } from '@/components/dashboard/today-primary-action-card'
import { Stack } from '@/design-system/layout'
import { cardGap } from '@/design-system/tokens'
import { useStrategies } from '@/context/strategy-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { useAuth } from '@/context/auth-context'
import {
  subscribeToActiveBookingCounts,
  subscribeToUpcomingSessions,
  subscribeToUserBookings,
} from '@/lib/focus-sessions'
import { getDisplayName } from '@/lib/onboarding'
import {
  getGentleSentence,
  getTinyEncouragement,
  getTodayContinueItem,
  getTodayEnergyState,
  getTodayPageConfig,
  getTodayPrimaryAction,
} from '@/lib/today-page'
import type { FocusSession, SessionBooking } from '@/types/body-doubling'
import { cn } from '@/lib/utils'

export function DashboardPage() {
  const { user } = useAuth()
  const {
    hasCheckedInToday,
    todayCheckIn,
    profile,
    loading,
    checkIns,
    monthlyCheckInCount,
  } = useWorkEnergy()
  const { strategies, userState } = useStrategies()

  const [upcomingSessions, setUpcomingSessions] = useState<FocusSession[]>([])
  const [userBookings, setUserBookings] = useState<SessionBooking[]>([])
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({})

  const greetingName = getDisplayName(profile, user?.displayName ?? user?.email)
  const adaptive = getTodayPageConfig(todayCheckIn, hasCheckedInToday)
  const referenceCheckIn = hasCheckedInToday ? todayCheckIn : checkIns[0] ?? null
  const energyState = hasCheckedInToday ? getTodayEnergyState(todayCheckIn) : null

  useEffect(() => {
    const unsubscribeCounts = subscribeToActiveBookingCounts(setBookingCounts, () => {})
    return unsubscribeCounts
  }, [])

  useEffect(() => {
    const unsubscribeSessions = subscribeToUpcomingSessions(
      setUpcomingSessions,
      () => {},
      bookingCounts,
    )
    return unsubscribeSessions
  }, [bookingCounts])

  useEffect(() => {
    if (!user) {
      setUserBookings([])
      return
    }

    const unsubscribeBookings = subscribeToUserBookings(user.uid, setUserBookings, () => {})
    return unsubscribeBookings
  }, [user])

  const gentleSentence = getGentleSentence(
    hasCheckedInToday,
    adaptive.brainState,
    adaptive.simplifiedMessage,
  )

  const primaryAction = useMemo(
    () =>
      getTodayPrimaryAction(
        strategies,
        referenceCheckIn,
        hasCheckedInToday,
        userState,
        upcomingSessions[0] ?? null,
      ),
    [strategies, referenceCheckIn, hasCheckedInToday, userState, upcomingSessions],
  )

  const continueItem = useMemo(
    () =>
      getTodayContinueItem(strategies, userState, userBookings, upcomingSessions),
    [strategies, userState, userBookings, upcomingSessions],
  )

  const encouragement = useMemo(
    () => getTinyEncouragement(monthlyCheckInCount, checkIns, strategies, userState),
    [monthlyCheckInCount, checkIns, strategies, userState],
  )

  return (
    <Stack
      className={cn(
        'mx-auto w-full max-w-[44rem] pb-6 lg:pb-10 xl:max-w-[72rem]',
        adaptive.calmMode && 'calm-home',
      )}
      data-brain-state={adaptive.brainState}
    >
      <TodayGreeting name={greetingName} gentleSentence={gentleSentence} />

      <div
        className={cn(
          'mt-6 grid grid-cols-1 xl:grid-cols-12 xl:items-stretch',
          cardGap,
        )}
      >
        <TodayCheckInCard
          loading={loading}
          hasCheckedInToday={hasCheckedInToday}
          energyState={energyState}
          className="xl:col-span-5 xl:h-full"
        />

        <TodayPrimaryActionCard
          action={primaryAction}
          className={cn(
            'xl:col-span-7 xl:h-full',
            continueItem && 'xl:row-span-2',
          )}
        />

        {continueItem ? (
          <TodayContinueCard item={continueItem} className="xl:col-span-5 xl:h-full" />
        ) : null}

        <TodayEncouragement
          message={encouragement}
          className="xl:col-span-12 xl:mt-2"
        />
      </div>
    </Stack>
  )
}
