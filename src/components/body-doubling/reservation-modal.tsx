import { createPortal } from 'react-dom'
import { useEffect, useState } from 'react'
import { Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  formatSessionDate,
  formatSessionTime,
} from '@/lib/focus-session-format'
import type { FocusSession } from '@/types/body-doubling'
import { cn } from '@/lib/utils'

interface ReservationModalProps {
  session: FocusSession | null
  open: boolean
  success: boolean
  pending: boolean
  error: string | null
  defaultEmail?: string | null
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
  defaultEmail,
  confirmedEmail,
  onClose,
  onConfirm,
}: ReservationModalProps) {
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (open && !success) {
      setEmail(defaultEmail?.trim() ?? '')
    }
  }, [defaultEmail, open, success])

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

  const canConfirm = isValidEmail(email)

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#1F2A24]/30 backdrop-blur-[2px]"
        aria-label="Close reservation"
        disabled={pending}
        onClick={() => !pending && onClose()}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reservation-modal-title"
        className={cn(
          'popup-enter relative z-10 w-full max-w-[390px] max-h-[min(90dvh,640px)] overflow-y-auto rounded-[1.5rem]',
          'bg-white shadow-[0_12px_40px_rgba(47,93,80,0.15)]',
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <h2
            id="reservation-modal-title"
            className="font-display text-xl font-semibold text-[#1F2A24]"
          >
            {success ? "You're in!" : 'Reserve your spot'}
          </h2>
          {!pending && (
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6B6B63] transition-colors hover:bg-[#F9F7F2]"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <div className="px-5 py-4">
          {success ? (
            <div className="space-y-4 pb-2 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F0EB]">
                <Check className="h-7 w-7 text-[#2F5D50]" strokeWidth={2} aria-hidden="true" />
              </div>
              <p className="text-sm leading-relaxed text-[#1F2A24]">
                Your spot is saved
                {confirmedEmail ? (
                  <>
                    . We&apos;ll reach out at{' '}
                    <span className="font-medium">{confirmedEmail}</span>.
                  </>
                ) : (
                  '.'
                )}
              </p>
              <p className="text-xs text-[#6B6B63]">
                {session.title} · {formatSessionDate(session.startsAt)} at{' '}
                {formatSessionTime(session.startsAt)}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-[#6B6B63]">
                <span className="font-medium text-[#1F2A24]">{session.title}</span>
                <br />
                {formatSessionDate(session.startsAt)} · {formatSessionTime(session.startsAt)} ·{' '}
                Microsoft Teams
              </p>

              <div className="space-y-2">
                <label htmlFor="reserve-email" className="text-sm font-medium text-[#1F2A24]">
                  Your email
                </label>
                <Input
                  id="reserve-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 rounded-xl border-[#E8E4DA] bg-[#F9F7F2]"
                />
                <p className="text-xs text-[#6B6B63]">
                  We&apos;ll use this to confirm your spot and send session details.
                </p>
              </div>

              {error ? (
                <p
                  className="rounded-xl bg-[#D39A45]/10 px-3 py-2.5 text-sm text-[#C17F3A]"
                  role="alert"
                >
                  {error}
                </p>
              ) : null}
            </div>
          )}
        </div>

        <div className="px-5 pb-5">
          {success ? (
            <button
              type="button"
              onClick={onClose}
              className="w-full rounded-2xl bg-[#2F5D50] py-3.5 text-sm font-medium text-white transition-all hover:bg-[#3a6d5f] active:scale-[0.98]"
            >
              You&apos;re in!
            </button>
          ) : (
            <button
              type="button"
              disabled={pending || !canConfirm}
              onClick={() => onConfirm(email.trim())}
              className="w-full rounded-2xl bg-[#2F5D50] py-3.5 text-sm font-medium text-white transition-all hover:bg-[#3a6d5f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {pending ? 'Saving…' : 'Confirm'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  )
}
