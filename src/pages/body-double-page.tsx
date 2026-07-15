import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BodyDoublingHome } from '@/components/body-doubling/body-doubling-home'
import { BookingConfirmation } from '@/components/body-doubling/booking-confirmation'
import { InviteFriendModal } from '@/components/body-doubling/invite-friend-modal'
import { ReservationModal } from '@/components/body-doubling/reservation-modal'
import { SessionReflection } from '@/components/body-doubling/session-reflection'
import { Button } from '@/components/ui/button'
import { Stack } from '@/design-system/layout'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import {
  createSessionBooking,
  getFocusSessionsErrorMessage,
  hasSessionFeedback,
  markBookingAttended,
  subscribeToActiveBookingCounts,
  subscribeToUpcomingSessions,
  subscribeToUserBookings,
  submitSessionFeedback,
} from '@/lib/focus-sessions'
import {
  buildContactProfileDefaults,
} from '@/lib/user-contact-profile'
import { updateUserContactProfile } from '@/lib/work-check-ins'
import type { FocusSession, SessionBooking } from '@/types/body-doubling'
import type { ContactProfileInput } from '@/lib/user-contact-profile'

type Screen = 'home' | 'confirmation' | 'reflection'

export function BodyDoublePage() {
  const { user, isGuest } = useAuth()
  const { profile } = useWorkEnergy()

  const [screen, setScreen] = useState<Screen>('home')
  const [sessions, setSessions] = useState<FocusSession[]>([])
  const [bookingCounts, setBookingCounts] = useState<Record<string, number>>({})
  const [userBookings, setUserBookings] = useState<SessionBooking[]>([])
  const [selectedSession, setSelectedSession] = useState<FocusSession | null>(null)
  const [activeBooking, setActiveBooking] = useState<SessionBooking | null>(null)
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [contact, setContact] = useState<ContactProfileInput>(() =>
    buildContactProfileDefaults(profile, user?.email),
  )

  const [inviteOpen, setInviteOpen] = useState(false)
  const [reservationOpen, setReservationOpen] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [confirmedEmail, setConfirmedEmail] = useState<string | null>(null)

  const [loading, setLoading] = useState(true)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reservationError, setReservationError] = useState<string | null>(null)

  useEffect(() => {
    setContact(buildContactProfileDefaults(profile, user?.email))
  }, [profile, user?.email])

  useEffect(() => {
    const unsubscribeCounts = subscribeToActiveBookingCounts(
      setBookingCounts,
      () => {},
    )

    return unsubscribeCounts
  }, [])

  useEffect(() => {
    setLoading(true)

    const unsubscribeSessions = subscribeToUpcomingSessions(
      (nextSessions) => {
        setSessions(nextSessions)
        setLoading(false)
      },
      (loadError) => {
        setError(loadError.message)
        setLoading(false)
      },
      bookingCounts,
      20,
    )

    return unsubscribeSessions
  }, [bookingCounts])

  useEffect(() => {
    if (!user) {
      setUserBookings([])
      return
    }

    const unsubscribeBookings = subscribeToUserBookings(
      user.uid,
      setUserBookings,
      (loadError) => {
        setError(getFocusSessionsErrorMessage(loadError))
      },
    )

    return unsubscribeBookings
  }, [user])

  const bookingsBySessionId = useMemo(() => {
    const map: Record<string, SessionBooking> = {}

    for (const booking of userBookings) {
      if (booking.attendanceStatus !== 'booked') continue
      map[booking.sessionId] = booking
    }

    return map
  }, [userBookings])

  const sessionById = useMemo(() => {
    const map = new Map(sessions.map((session) => [session.id, session]))
    return map
  }, [sessions])

  const closeReservationModal = useCallback(() => {
    setReservationOpen(false)
    setReservationSuccess(false)
    setSelectedSession(null)
    setReservationError(null)
  }, [])

  const backToHome = useCallback(() => {
    setScreen('home')
    setSelectedSession(null)
    setActiveBooking(null)
    setFeedbackSubmitted(false)
    setError(null)
  }, [])

  const handleReserve = useCallback(
    (session: FocusSession) => {
      if (!user) {
        setError('Sign in to reserve a spot.')
        return
      }

      setSelectedSession(session)
      setReservationSuccess(false)
      setReservationError(null)
      setReservationOpen(true)
    },
    [user],
  )

  const handleJoinFromHome = useCallback(
    async (session: FocusSession, booking: SessionBooking) => {
      setSelectedSession(session)
      setActiveBooking(booking)
      setError(null)

      if (user) {
        const submitted = await hasSessionFeedback(user.uid, booking.id)
        setFeedbackSubmitted(submitted)
      }

      setScreen('confirmation')
    },
    [user],
  )

  const handleConfirmReservation = useCallback(
    async (email: string) => {
      if (!user || !selectedSession) {
        setReservationError('Sign in to reserve a spot.')
        return
      }

      const normalizedEmail =
        email.trim() || user.email?.trim() || profile.email?.trim() || contact.email?.trim() || ''
      if (!normalizedEmail) {
        setReservationError('Enter your email so we can confirm your spot.')
        return
      }

      setReservationError(null)
      setPending(true)

      try {
        await updateUserContactProfile(
          user.uid,
          {
            ...buildContactProfileDefaults(profile, normalizedEmail),
            email: normalizedEmail,
            reminderEnabled: false,
            reminderPreference: 'email',
          },
          profile,
        )

        const booking = await createSessionBooking({
          userId: user.uid,
          sessionId: selectedSession.id,
          intention: null,
          contactEmail: normalizedEmail,
          reminderEnabled: false,
        })

        setContact((current) => ({ ...current, email: normalizedEmail }))
        setConfirmedEmail(normalizedEmail)
        setActiveBooking(booking)
        setFeedbackSubmitted(false)
        setUserBookings((current) => {
          if (current.some((entry) => entry.id === booking.id)) return current
          return [booking, ...current]
        })
        setReservationSuccess(true)
      } catch (bookingError) {
        setReservationError(getFocusSessionsErrorMessage(bookingError))
      } finally {
        setPending(false)
      }
    },
    [contact.email, profile, selectedSession, user],
  )

  const handleJoinSession = useCallback(() => {
    if (!activeBooking) return
    void markBookingAttended(activeBooking.id)
  }, [activeBooking])

  const handleOpenReflection = useCallback(() => {
    setScreen('reflection')
  }, [])

  const handleSubmitReflection = useCallback(
    async (input: {
      sessionHelpful: 'yes' | 'somewhat' | 'not-today'
      completedPlan: 'yes' | 'mostly' | 'not-today'
      wouldJoinAgain: number
      notes: string
    }) => {
      if (!user || !activeBooking || !selectedSession) {
        setError('Sign in to submit feedback.')
        return
      }

      setPending(true)
      setError(null)

      try {
        await submitSessionFeedback({
          userId: user.uid,
          sessionId: selectedSession.id,
          bookingId: activeBooking.id,
          sessionHelpful: input.sessionHelpful,
          completedPlan: input.completedPlan,
          wouldJoinAgain: input.wouldJoinAgain,
          notes: input.notes.trim() || null,
        })

        setFeedbackSubmitted(true)
        setScreen('confirmation')
      } catch (submitError) {
        setError(getFocusSessionsErrorMessage(submitError))
      } finally {
        setPending(false)
      }
    },
    [activeBooking, selectedSession, user],
  )

  const goBack = useCallback(() => {
    if (screen === 'confirmation' || screen === 'reflection') {
      if (screen === 'reflection') {
        setScreen('confirmation')
        setError(null)
        return
      }

      backToHome()
    }
  }, [backToHome, screen])

  const resolvedSession =
    selectedSession ??
    (activeBooking ? sessionById.get(activeBooking.sessionId) ?? null : null)

  if (screen === 'home') {
    return (
      <div className="page-enter w-full pb-4">
        <BodyDoublingHome
          sessions={sessions}
          bookingsBySessionId={bookingsBySessionId}
          loading={loading}
          error={error}
          isSignedIn={Boolean(user)}
          userId={user?.uid ?? null}
          defaultEmail={user?.email ?? profile.email ?? contact.email}
          isGuest={isGuest}
          onReserve={handleReserve}
          onJoin={(session, booking) => void handleJoinFromHome(session, booking)}
          onInviteFriend={() => setInviteOpen(true)}
        />

        <InviteFriendModal open={inviteOpen} onClose={() => setInviteOpen(false)} />

        <ReservationModal
          session={selectedSession}
          open={reservationOpen}
          success={reservationSuccess}
          pending={pending}
          error={reservationError}
          defaultEmail={user?.email ?? profile.email ?? contact.email}
          confirmedEmail={confirmedEmail}
          onClose={closeReservationModal}
          onConfirm={(email) => void handleConfirmReservation(email)}
        />
      </div>
    )
  }

  const screenTitle = screen === 'confirmation' ? 'Your booking' : 'Reflection'

  return (
    <Stack className="pb-4">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl"
          aria-label="Back"
          onClick={goBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="font-display text-xl font-semibold text-text">{screenTitle}</h1>
      </div>

      {screen === 'confirmation' && resolvedSession && activeBooking && (
        <BookingConfirmation
          session={resolvedSession}
          booking={activeBooking}
          contactEmail={confirmedEmail ?? contact.email ?? profile.email ?? user?.email}
          timezone={contact.timezone || profile.timezone}
          feedbackSubmitted={feedbackSubmitted}
          onJoin={handleJoinSession}
          onReflect={handleOpenReflection}
          onBack={backToHome}
        />
      )}

      {screen === 'reflection' && (
        <SessionReflection
          pending={pending}
          error={error}
          onSubmit={(input) => void handleSubmitReflection(input)}
          onBack={() => {
            setScreen('confirmation')
            setError(null)
          }}
        />
      )}
    </Stack>
  )
}
