import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck2, Compass, Sparkles } from 'lucide-react'
import { TodayCheckInCard } from '@/components/dashboard/today-check-in-card'
import { TodayContinueCard } from '@/components/dashboard/today-continue-card'
import { TodayEncouragement } from '@/components/dashboard/today-encouragement'
import { TodayGreeting } from '@/components/dashboard/today-greeting'
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
import {
  getGentleSentence,
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

  const gentleSentence = getGentleSentence(
    hasCheckedInToday,
    adaptive.brainState,
    adaptive.simplifiedMessage,
  )

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
      {showWelcome ? <section className="relative overflow-hidden rounded-[2rem] border border-green/10 bg-gradient-to-br from-green-muted/80 via-white/80 to-yellow/30 px-5 py-7 shadow-[0_18px_50px_rgba(45,90,61,0.08)] sm:px-8 sm:py-9 xl:px-10">
        <div className="pointer-events-none absolute -right-12 -top-14 h-40 w-40 rounded-full bg-sage/20 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-32 w-48 rounded-full bg-yellow/25 blur-2xl" />
        <div className="relative">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-green ring-1 ring-green/10">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Your space for today
          </div>
          <TodayGreeting name={greetingName} gentleSentence={gentleSentence} />
        </div>
      </section> : null}

      {showCheckIn || showRecommendations ? <section className="mt-8" aria-labelledby="today-priority-heading">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-green text-white shadow-sm">
            <Compass className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="today-priority-heading" className="font-display text-2xl font-semibold text-text">
              {hasCheckedInToday ? 'Your day at a glance' : 'Start here'}
            </h2>
            <p className="text-sm text-text-muted">
              {hasCheckedInToday
                ? 'Your check-in and the most relevant supports for right now.'
                : 'A quick check-in helps us tailor what you see next.'}
            </p>
          </div>
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

      {showContinue || showWeeklyReset ? <section className="mt-9" aria-labelledby="next-up-heading">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lavender-muted text-lavender-deep ring-1 ring-lavender/20">
            <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 id="next-up-heading" className="font-display text-2xl font-semibold text-text">
              Keep your momentum
            </h2>
            <p className="text-sm text-text-muted">Pick up something useful, only when you have capacity.</p>
          </div>
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
