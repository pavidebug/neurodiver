import { useState } from 'react'
import { ChoiceOption } from '@/components/work-check-in/choice-option'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type {
  CompletedPlanRating,
  SessionHelpfulRating,
} from '@/types/body-doubling'

interface SessionReflectionProps {
  pending: boolean
  error: string | null
  onSubmit: (input: {
    sessionHelpful: SessionHelpfulRating
    completedPlan: CompletedPlanRating
    wouldJoinAgain: number
    notes: string
  }) => void
  onBack: () => void
}

const HELPFUL_OPTIONS: Array<{ value: SessionHelpfulRating; label: string }> = [
  { value: 'yes', label: 'Yes' },
  { value: 'somewhat', label: 'Somewhat' },
  { value: 'not-today', label: 'Not today' },
]

const COMPLETED_OPTIONS: Array<{ value: CompletedPlanRating; label: string }> = [
  { value: 'yes', label: 'Yes' },
  { value: 'mostly', label: 'Mostly' },
  { value: 'not-today', label: 'Not today' },
]

export function SessionReflection({
  pending,
  error,
  onSubmit,
  onBack,
}: SessionReflectionProps) {
  const [sessionHelpful, setSessionHelpful] = useState<SessionHelpfulRating | null>(
    null,
  )
  const [completedPlan, setCompletedPlan] = useState<CompletedPlanRating | null>(
    null,
  )
  const [wouldJoinAgain, setWouldJoinAgain] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const canSubmit =
    sessionHelpful !== null && completedPlan !== null && wouldJoinAgain !== null

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-2xl font-semibold text-text">
          How did it go?
        </h1>
        <p className="text-base text-text-muted">
          Your feedback helps us improve these sessions.
        </p>
      </header>

      <fieldset className="space-y-3">
        <legend className="text-base font-medium text-text">
          Did this session help?
        </legend>
        <div className="space-y-2">
          {HELPFUL_OPTIONS.map((option) => (
            <ChoiceOption
              key={option.value}
              option={{ value: option.value, label: option.label }}
              selected={sessionHelpful === option.value}
              onSelect={(value) => setSessionHelpful(value as SessionHelpfulRating)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-base font-medium text-text">
          Did you complete what you planned?
        </legend>
        <div className="space-y-2">
          {COMPLETED_OPTIONS.map((option) => (
            <ChoiceOption
              key={option.value}
              option={{ value: option.value, label: option.label }}
              selected={completedPlan === option.value}
              onSelect={(value) => setCompletedPlan(value as CompletedPlanRating)}
            />
          ))}
        </div>
      </fieldset>

      <fieldset className="space-y-3">
        <legend className="text-base font-medium text-text">
          Would you join another session?
        </legend>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={wouldJoinAgain === value}
              aria-label={`${value} out of 5`}
              onClick={() => setWouldJoinAgain(value)}
              className={cn(
                'flex h-12 w-full items-center justify-center rounded-xl border-2 text-lg font-semibold transition-colors',
                wouldJoinAgain === value
                  ? 'border-green bg-green-muted text-green'
                  : 'border-border bg-surface text-text-muted hover:border-yellow hover:bg-yellow/20',
              )}
            >
              {value}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="space-y-3">
        <label htmlFor="session-reflection-notes" className="block text-base text-text">
          Optional notes
        </label>
        <Textarea
          id="session-reflection-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          placeholder="Anything else you'd like us to know?"
          className="min-h-24"
        />
      </div>

      {error && (
        <p className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          className="w-full"
          disabled={pending || !canSubmit}
          onClick={() => {
            if (!sessionHelpful || !completedPlan || wouldJoinAgain === null) return

            onSubmit({
              sessionHelpful,
              completedPlan,
              wouldJoinAgain,
              notes,
            })
          }}
        >
          {pending ? 'Saving…' : 'Submit feedback'}
        </Button>
        <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
          Back
        </Button>
      </div>
    </div>
  )
}
