import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'

export function LandingPage() {
  const navigate = useNavigate()
  const { user, loading: authLoading, signInAsGuest } = useAuth()
  const { hasCheckedInToday, loading: workLoading } = useWorkEnergy()
  const [guestLoading, setGuestLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loading = authLoading || (Boolean(user) && workLoading)

  async function handleContinueAsGuest() {
    setError(null)
    setGuestLoading(true)

    try {
      if (!user) {
        await signInAsGuest()
      }
      navigate('/work-check-in')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not continue as guest.')
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <div className="page-enter flex min-h-[80dvh] flex-col items-center justify-center bg-cream px-5 text-center">
      <div
        className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-green-muted"
        aria-hidden="true"
      >
        <Sparkles className="h-10 w-10 text-green" strokeWidth={1.5} />
      </div>

      <p className="mb-3 text-sm font-medium uppercase tracking-widest text-green">
        Welcome to NeuroDiver
      </p>

      <h1 className="font-display mb-4 max-w-sm text-4xl font-semibold leading-tight tracking-tight text-text">
        Understand your work energy — without the pressure.
      </h1>

      <p className="mb-10 max-w-sm text-lg leading-relaxed text-text-muted">
        A quick daily check-in helps you notice patterns at work. Private to you,
        designed for neurodivergent minds.
      </p>

      {error && (
        <p
          className="mb-4 max-w-sm rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange"
          role="alert"
        >
          {error}
        </p>
      )}

      <div className="flex w-full max-w-sm flex-col gap-3">
        {!user ? (
          <>
            <Button
              size="lg"
              className="w-full"
              disabled={guestLoading || authLoading}
              onClick={() => void handleContinueAsGuest()}
            >
              {guestLoading ? 'Starting…' : 'Continue as guest'}
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>

            <Button asChild variant="secondary" className="w-full">
              <Link to="/login">Sign in</Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild size="lg" className="w-full" disabled={loading}>
              <Link to={hasCheckedInToday ? '/work-reflection' : '/work-check-in'}>
                {loading
                  ? 'Loading…'
                  : hasCheckedInToday
                    ? 'View Daily Work Reflection'
                    : 'Start Work Energy Check-in'}
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>

            <Button asChild variant="ghost" className="w-full">
              <Link to="/home">Go to Dashboard</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
