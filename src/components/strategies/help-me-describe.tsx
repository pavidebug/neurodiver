import { useEffect, useState } from 'react'
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
  onMatchesFound: (strategies: Strategy[]) => void
  onNoMatches: (requestId: string) => void
  onBack: () => void
  initialDescription?: string
  variant?: 'simple' | 'full'
}

export function HelpMeDescribe({
  strategies,
  todayCheckIn,
  onMatchesFound,
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

  const handleFindSimilar = async () => {
    const trimmed = description.trim()
    if (!trimmed) return

    if (!user) {
      setError('Sign in to find similar strategies and save your experience.')
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

      if (matches.length > 0) {
        onMatchesFound(matches)
      } else {
        onNoMatches(requestId)
      }
    } catch {
      setError('Something went wrong. Your words are still here — try again.')
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h2 className="font-display text-2xl font-semibold text-text">
          Tell us what&apos;s been happening.
        </h2>
        {!isSimple && (
          <>
            <p className="text-base leading-relaxed text-text-muted">
              You don&apos;t need the perfect words.
            </p>
            <p className="text-base leading-relaxed text-text-muted">
              Describe what today felt like, what you&apos;re struggling with, or
              what&apos;s been on your mind.
            </p>
            <p className="text-base leading-relaxed text-text">
              Write it exactly as you would tell a friend.
            </p>
          </>
        )}
        {isSimple && (
          <p className="text-base leading-relaxed text-text-muted">
            Write it exactly as you would tell a friend.
          </p>
        )}
      </header>

      <Textarea
        id="describe-experience"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder={DESCRIBE_PLACEHOLDER_EXAMPLES[0]}
        className="min-h-40"
        aria-label="Describe what's been happening"
      />

      {!isSimple && (
        <>
          <ul className="space-y-1.5 text-sm text-text-muted">
            {DESCRIBE_PLACEHOLDER_EXAMPLES.slice(1).map((example) => (
              <li key={example} className="leading-relaxed">
                &ldquo;{example}&rdquo;
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <p className="text-sm font-medium text-text-muted">
              What would you like help with?{' '}
              <span className="font-normal">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {DESCRIBE_TOPIC_OPTIONS.map((topic) => (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={optionalTopic === topic}
                  onClick={() =>
                    setOptionalTopic((current) =>
                      current === topic ? null : topic,
                    )
                  }
                  className={cn(
                    'rounded-full px-3 py-2 text-sm font-medium transition-colors',
                    optionalTopic === topic
                      ? 'bg-green text-white'
                      : 'bg-surface-solid text-text-muted ring-1 ring-border hover:bg-yellow/30 hover:text-text',
                  )}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

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
          onClick={() => void handleFindSimilar()}
        >
          {pending ? 'Looking…' : 'Find Similar Strategies'}
        </Button>

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
