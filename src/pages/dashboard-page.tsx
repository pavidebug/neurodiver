import { useEffect, useMemo, useState } from 'react'
import { TodayCheckInCard } from '@/components/dashboard/today-check-in-card'
import { TodayContinueCard } from '@/components/dashboard/today-continue-card'
import { TodayEncouragement } from '@/components/dashboard/today-encouragement'
import { TodayPrimaryActionCard } from '@/components/dashboard/today-primary-action-card'
import { WeeklyReviewCard } from '@/components/dashboard/weekly-review-card'
import { Stack } from '@/design-system/layout'
import { cardGap } from '@/design-system/tokens'
import { useStrategies } from '@/context/strategy-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { useAuth } from '@/context/auth-context'
import { useFeatureConfig } from '@/context/feature-config-context'
import {
  subscribeToActiveBookingCounts,
  subscribeToUpcomingSessions,
  subscribeToUserBookings,
} from '@/lib/focus-sessions'
import { getDisplayName } from '@/lib/onboarding'
import { getGreeting } from '@/lib/greeting'
import {
  getTinyEncouragement,
  getTodayContinueItem,
  getTodayPageConfig,
  getTodayPrimaryActions,
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
  const { isSectionEnabled } = useFeatureConfig()
  const showWelcome = isSectionEnabled('today', 'welcome')
  const showCheckIn = isSectionEnabled('today', 'checkIn')
  const showRecommendations = isSectionEnabled('today', 'recommendations')
  const showContinue = isSectionEnabled('today', 'continueCard')
  const showWeeklyReset = isSectionEnabled('today', 'weeklyReset')

  const [upcomingSessions, setUpcomingSessions] = useState<FocusSession[]>([])
  const [userBookings, setUserBookings] = useState<SessionBooking[]>([])
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({})

  const greetingName = getDisplayName(profile, user?.displayName ?? user?.email)
  const adaptive = getTodayPageConfig(todayCheckIn, hasCheckedInToday)
  const referenceCheckIn = hasCheckedInToday ? todayCheckIn : checkIns[0] ?? null

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

  const primaryActions = useMemo(
    () =>
      getTodayPrimaryActions(
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
      {showWelcome ? (
        <header className="px-1 pt-1">
          <h1 className="text-base font-medium text-text sm:text-lg">
            Good {getGreeting()}, {greetingName}
          </h1>
        </header>
      ) : null}

      {showCheckIn || showRecommendations ? <section className={showWelcome ? 'mt-4' : 'mt-0'} aria-labelledby="today-priority-heading">
        <div className="mb-3 px-1">
          <h2 id="today-priority-heading" className="font-display text-xl font-semibold text-text sm:text-2xl">
            {hasCheckedInToday ? 'Your day at a glance' : 'Start here'}
          </h2>
        </div>

        <div className={cn('grid grid-cols-1 xl:grid-cols-12 xl:items-stretch', cardGap)}>
          {showCheckIn ? <TodayCheckInCard
            loading={loading}
            hasCheckedInToday={hasCheckedInToday}
            checkIn={todayCheckIn}
            className={cn('xl:h-full', showRecommendations && hasCheckedInToday ? 'xl:col-span-5' : 'xl:col-span-12')}
          /> : null}

          {showRecommendations ? <TodayPrimaryActionCard
            actions={primaryActions}
            className={cn('xl:h-full', showCheckIn && hasCheckedInToday ? 'xl:col-span-7' : 'xl:col-span-12')}
          /> : null}
        </div>
      </section> : null}

      {showContinue || showWeeklyReset ? <section className="mt-7" aria-labelledby="next-up-heading">
        <div className="mb-3 px-1">
          <h2 id="next-up-heading" className="font-display text-xl font-semibold text-text sm:text-2xl">
            Weekly reset
          </h2>
        </div>

        <div className={cn('grid grid-cols-1 lg:grid-cols-2 lg:items-stretch', cardGap)}>
          {showContinue && continueItem ? <TodayContinueCard item={continueItem} className="h-full" /> : null}
          {showWeeklyReset ? <WeeklyReviewCard
            checkIns={checkIns}
            loading={loading}
            className={cn('h-full', !continueItem && 'lg:col-span-2')}
          /> : null}
        </div>
      </section> : null}

      {isSectionEnabled('today', 'encouragement') ? <TodayEncouragement message={encouragement} className="mt-8" /> : null}
    </Stack>
  )
}
