import { useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
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
    <div className="page-enter mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center bg-cream px-5 py-10">
      <div className="mb-8 text-center">
        <div
          className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-green-muted"
          aria-hidden="true"
        >
          <Sparkles className="h-8 w-8 text-green" strokeWidth={1.5} />
        </div>
        <p className="mb-2 text-sm font-medium uppercase tracking-widest text-green">
          Welcome to NeuroDiver
        </p>
        <h1 className="font-display mb-3 text-3xl font-semibold leading-tight text-text">
          Understand your work energy — without the pressure.
        </h1>
        <p className="text-base leading-relaxed text-text-muted">
          Sign in to save your check-ins, or continue as a guest to explore.
        </p>
      </div>

      {error && (
        <p
          className="mb-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
          role="alert"
        >
          {error}
        </p>
      )}

      {!showEmailForm ? (
        <div className="flex w-full flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full bg-surface-solid"
            disabled={submitting}
            onClick={() => void handleGoogleSignIn()}
          >
            <GoogleIcon className="h-5 w-5" />
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="secondary"
            size="lg"
            className="w-full"
            disabled={submitting}
            onClick={openEmailForm}
          >
            Continue with Email
          </Button>

          <Button
            type="button"
            size="lg"
            className="w-full"
            disabled={submitting}
            onClick={() => void handleGuestSignIn()}
          >
            {submitting ? 'Starting…' : 'Continue as Guest'}
            <ArrowRight className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            type="button"
            variant="ghost"
            className="px-0 text-text-muted"
            disabled={submitting}
            onClick={closeEmailForm}
          >
            ← Back to sign-in options
          </Button>

          <form className="space-y-4" onSubmit={handleEmailSubmit} noValidate>
            <div className="space-y-2">
              <label htmlFor="welcome-email" className="text-sm font-medium text-text">
                Email
              </label>
              <Input
                id="welcome-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="welcome-password" className="text-sm font-medium text-text">
                Password
              </label>
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
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting
                ? 'Please wait…'
                : mode === 'sign-in'
                  ? 'Continue with Email'
                  : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-text-muted">
            {mode === 'sign-in' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              type="button"
              className={cn(
                'font-semibold text-green underline-offset-2 hover:underline',
              )}
              disabled={submitting}
              onClick={() => {
                setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')
                setError(null)
              }}
            >
              {mode === 'sign-in' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      )}
    </div>
  )
}
