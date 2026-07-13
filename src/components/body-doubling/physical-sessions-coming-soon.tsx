import { useEffect, useState } from 'react'
import { Check, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import {
  isValidWaitlistEmail,
  joinPhysicalSessionWaitlist,
} from '@/lib/physical-session-waitlist'
import { cn } from '@/lib/utils'

const PHYSICAL_SESSIONS = [
  {
    id: 'saturday-reset',
    name: 'Saturday Reset',
    description:
      "Quiet weekend co-working for tasks you've been putting off.",
    tags: ['Quiet', 'Gentle', 'Low-pressure'],
  },
  {
    id: 'life-admin-club',
    name: 'Life Admin Club',
    description:
      'Emails, forms, budgeting, applications and adulting tasks — done together.',
    tags: ['Focused', 'Beginner-friendly', 'Gentle'],
  },
  {
    id: 'sunday-planning',
    name: 'Sunday Planning Session',
    description: 'A gentle space to plan the week before Monday arrives.',
    tags: ['Quiet', 'Gentle', 'Low-pressure'],
  },
] as const

interface PhysicalSessionsComingSoonProps {
  className?: string
  variant?: 'standalone' | 'tab'
}

export function PhysicalSessionsComingSoon({
  className,
  variant = 'standalone',
}: PhysicalSessionsComingSoonProps) {
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const isTab = variant === 'tab'
  const canSubmit = Boolean(user) && isValidWaitlistEmail(email) && !pending

  useEffect(() => {
    if (user?.email && !email) {
      setEmail(user.email)
    }
  }, [email, user?.email])

  async function handleJoinWaitlist() {
    if (!user || !canSubmit) return

    setPending(true)
    setError(null)

    try {
      await joinPhysicalSessionWaitlist({
        userId: user.uid,
        email,
      })
      setSuccess(true)
    } catch {
      setError('Something went wrong. Please try again in a moment.')
    } finally {
      setPending(false)
    }
  }

  return (
    <section
      aria-labelledby={isTab ? undefined : 'physical-sessions-heading'}
      className={cn('space-y-5 lg:space-y-6', className)}
    >
      <div className={cn('space-y-2', isTab && 'pt-1')}>
        {!isTab ? (
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-muted text-green">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-1.5">
              <h2
                id="physical-sessions-heading"
                className="font-display text-xl font-semibold text-[#1F2A24] lg:text-2xl"
              >
                Physical Focus Together Sessions
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#6B6B63] lg:text-base">
                In-person co-working spaces for quiet focus, life admin and weekend resets.
              </p>
            </div>
          </div>
        ) : (
          <p className="max-w-2xl text-sm leading-relaxed text-[#6B6B63] lg:text-base">
            In-person co-working spaces for quiet focus, life admin and weekend resets.
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:gap-6">
        {PHYSICAL_SESSIONS.map((session) => (
          <article
            key={session.id}
            className="flex flex-col rounded-[1.5rem] border border-border/60 bg-white p-5 shadow-[0_6px_24px_rgba(47,93,80,0.05)] lg:p-6"
          >
            <span className="inline-flex w-fit rounded-full bg-lavender-muted px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.08em] text-lavender-deep uppercase">
              Coming soon
            </span>

            <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-[#1F2A24]">
              {session.name}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[#6B6B63]">
              {session.description}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {session.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-[#F9F7F2] px-2.5 py-0.5 text-[10px] font-medium text-[#6B6B63]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <button
              type="button"
              disabled
              className="mt-5 w-full cursor-not-allowed rounded-2xl bg-cream-dark/80 px-4 py-3 text-sm font-medium text-text-muted"
            >
              Coming soon
            </button>
          </article>
        ))}
      </div>

      <div className="rounded-2xl border border-dashed border-green/25 bg-green-muted/30 px-5 py-5 text-center">
        {success ? (
          <div className="space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/80">
              <Check className="h-6 w-6 text-green" strokeWidth={2} aria-hidden="true" />
            </div>
            <p className="text-sm font-medium text-text">You&apos;re on the waitlist</p>
            <p className="text-xs leading-relaxed text-text-muted">
              We&apos;ll email you at{' '}
              <span className="font-medium text-text">{email.trim()}</span> when physical
              sessions launch.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-text">Interested? Join the waitlist</p>
              <p className="text-xs text-text-muted">
                Be first to know when in-person sessions open in your area.
              </p>
            </div>

            {!user ? (
              <p className="text-sm text-text-muted">
                Sign in to join the waitlist.
              </p>
            ) : (
              <div className="mx-auto max-w-sm space-y-3 text-left">
                <div className="space-y-2">
                  <label
                    htmlFor="physical-waitlist-email"
                    className="text-sm font-medium text-[#1F2A24]"
                  >
                    Your email
                  </label>
                  <Input
                    id="physical-waitlist-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    disabled={pending}
                    onChange={(event) => {
                      setEmail(event.target.value)
                      setError(null)
                    }}
                    className="h-12 rounded-xl border-[#E8E4DA] bg-white"
                  />
                  <p className="text-xs text-text-muted">
                    We&apos;ll only use this to notify you about physical sessions.
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

                <button
                  type="button"
                  disabled={!canSubmit}
                  onClick={() => void handleJoinWaitlist()}
                  className="w-full rounded-full border border-green/20 bg-white px-5 py-2.5 text-sm font-medium text-green transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {pending ? 'Joining…' : 'Join the waitlist'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
