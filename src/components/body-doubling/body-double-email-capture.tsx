import { useEffect, useState } from 'react'
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from 'lucide-react'
import {
  isValidBodyDoubleEmail,
  saveBodyDoubleInterest,
} from '@/lib/body-double-interest'
import { cn } from '@/lib/utils'

interface BodyDoubleEmailCaptureProps {
  userId: string | null
  defaultEmail?: string | null
  isGuest: boolean
  instanceId: string
  className?: string
}

export function BodyDoubleEmailCapture({
  userId,
  defaultEmail,
  isGuest,
  instanceId,
  className,
}: BodyDoubleEmailCaptureProps) {
  const [email, setEmail] = useState(defaultEmail ?? '')
  const [pending, setPending] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (defaultEmail) setEmail(defaultEmail)
  }, [defaultEmail])

  const submit = async () => {
    if (!userId) {
      setError('Please continue as a guest or sign in first.')
      return
    }

    if (!isValidBodyDoubleEmail(email)) {
      setError('Enter a valid email address.')
      return
    }

    setPending(true)
    setError(null)

    try {
      await saveBodyDoubleInterest({ userId, email, isGuest })
      setSubmitted(true)
    } catch {
      setError('We could not save your email. Please try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[1.75rem] border border-[#7A6B96]/15 bg-gradient-to-br from-[#F5F0FA] via-white to-[#F4E7BE]/55 p-5 shadow-[0_16px_40px_rgba(61,52,78,0.08)] sm:p-6',
        className,
      )}
      aria-labelledby={`body-double-email-title-${instanceId}`}
    >
      <div className="pointer-events-none absolute -right-12 -top-14 h-36 w-36 rounded-full bg-[#B9A6D3]/20 blur-2xl" />
      <div className="relative grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.9fr)] lg:items-center">
        <div className="flex gap-3.5">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#7A6B96] text-white shadow-[0_8px_18px_rgba(122,107,150,0.24)]">
            <Mail className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7A6B96]">
              Session updates
            </p>
            <h2 id={`body-double-email-title-${instanceId}`} className="mt-1 font-display text-xl font-semibold text-[#1F2A24]">
              Want a gentle reminder when we focus together?
            </h2>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-[#6B6B63]">
              Leave your email and we’ll keep you updated about upcoming Body Double sessions.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="flex items-center gap-3 rounded-2xl border border-[#2F5D50]/15 bg-white/85 px-4 py-4 text-[#2F5D50] shadow-sm" role="status">
            <CheckCircle2 className="h-6 w-6 shrink-0" aria-hidden="true" />
            <div>
              <p className="font-medium">You’re on the list.</p>
              <p className="mt-0.5 text-xs text-[#6B6B63]">We saved {email.trim().toLowerCase()}.</p>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="sr-only" htmlFor={`body-double-interest-email-${instanceId}`}>Email address</label>
              <input
                id={`body-double-interest-email-${instanceId}`}
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') void submit()
                }}
                placeholder="you@example.com"
                className="min-h-12 min-w-0 flex-1 rounded-2xl border border-[#7A6B96]/20 bg-white px-4 text-sm text-[#1F2A24] outline-none transition focus:border-[#7A6B96]/60 focus:ring-4 focus:ring-[#7A6B96]/10"
              />
              <button
                type="button"
                disabled={pending}
                onClick={() => void submit()}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#7A6B96] px-5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(122,107,150,0.24)] transition hover:bg-[#695c84] active:scale-[0.98] disabled:cursor-wait disabled:opacity-60"
              >
                {pending ? 'Saving…' : 'Keep me updated'}
                {!pending ? <ArrowRight className="h-4 w-4" aria-hidden="true" /> : null}
              </button>
            </div>
            {error ? <p className="mt-2 text-sm text-[#B4584D]" role="alert">{error}</p> : null}
            <p className="mt-2 flex items-center gap-1.5 text-xs text-[#6B6B63]">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              {isGuest ? 'No account needed. ' : ''}Only session-related updates; you can opt out anytime.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
