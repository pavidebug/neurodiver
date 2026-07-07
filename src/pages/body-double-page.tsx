import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { BodyDoublingHome } from '@/components/body-doubling/body-doubling-home'
import { BookingConfirmation } from '@/components/body-doubling/booking-confirmation'
import { ReservationModal } from '@/components/body-doubling/reservation-modal'
import { SessionReflection } from '@/components/body-doubling/session-reflection'
import { Button } from '@/components/ui/button'
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
  normalizeContactProfileInput,
  wantsEmailReminders,
} from '@/lib/user-contact-profile'
import { updateUserContactProfile } from '@/lib/work-check-ins'
import type { FocusSession, SessionBooking } from '@/types/body-doubling'
import type { ContactProfileInput } from '@/lib/user-contact-profile'

type Screen = 'home' | 'confirmation' | 'reflection'

export function BodyDoublePage() {
  const { user } = useAuth()
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
  const [savedContactEmail, setSavedContactEmail] = useState<string | null>(null)

  const [reservationOpen, setReservationOpen] = useState(false)
  const [reservationSuccess, setReservationSuccess] = useState(false)
  const [reservationNotifyBefore, setReservationNotifyBefore] = useState(true)

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
      () => {},
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
    async (notifyBefore: boolean) => {
      if (!user || !selectedSession) {
        setReservationError('Sign in to reserve a spot.')
        return
      }

      setReservationNotifyBefore(notifyBefore)
      setReservationError(null)

      const normalizedContact = normalizeContactProfileInput({
        ...buildContactProfileDefaults(profile, user.email),
        ...contact,
        email: contact.email || user.email || profile.email || '',
        reminderPreference: 'email',
        reminderEnabled: notifyBefore,
      })

      if (!normalizedContact.email) {
        setReservationError('Add an email address in your profile to receive your calendar invite.')
        return
      }

      setPending(true)

      try {
        await updateUserContactProfile(user.uid, normalizedContact, profile)

        const booking = await createSessionBooking({
          userId: user.uid,
          sessionId: selectedSession.id,
          intention: null,
          contactEmail: normalizedContact.email,
          reminderEnabled: notifyBefore,
        })

        setContact(normalizedContact)
        setSavedContactEmail(normalizedContact.email)
        setActiveBooking(booking)
        setFeedbackSubmitted(false)
        setReservationSuccess(true)
      } catch (bookingError) {
        setReservationError(getFocusSessionsErrorMessage(bookingError))
      } finally {
        setPending(false)
      }
    },
    [contact, profile, selectedSession, user],
  )

  const handleInviteFriend = useCallback(async () => {
    const shareText =
      'Join me for a quiet focus session on NeuroDiver — getting started is easier together.'
    const shareUrl = window.location.origin

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Focus Together on NeuroDiver',
          text: shareText,
          url: shareUrl,
        })
      } catch {
        // User cancelled share
      }
      return
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${shareUrl}`)
    } catch {
      // Clipboard unavailable
    }
  }, [])

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
      <div className="page-enter pb-4">
        <BodyDoublingHome
          sessions={sessions}
          bookingsBySessionId={bookingsBySessionId}
          loading={loading}
          error={error}
          isSignedIn={Boolean(user)}
          onReserve={handleReserve}
          onJoin={(session, booking) => void handleJoinFromHome(session, booking)}
          onInviteFriend={() => void handleInviteFriend()}
        />

        <ReservationModal
          session={selectedSession}
          open={reservationOpen}
          success={reservationSuccess}
          pending={pending}
          error={reservationError}
          contactEmail={savedContactEmail ?? contact.email ?? profile.email ?? user?.email}
          notifyBefore={reservationNotifyBefore}
          onClose={closeReservationModal}
          onConfirm={(notifyBefore) => void handleConfirmReservation(notifyBefore)}
        />
      </div>
    )
  }

  const screenTitle = screen === 'confirmation' ? 'Your booking' : 'Reflection'

  return (
    <div className="page-enter space-y-5 pb-4">
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
          contactEmail={savedContactEmail ?? contact.email ?? profile.email}
          timezone={contact.timezone || profile.timezone}
          emailRemindersEnabled={wantsEmailReminders(
            normalizeContactProfileInput(contact),
          )}
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
    </div>
  )
}
