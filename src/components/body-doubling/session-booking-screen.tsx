import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ReminderContactForm } from '@/components/body-doubling/reminder-contact-form'
import {
  formatSessionDate,
  formatSessionDuration,
  formatSessionTime,
} from '@/lib/focus-session-format'
import type { ContactProfileInput } from '@/lib/user-contact-profile'
import {
  isContactProfileValid,
  normalizeContactProfileInput,
} from '@/lib/user-contact-profile'
import type { FocusSession } from '@/types/body-doubling'

interface SessionBookingScreenProps {
  session: FocusSession
  contact: ContactProfileInput
  onContactChange: (contact: ContactProfileInput) => void
  pending: boolean
  error: string | null
  onReserve: (intention: string) => void
  onBack: () => void
}

export function SessionBookingScreen({
  session,
  contact,
  onContactChange,
  pending,
  error,
  onReserve,
  onBack,
}: SessionBookingScreenProps) {
  const [intention, setIntention] = useState('')
  const [localError, setLocalError] = useState<string | null>(null)

  const displayError = localError ?? error

  function handleReserveClick() {
    const normalized = normalizeContactProfileInput(contact)

    if (!isContactProfileValid(normalized)) {
      setLocalError(
        normalized.reminderPreference === 'whatsapp' || normalized.reminderPreference === 'both'
          ? 'Please add your contact details below before reserving.'
          : 'Please enter your email below before reserving.',
      )
      return
    }

    setLocalError(null)
    onReserve(intention)
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold text-text">
          Reserve your spot
        </h1>
        <p className="text-base text-text-muted">{session.title}</p>
      </header>

      <dl className="space-y-3 rounded-2xl border border-border bg-surface-solid p-5 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Date</dt>
          <dd className="text-right font-medium text-text">
            {formatSessionDate(session.startsAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Time</dt>
          <dd className="text-right font-medium text-text">
            {formatSessionTime(session.startsAt)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Duration</dt>
          <dd className="text-right font-medium text-text">
            {formatSessionDuration(session.durationMinutes)}
          </dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-text-muted">Platform</dt>
          <dd className="text-right font-medium text-text">{session.platform}</dd>
        </div>
      </dl>

      <Button
        type="button"
        className="w-full"
        disabled={pending}
        onClick={handleReserveClick}
      >
        {pending ? 'Reserving…' : 'Reserve My Spot'}
      </Button>

      <ReminderContactForm
        value={contact}
        onChange={(next) => {
          setLocalError(null)
          onContactChange(next)
        }}
        compact
        variant="booking"
      />

      <div className="space-y-3">
        <label htmlFor="session-intention" className="block text-base text-text">
          What is one thing you hope to complete during this session?
          <span className="mt-1 block text-sm font-normal text-text-muted">
            Optional — a short note is enough.
          </span>
        </label>
        <Textarea
          id="session-intention"
          value={intention}
          onChange={(event) => setIntention(event.target.value)}
          placeholder="e.g. Reply to three emails"
          className="min-h-24"
        />
      </div>

      {displayError && (
        <p className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
          {displayError}
        </p>
      )}

      <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
        Back
      </Button>
    </div>
  )
}
