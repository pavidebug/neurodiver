import {
  Calendar,
  Clock,
  Monitor,
  Share2,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  formatSessionDate,
  formatSessionDuration,
  formatSessionTime,
  getRemainingSeats,
} from '@/lib/focus-session-format'
import type { FocusSession, SessionBooking } from '@/types/body-doubling'

/** Pilot community highlights — UI-only until aggregate analytics ship */
const COMMUNITY_HIGHLIGHTS = {
  sessionsCompleted: 128,
  helpfulPercent: 87,
}

interface BodyDoublingHomeProps {
  sessions: FocusSession[]
  bookingsBySessionId: Record<string, SessionBooking>
  loading: boolean
  error: string | null
  isSignedIn: boolean
  onReserve: (session: FocusSession) => void
  onJoin: (session: FocusSession, booking: SessionBooking) => void
  onInviteFriend: () => void
}

function averageFocusMinutes(sessions: FocusSession[]): number {
  if (sessions.length === 0) return 45
  const total = sessions.reduce((sum, session) => sum + session.durationMinutes, 0)
  return Math.round(total / sessions.length)
}

export function BodyDoublingHome({
  sessions,
  bookingsBySessionId,
  loading,
  error,
  isSignedIn,
  onReserve,
  onJoin,
  onInviteFriend,
}: BodyDoublingHomeProps) {
  if (loading) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <p className="text-sm text-text-muted">Loading sessions…</p>
      </div>
    )
  }

  const featured = sessions[0] ?? null
  const upcoming = sessions.slice(1)
  const avgFocus = averageFocusMinutes(sessions)

  return (
    <div className="space-y-8 pb-4">
      <header className="space-y-3">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          Focus Together
        </h1>
        <p className="text-base leading-relaxed text-text-muted">
          Sometimes getting started is easier when someone else is there.
          <br />
          Join a quiet focus session with others.
        </p>
      </header>

      {error && (
        <p className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
          {error}
        </p>
      )}

      {!isSignedIn && (
        <p className="rounded-xl bg-yellow/20 px-4 py-3 text-sm text-text-muted">
          Sign in to reserve a spot in a focus session.
        </p>
      )}

      {sessions.length === 0 ? (
        <div className="rounded-3xl border border-border bg-surface-solid px-5 py-12 text-center">
          <p className="text-base text-text-muted">
            No upcoming sessions right now. Check back soon.
          </p>
        </div>
      ) : (
        <>
          {featured && (
            <FeaturedSessionCard
              session={featured}
              booking={bookingsBySessionId[featured.id]}
              isSignedIn={isSignedIn}
              onReserve={() => onReserve(featured)}
              onJoin={(booking) => onJoin(featured, booking)}
            />
          )}

          {upcoming.length > 0 && (
            <section aria-labelledby="upcoming-heading" className="space-y-3">
              <h2
                id="upcoming-heading"
                className="text-sm font-medium uppercase tracking-widest text-text-muted"
              >
                Upcoming sessions
              </h2>
              <div className="space-y-3">
                {upcoming.map((session) => (
                  <UpcomingSessionCard
                    key={session.id}
                    session={session}
                    booking={bookingsBySessionId[session.id]}
                    isSignedIn={isSignedIn}
                    onReserve={() => onReserve(session)}
                    onJoin={(booking) => onJoin(session, booking)}
                  />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      <section
        aria-labelledby="community-heading"
        className="rounded-3xl bg-green-muted/40 p-5 ring-1 ring-green/15"
      >
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-green" aria-hidden="true" />
          <h2 id="community-heading" className="text-sm font-medium text-text">
            Our community
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <CommunityStat
            icon={Users}
            value={String(COMMUNITY_HIGHLIGHTS.sessionsCompleted)}
            label="Sessions completed"
          />
          <CommunityStat
            icon={TrendingUp}
            value={`${COMMUNITY_HIGHLIGHTS.helpfulPercent}%`}
            label="Found it helpful"
          />
          <CommunityStat
            icon={Timer}
            value={`${avgFocus} min`}
            label="Avg focus time"
          />
        </div>
      </section>

      <div className="text-center">
        <p className="mb-3 text-sm text-text-muted">
          Invite a friend to join your next session.
        </p>
        <Button type="button" variant="outline" className="gap-2" onClick={onInviteFriend}>
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Invite a friend
        </Button>
      </div>
    </div>
  )
}

function FeaturedSessionCard({
  session,
  booking,
  isSignedIn,
  onReserve,
  onJoin,
}: {
  session: FocusSession
  booking?: SessionBooking
  isSignedIn: boolean
  onReserve: () => void
  onJoin: (booking: SessionBooking) => void
}) {
  const seatsLeft = getRemainingSeats(session)
  const isFull = seatsLeft <= 0 && !booking

  return (
    <Card className="overflow-hidden border-green/25 bg-gradient-to-br from-green-muted/70 to-yellow/20 shadow-md">
      <CardContent className="space-y-5 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-green">
          Next session
        </p>
        <h2 className="font-display text-2xl font-semibold leading-snug text-text">
          {session.title}
        </h2>

        <div className="grid gap-2 text-sm text-text-muted sm:grid-cols-2">
          <SessionMeta icon={Calendar} label={formatSessionDate(session.startsAt)} />
          <SessionMeta icon={Clock} label={formatSessionTime(session.startsAt)} />
          <SessionMeta
            icon={Timer}
            label={formatSessionDuration(session.durationMinutes)}
          />
          <SessionMeta
            icon={Users}
            label={`${session.bookedCount} ${session.bookedCount === 1 ? 'participant' : 'participants'}`}
          />
          <SessionMeta icon={Monitor} label={session.platform} />
        </div>

        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={!isSignedIn || (isFull && !booking)}
          onClick={() => (booking ? onJoin(booking) : onReserve())}
        >
          {booking
            ? 'View My Reservation'
            : isFull
              ? 'Session full'
              : 'Reserve My Spot'}
        </Button>
      </CardContent>
    </Card>
  )
}

function UpcomingSessionCard({
  session,
  booking,
  isSignedIn,
  onReserve,
  onJoin,
}: {
  session: FocusSession
  booking?: SessionBooking
  isSignedIn: boolean
  onReserve: () => void
  onJoin: (booking: SessionBooking) => void
}) {
  const seatsLeft = getRemainingSeats(session)
  const isFull = seatsLeft <= 0 && !booking

  return (
    <Card className="border-border/80">
      <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 space-y-1">
          <p className="font-medium text-text">{session.title}</p>
          <p className="text-sm text-text-muted">
            {formatSessionDate(session.startsAt)} · {formatSessionTime(session.startsAt)} ·{' '}
            {formatSessionDuration(session.durationMinutes)}
          </p>
          <p className="text-xs text-text-muted">
            {session.bookedCount} joined · {session.platform}
          </p>
        </div>
        <Button
          type="button"
          variant={booking ? 'outline' : 'secondary'}
          className="shrink-0"
          disabled={!isSignedIn || (isFull && !booking)}
          onClick={() => (booking ? onJoin(booking) : onReserve())}
        >
          {booking ? 'View' : isFull ? 'Full' : 'Reserve'}
        </Button>
      </CardContent>
    </Card>
  )
}

function SessionMeta({
  icon: Icon,
  label,
}: {
  icon: typeof Calendar
  label: string
}) {
  return (
    <span className="flex items-center gap-2 text-text">
      <Icon className="h-4 w-4 shrink-0 text-green" aria-hidden="true" />
      {label}
    </span>
  )
}

function CommunityStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl bg-surface-solid/70 px-2 py-3">
      <Icon className="mx-auto mb-1 h-4 w-4 text-green" aria-hidden="true" />
      <p className="font-display text-lg font-semibold text-text">{value}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-text-muted">{label}</p>
    </div>
  )
}
