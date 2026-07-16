import { CalendarPlus, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { downloadSessionIcsFile } from '@/lib/focus-session-calendar'
import {
  formatSessionDate,
  formatSessionDuration,
  formatSessionTime,
  isSessionEnded,
} from '@/lib/focus-session-format'
import type { FocusSession, SessionBooking } from '@/types/body-doubling'

function isMeetingUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

interface BookingConfirmationProps {
  session: FocusSession
  booking: SessionBooking
  contactEmail: string | null
  timezone: string
  feedbackSubmitted: boolean
  onJoin: () => void
  onReflect: () => void
  onBack: () => void
}

export function BookingConfirmation({
  session,
  booking,
  contactEmail,
  timezone,
  feedbackSubmitted,
  onJoin,
  onReflect,
  onBack,
}: BookingConfirmationProps) {
  const ended = isSessionEnded(session)
  const hasMeetingUrl = isMeetingUrl(session.meetingLink)

  const handleJoinClick = () => {
    onJoin()
    if (hasMeetingUrl) {
      window.open(session.meetingLink, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2 text-center">
        <p className="text-sm font-medium text-green">You&apos;re booked!</p>
        <h1 className="font-display text-3xl font-semibold text-text">
          See you there
        </h1>
      </header>

      <dl className="space-y-4 rounded-2xl border border-green/20 bg-green-muted/40 p-5 text-sm">
        <div>
          <dt className="text-text-muted">Session date</dt>
          <dd className="mt-1 text-lg font-medium text-text">
            {formatSessionDate(session.startsAt)}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Session time</dt>
          <dd className="mt-1 text-lg font-medium text-text">
            {formatSessionTime(session.startsAt)}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Duration</dt>
          <dd className="mt-1 font-medium text-text">
            {formatSessionDuration(session.durationMinutes)}
          </dd>
        </div>
        <div>
          <dt className="text-text-muted">Platform</dt>
          <dd className="mt-1 font-medium text-text">{session.platform}</dd>
        </div>
        <div>
          <dt className="text-text-muted">Meeting information</dt>
          <dd className="mt-1 break-all font-medium text-text">
            {session.meetingLink || 'To be sent'}
          </dd>
        </div>
        {booking.intention && (
          <div>
            <dt className="text-text-muted">Your intention</dt>
            <dd className="mt-1 text-text">&ldquo;{booking.intention}&rdquo;</dd>
          </div>
        )}
      </dl>

      {contactEmail && (
        <p className="rounded-xl bg-surface-solid px-4 py-3 text-sm text-text-muted">
          We&apos;ll confirm your spot at {contactEmail}.
        </p>
      )}

      {hasMeetingUrl ? (
        <Button type="button" className="h-14 w-full text-lg" onClick={handleJoinClick}>
          <ExternalLink className="mr-2 h-5 w-5" aria-hidden="true" />
          Join Session
        </Button>
      ) : (
        <p className="rounded-xl border border-border bg-surface-solid px-4 py-3 text-center text-sm font-medium text-text-muted">
          The meeting link will be sent once it is confirmed.
        </p>
      )}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => downloadSessionIcsFile(session, booking, { timezone })}
      >
        <CalendarPlus className="mr-2 h-4 w-4" aria-hidden="true" />
        Add to calendar
      </Button>

      {ended && !feedbackSubmitted && (
        <Button type="button" variant="secondary" className="w-full" onClick={onReflect}>
          Share how it went
        </Button>
      )}

      {ended && feedbackSubmitted && (
        <p className="rounded-xl bg-green-muted/60 px-4 py-3 text-center text-sm text-green">
          Thanks for your feedback.
        </p>
      )}

      <p className="text-center text-xs text-text-muted">
        WhatsApp reminders coming soon.
      </p>

      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        Back to sessions
      </Button>
    </div>
  )
}
