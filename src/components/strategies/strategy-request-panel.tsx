import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/auth-context'
import {
  getBrainStatusFromWorkCheckIn,
  submitStrategyRequest,
} from '@/lib/strategy-analytics'
import type { WorkCheckIn } from '@/types/work-energy'

const EXAMPLE_EXPERIENCES = [
  "I've been putting off replying to messages because every reply feels overwhelming.",
  'I keep forgetting why I walked into a room.',
  "I'm exhausted after every team meeting.",
]

interface StrategyRequestPanelProps {
  searchTerm: string | null
  todayCheckIn: WorkCheckIn | null
  onBack: () => void
  className?: string
}

export function StrategyRequestPanel({
  searchTerm,
  todayCheckIn,
  onBack,
  className,
}: StrategyRequestPanelProps) {
  const { user } = useAuth()
  const [description, setDescription] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)

  const handleSubmit = async () => {
    const trimmed = description.trim()
    if (!user || !trimmed) return

    setPending(true)
    setError(null)

    try {
      await submitStrategyRequest({
        userId: user.uid,
        description: trimmed,
        searchTerm,
        brainStatus,
      })
      setSubmitted(true)
    } catch {
      setError('We couldn\u2019t save your experience right now. Please try again.')
    } finally {
      setPending(false)
    }
  }

  if (submitted) {
    return (
      <div
        className={cn(
          'space-y-6 rounded-2xl border border-border bg-surface-solid px-5 py-8',
          className,
        )}
      >
        <div className="space-y-4 text-center">
          <h2 className="font-display text-2xl font-semibold text-text">
            Thank you for sharing.
          </h2>
          <p className="text-base leading-relaxed text-text-muted">
            Your experience helps us build better support for everyone.
          </p>
          <p className="text-base leading-relaxed text-text-muted">
            We&apos;ll use these anonymous insights to improve NeuroDiver over time.
          </p>
        </div>

        <Button type="button" className="w-full" onClick={onBack}>
          Back to Strategy Navigator
        </Button>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'space-y-6 rounded-2xl border border-border bg-surface-solid px-5 py-6',
        className,
      )}
    >
      <header className="space-y-3">
        <h2 className="font-display text-xl font-semibold leading-snug text-text">
          Couldn&apos;t find what you were looking for?
        </h2>
        <p className="text-base leading-relaxed text-text-muted">
          We&apos;re still growing our strategy library, and your experience could
          help us support more people.
        </p>
        <p className="text-base leading-relaxed text-text">
          Tell us what&apos;s been happening in your own words.
        </p>
      </header>

      <div className="space-y-3">
        <Textarea
          id="strategy-experience"
          placeholder={EXAMPLE_EXPERIENCES[0]}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          className="min-h-36"
          aria-label="Describe your experience in your own words"
        />

        <ul className="space-y-2 text-sm text-text-muted">
          {EXAMPLE_EXPERIENCES.map((example) => (
            <li key={example} className="leading-relaxed">
              or &ldquo;{example}&rdquo;
            </li>
          ))}
        </ul>
      </div>

      {error && (
        <p className="text-sm text-orange" role="alert">
          {error}
        </p>
      )}

      {!user && (
        <p className="rounded-xl bg-yellow/20 px-4 py-3 text-sm text-text-muted">
          Sign in to share your experience with us.
        </p>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          className="w-full"
          disabled={pending || !user || !description.trim()}
          onClick={() => void handleSubmit()}
        >
          {pending ? 'Sharing…' : 'Share my experience'}
        </Button>

        <Button type="button" variant="outline" className="w-full" onClick={onBack}>
          Back to Strategy Navigator
        </Button>
      </div>
    </div>
  )
}
