import { useEffect, useState } from 'react'
import { ArrowLeft, Lightbulb, MessageCircleMore, Send, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import {
  DESCRIBE_PLACEHOLDER_EXAMPLES,
  DESCRIBE_TOPIC_KEYWORDS,
  DESCRIBE_TOPIC_OPTIONS,
  type DescribeTopic,
} from '@/data/describe-it'
import { clearDescribeDraft, loadDescribeDraft, saveDescribeDraft } from '@/lib/describe-draft'
import {
  getBrainStatusFromWorkCheckIn,
  submitFreeTextRequest,
} from '@/lib/strategy-analytics'
import { matchStrategiesFromFreeText } from '@/lib/strategy-search'
import type { Strategy } from '@/types/strategy'
import type { WorkCheckIn } from '@/types/work-energy'
import { useAuth } from '@/context/auth-context'

interface HelpMeDescribeProps {
  strategies: Strategy[]
  todayCheckIn: WorkCheckIn | null
  onNoMatches: (requestId: string) => void
  onBack: () => void
  initialDescription?: string
  variant?: 'simple' | 'full'
}

export function HelpMeDescribe({
  strategies,
  todayCheckIn,
  onNoMatches,
  onBack,
  initialDescription = '',
  variant = 'full',
}: HelpMeDescribeProps) {
  const isSimple = variant === 'simple'
  const { user } = useAuth()
  const [description, setDescription] = useState('')
  const [optionalTopic, setOptionalTopic] = useState<DescribeTopic | null>(null)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [draftSaved, setDraftSaved] = useState(false)

  const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)

  useEffect(() => {
    if (initialDescription) {
      setDescription(initialDescription)
      return
    }

    const draft = loadDescribeDraft()
    if (!draft) return

    setDescription(draft.description)
    setOptionalTopic(draft.optionalTopic)
  }, [initialDescription])

  const handleSaveForLater = () => {
    if (!description.trim()) return

    saveDescribeDraft(description, optionalTopic)
    setDraftSaved(true)
    window.setTimeout(() => setDraftSaved(false), 3000)
  }

  const handleSendToNeuroDiver = async () => {
    const trimmed = description.trim()
    if (!trimmed) return

    if (!user) {
      setError('Sign in to send your experience to NeuroDiver.')
      return
    }

    setPending(true)
    setError(null)

    const topicKeywords = optionalTopic
      ? DESCRIBE_TOPIC_KEYWORDS[optionalTopic]
      : ''
    const matches = matchStrategiesFromFreeText(
      strategies,
      trimmed,
      topicKeywords,
    )

    try {
      const requestId = await submitFreeTextRequest({
        userId: user.uid,
        description: trimmed,
        optionalTopic,
        searchResultsFound: matches.length,
        matchedStrategyIds: matches.map((strategy) => strategy.id),
        notifyWhenAvailable: false,
        brainStatus,
      })

      clearDescribeDraft()

      onNoMatches(requestId)
    } catch {
      setError('Something went wrong. Your words are still here — try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="-ml-2 w-fit gap-2 rounded-full px-3 text-text-muted hover:text-green"
        onClick={onBack}
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        Back to strategies
      </Button>

      <header className="relative overflow-hidden rounded-[1.75rem] border border-green/10 bg-gradient-to-br from-green-muted/75 via-surface-solid to-yellow/25 px-5 py-6 sm:px-7 sm:py-7">
        <div className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full bg-sage/20 blur-2xl" />
        <div className="relative flex items-start gap-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green text-white shadow-sm">
            <MessageCircleMore className="h-5 w-5" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold text-text sm:text-3xl">
              Tell us what&apos;s been happening
            </h2>
            <p className="mt-2 text-base leading-relaxed text-text-muted">
              You don&apos;t need perfect words. Explain it the way you would to someone who
              genuinely wants to understand.
            </p>
          </div>
        </div>
      </header>

      <section className="rounded-[1.5rem] border border-orange/10 bg-gradient-to-br from-yellow/20 to-surface-solid px-5 py-5 sm:px-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-orange" aria-hidden="true" />
          <h3 className="font-display text-lg font-semibold text-text">Not sure where to begin?</h3>
        </div>
        <p className="mt-2 text-sm text-text-muted">Use any of these prompts to shape your answer:</p>
        <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-text sm:grid-cols-2">
          <li className="rounded-xl bg-white/70 px-3 py-2.5">What were you trying to do?</li>
          <li className="rounded-xl bg-white/70 px-3 py-2.5">What part felt hardest?</li>
          <li className="rounded-xl bg-white/70 px-3 py-2.5">What did you notice in your body or thoughts?</li>
          <li className="rounded-xl bg-white/70 px-3 py-2.5">What kind of support might have helped?</li>
        </ul>
      </section>

      <section className="space-y-3">
        <div>
          <label htmlFor="describe-experience" className="text-sm font-semibold text-text">
            Describe your situation
          </label>
          <p className="mt-1 text-sm text-text-muted">Share only what feels comfortable.</p>
        </div>
        <Textarea
          id="describe-experience"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={DESCRIBE_PLACEHOLDER_EXAMPLES[0]}
          className="min-h-48 bg-surface-solid/90"
          aria-label="Describe what's been happening"
        />
        <p className="text-xs leading-relaxed text-text-muted">
          For example: &ldquo;{DESCRIBE_PLACEHOLDER_EXAMPLES[1]}&rdquo;
        </p>
      </section>

      <div className="space-y-3">
        <p className="text-sm font-medium text-text-muted">
          What is this mostly about? <span className="font-normal">(optional)</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {DESCRIBE_TOPIC_OPTIONS.map((topic) => (
            <button
              key={topic}
              type="button"
              aria-pressed={optionalTopic === topic}
              onClick={() =>
                setOptionalTopic((current) => current === topic ? null : topic)
              }
              className={cn(
                'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                optionalTopic === topic
                  ? 'bg-green text-white shadow-sm'
                  : 'bg-surface-solid text-text-muted ring-1 ring-border hover:bg-yellow/30 hover:text-text',
              )}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
          {error}
        </p>
      )}

      {draftSaved && (
        <p className="rounded-xl bg-green-muted/60 px-4 py-3 text-sm text-green">
          Saved for later — you can come back anytime.
        </p>
      )}

      <div className="space-y-3">
        <Button
          type="button"
          className="w-full"
          disabled={pending || !description.trim()}
          onClick={() => void handleSendToNeuroDiver()}
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {pending ? 'Sending…' : 'Send to NeuroDiver'}
        </Button>

        <p className="flex items-start justify-center gap-1.5 text-center text-xs leading-relaxed text-text-muted">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green" aria-hidden="true" />
          Your experience helps us understand which support is missing from the library.
        </p>

        {!isSimple && (
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={!description.trim()}
            onClick={handleSaveForLater}
          >
            Save for Later
          </Button>
        )}

        <Button type="button" variant="ghost" className="w-full" onClick={onBack}>
          Back to Strategy Navigator
        </Button>
      </div>
    </div>
  )
}
