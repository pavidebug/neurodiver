import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  Mail,
  UserRound,
} from 'lucide-react'
import { GoogleIcon } from '@/components/auth/google-icon'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/utils'

type AuthMode = 'sign-in' | 'sign-up'

export function LandingPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInAsGuest,
  } = useAuth()

  const [showEmailForm, setShowEmailForm] = useState(
    () => searchParams.get('email') === '1',
  )
  const [mode, setMode] = useState<AuthMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function openEmailForm() {
    setShowEmailForm(true)
    setError(null)
    setSearchParams({ email: '1' }, { replace: true })
  }

  function closeEmailForm() {
    setShowEmailForm(false)
    setError(null)
    setSearchParams({}, { replace: true })
  }

  async function handleGoogleSignIn() {
    setError(null)
    setSubmitting(true)

    try {
      await signInWithGoogle()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGuestSignIn() {
    setError(null)
    setSubmitting(true)

    try {
      await signInAsGuest()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not continue as guest.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleEmailSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      if (mode === 'sign-in') {
        await signInWithEmail(email.trim(), password)
      } else {
        await signUpWithEmail(email.trim(), password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-enter relative min-h-dvh overflow-hidden bg-cream">
      <div className="pointer-events-none absolute -left-24 top-[-7rem] h-72 w-72 rounded-full bg-green-muted/70" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-yellow/35" aria-hidden="true" />

      <main className="relative mx-auto flex min-h-dvh w-full max-w-[1080px] items-center px-4 py-5 sm:px-8 sm:py-8 lg:px-10">
        <div className="relative grid w-full overflow-hidden rounded-[2.5rem] border border-white/80 bg-surface/80 p-2.5 shadow-[0_28px_90px_rgba(31,42,36,0.13)] backdrop-blur-xl sm:p-4 lg:grid-cols-[0.9fr_1.1fr] lg:gap-4 lg:p-5">
          <div className="pointer-events-none absolute inset-x-16 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute -left-20 -top-24 h-60 w-60 rounded-full bg-white/55 blur-3xl" aria-hidden="true" />

        <section className="relative flex min-h-48 w-full flex-col items-center justify-center rounded-[2rem] border border-white/70 bg-gradient-to-br from-green-muted/80 via-surface/70 to-yellow/30 px-5 py-8 text-center sm:min-h-56 sm:px-8 lg:min-h-[31rem] lg:py-12">
          <div className="flex items-center justify-center gap-3.5">
            <img
              src="/neurodiver-icon.png"
              alt=""
              className="nd-logo-icon h-16 w-16 rounded-[1.35rem] object-contain shadow-[0_12px_28px_rgba(45,90,61,0.18)] sm:h-20 sm:w-20 lg:h-24 lg:w-24 lg:rounded-[1.75rem]"
            />
            <h1 className="text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-[3.4rem]">
              <span className="text-green">Neuro</span>
              <span className="text-orange">Diver</span>
            </h1>
          </div>

          <div className="mt-5 sm:mt-6">
            <p className="inline-flex rounded-full border border-white/80 bg-surface-solid/70 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-green shadow-sm backdrop-blur-md sm:text-xs">
              Work with your brain, not against it
            </p>
          </div>
        </section>

        <section className="relative mx-auto mt-2.5 w-full rounded-[2rem] border border-white/80 bg-surface-solid/85 p-5 shadow-[0_18px_50px_rgba(31,42,36,0.08)] backdrop-blur-xl sm:p-7 lg:mt-0 lg:flex lg:min-h-[31rem] lg:flex-col lg:justify-center lg:p-9">
          <div className="mb-6">
            {showEmailForm ? (
              <button
                type="button"
                className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-text-muted transition-colors hover:text-green"
                disabled={submitting}
                onClick={closeEmailForm}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                All sign-in options
              </button>
            ) : null}

            <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
              {showEmailForm
                ? mode === 'sign-in'
                  ? 'Welcome back'
                  : 'Create your account'
                : 'Start where you are'}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-muted sm:text-base">
              {showEmailForm
                ? mode === 'sign-in'
                  ? 'Sign in to continue your check-ins and saved strategies.'
                  : 'Create an account to keep your check-ins and strategies together.'
                : 'Sign in to save your progress, or explore first as a guest.'}
            </p>
          </div>

          {error ? (
            <p className="mb-4 rounded-2xl border border-orange/15 bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
              {error}
            </p>
          ) : null}

          {!showEmailForm ? (
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full rounded-2xl border-border bg-surface-solid text-text hover:border-green hover:text-green"
                disabled={submitting}
                onClick={() => void handleGoogleSignIn()}
              >
                <GoogleIcon className="h-5 w-5" />
                Continue with Google
              </Button>

              <Button
                type="button"
                size="lg"
                className="w-full rounded-2xl bg-green bg-none text-white hover:bg-green-soft"
                disabled={submitting}
                onClick={openEmailForm}
              >
                <Mail className="h-5 w-5" aria-hidden="true" />
                Continue with email
              </Button>

              <div className="flex items-center gap-3 py-1" aria-hidden="true">
                <span className="h-px flex-1 bg-border" />
                <span className="text-xs font-medium uppercase tracking-wider text-text-muted">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="lg"
                className="w-full rounded-2xl border border-green/15 bg-green-muted/45 text-green hover:bg-green-muted"
                disabled={submitting}
                onClick={() => void handleGuestSignIn()}
              >
                <UserRound className="h-5 w-5" aria-hidden="true" />
                {submitting ? 'Starting…' : 'Explore as a guest'}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-cream-dark p-1" role="tablist" aria-label="Email access mode">
                {(['sign-in', 'sign-up'] as const).map((nextMode) => (
                  <button
                    key={nextMode}
                    type="button"
                    role="tab"
                    aria-selected={mode === nextMode}
                    disabled={submitting}
                    onClick={() => {
                      setMode(nextMode)
                      setError(null)
                    }}
                    className={cn(
                      'rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                      mode === nextMode
                        ? 'bg-surface-solid text-green shadow-sm'
                        : 'text-text-muted hover:text-text',
                    )}
                  >
                    {nextMode === 'sign-in' ? 'Sign in' : 'Create account'}
                  </button>
                ))}
              </div>

              <form className="space-y-4" onSubmit={handleEmailSubmit} noValidate>
                <div className="space-y-2">
                  <label htmlFor="welcome-email" className="text-sm font-medium text-text">Email</label>
                  <Input
                    id="welcome-email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    disabled={submitting}
                    className="min-h-13 rounded-2xl"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="welcome-password" className="text-sm font-medium text-text">Password</label>
                  <Input
                    id="welcome-password"
                    type="password"
                    autoComplete={mode === 'sign-in' ? 'current-password' : 'new-password'}
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    minLength={6}
                    required
                    disabled={submitting}
                    className="min-h-13 rounded-2xl"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full rounded-2xl bg-green bg-none text-white hover:bg-green-soft" disabled={submitting}>
                  {submitting
                    ? 'Please wait…'
                    : mode === 'sign-in'
                      ? 'Sign in'
                      : 'Create account'}
                  <ArrowRight className="h-5 w-5" aria-hidden="true" />
                </Button>
              </form>
            </div>
          )}

          <div className="mt-6 flex items-start gap-2.5 border-t border-border pt-5 text-xs leading-relaxed text-text-muted">
            <LockKeyhole className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
            <p>Your check-ins are private to you. You can leave whenever you need.</p>
          </div>
        </section>
        </div>
      </main>
    </div>
  )
}
