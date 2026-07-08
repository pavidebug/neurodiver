import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  formatSessionDate,
  formatSessionDuration,
  formatSessionTime,
} from '@/lib/focus-session-format'
import type { FocusSession } from '@/types/body-doubling'
import { cn } from '@/lib/utils'

const GUIDELINES = [
  'Camera optional',
  'Stay muted unless speaking',
  "Respect everyone's focus",
  'Judgment-free space',
  'Leave anytime if needed',
]

interface ReservationModalProps {
  session: FocusSession | null
  open: boolean
  success: boolean
  pending: boolean
  error: string | null
  isGuest?: boolean
  signedInEmail?: string | null
  confirmedEmail?: string | null
  onClose: () => void
  onConfirm: (email: string) => void
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export function ReservationModal({
  session,
  open,
  success,
  pending,
  error,
  isGuest = false,
  signedInEmail,
  confirmedEmail,
  onClose,
  onConfirm,
}: ReservationModalProps) {
  const [guestEmail, setGuestEmail] = useState('')

  useEffect(() => {
    if (open && !success) {
      setGuestEmail('')
    }
  }, [open, success])

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape' && !pending) onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, pending, onClose])

  if (!open || !session) return null

  function handleConfirmClick() {
    const email = isGuest ? guestEmail.trim() : (signedInEmail?.trim() ?? '')
    if (!email) return
    onConfirm(email)
  }

  const canConfirm = isGuest
    ? isValidEmail(guestEmail)
    : Boolean(signedInEmail?.trim())

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center md:items-center md:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-text/35 backdrop-blur-sm"
        aria-label="Close reservation"
        disabled={pending}
        onClick={() => !pending && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-modal-title"
        className={cn(
          'popup-enter relative z-10 flex max-h-[min(92dvh,720px)] w-full flex-col overflow-hidden',
          'rounded-t-3xl bg-surface-solid shadow-2xl ring-1 ring-border',
          'md:max-w-lg md:rounded-3xl',
        )}
      >
        <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4">
          <h2
            id="reservation-modal-title"
            className="font-display text-xl font-semibold text-text"
          >
            {success ? "You're in!" : 'Reserve your spot'}
          </h2>
          {!pending && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0 rounded-xl"
              aria-label="Close"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          {success ? (
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-muted">
                <Check className="h-8 w-8 text-green" strokeWidth={2} aria-hidden="true" />
              </div>
              <p className="text-lg leading-relaxed text-text">
                Your spot is reserved!
                {confirmedEmail ? (
                  <>
                    {' '}
                    A confirmation email with a calendar invite is on its way to{' '}
                    <span className="font-medium">{confirmedEmail}</span>.
                  </>
                ) : (
                  <> We&apos;ll send your confirmation shortly.</>
                )}
              </p>
              <p className="text-sm text-text-muted">
                {formatSessionDate(session.startsAt)} at{' '}
                {formatSessionTime(session.startsAt)}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <dl className="space-y-3 rounded-2xl bg-green-muted/40 p-4 text-sm ring-1 ring-green/15">
                <div>
                  <dt className="text-text-muted">Session</dt>
                  <dd className="mt-1 font-medium text-text">{session.title}</dd>
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <div>
                    <dt className="text-text-muted">Date</dt>
                    <dd className="mt-0.5 font-medium text-text">
                      {formatSessionDate(session.startsAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Time</dt>
                    <dd className="mt-0.5 font-medium text-text">
                      {formatSessionTime(session.startsAt)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Duration</dt>
                    <dd className="mt-0.5 font-medium text-text">
                      {formatSessionDuration(session.durationMinutes)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-text-muted">Platform</dt>
                    <dd className="mt-0.5 font-medium text-text">{session.platform}</dd>
                  </div>
                </div>
              </dl>

              <section aria-labelledby="guidelines-heading">
                <h3
                  id="guidelines-heading"
                  className="mb-3 text-sm font-medium text-text"
                >
                  Community guidelines
                </h3>
                <ul className="space-y-2 text-sm leading-relaxed text-text-muted">
                  {GUIDELINES.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-green" aria-hidden="true">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {isGuest ? (
                <div className="space-y-2">
                  <label htmlFor="guest-email" className="text-sm font-medium text-text">
                    Email for your calendar invite
                  </label>
                  <Input
                    id="guest-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={guestEmail}
                    onChange={(event) => setGuestEmail(event.target.value)}
                  />
                  <p className="text-sm text-text-muted">
                    We&apos;ll send your confirmation and calendar invite here.
                  </p>
                </div>
              ) : signedInEmail ? (
                <div className="rounded-2xl border border-border bg-cream/50 px-4 py-3 text-sm">
                  <p className="font-medium text-text">Calendar invite</p>
                  <p className="mt-1 text-text-muted">
                    We&apos;ll email your confirmation to{' '}
                    <span className="font-medium text-text">{signedInEmail}</span>
                  </p>
                </div>
              ) : null}

              {error && (
                <p
                  className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
                  role="alert"
                >
                  {error}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0 border-t border-border px-5 py-4">
          {success ? (
            <Button type="button" className="w-full" size="lg" onClick={onClose}>
              You&apos;re in!
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full"
              size="lg"
              disabled={pending || !canConfirm}
              onClick={handleConfirmClick}
            >
              {pending ? 'Confirming…' : 'Confirm Reservation'}
            </Button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
