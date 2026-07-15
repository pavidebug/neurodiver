import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Bookmark, Clock, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { typeCardTitle, typeHelper } from '@/design-system/tokens'
import type { Strategy, StrategyFeedback } from '@/types/strategy'
import { cn } from '@/lib/utils'

interface TodayStrategyCardProps {
  strategy: Strategy
  copy?: string
  featured?: boolean
  isSaved: boolean
  savePending?: boolean
  lastFeedback?: StrategyFeedback | null
  onToggleSave: () => void
  onFeedback?: (feedback: StrategyFeedback) => void
  className?: string
}

export function TodayStrategyCard({
  strategy,
  copy,
  featured = false,
  isSaved,
  savePending = false,
  lastFeedback = null,
  onToggleSave,
  onFeedback,
  className,
}: TodayStrategyCardProps) {
  const [justSaved, setJustSaved] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<StrategyFeedback | null>(lastFeedback)

  async function handleSave() {
    onToggleSave()
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 500)
  }

  function handleFeedback(feedback: StrategyFeedback) {
    setFeedbackGiven(feedback)
    onFeedback?.(feedback)
  }

  return (
    <article
      className={cn(
        'card-premium rounded-[1.25rem] border border-border/60 bg-surface-solid p-5 shadow-[var(--shadow-premium)] lg:p-6',
        featured && 'border-green/20',
        className,
      )}
    >
      {copy ? <p className={cn(typeHelper, 'text-green')}>{copy}</p> : null}

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0 space-y-2">
          <p className={typeCardTitle}>&ldquo;{strategy.situation}&rdquo;</p>
        </div>
        <button
          type="button"
          aria-label={isSaved ? 'Remove from saved' : 'Save strategy'}
          aria-pressed={isSaved}
          disabled={savePending}
          onClick={() => void handleSave()}
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-text-muted transition-colors hover:bg-cream',
            isSaved && 'bg-green-muted text-green',
            justSaved && 'bookmark-pop',
          )}
        >
          <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {strategy.bestWhen.slice(0, 2).map((label) => (
          <MetaPill key={label} label={`Best for ${label}`} />
        ))}
        <MetaPill icon={Clock} label={strategy.estimatedTime} />
        <MetaPill icon={Zap} label={`${strategy.energyRequired} energy`} />
        {strategy.tags.slice(0, 2).map((tag) => (
          <MetaPill key={tag} label={tag} />
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Button asChild className="rounded-full">
          <Link to={`/strategies?strategy=${encodeURIComponent(strategy.id)}`}>
            Try this now
          </Link>
        </Button>
      </div>

      {onFeedback ? (
        <div className="mt-5 border-t border-border/50 pt-4">
          <p className="text-sm font-medium text-text">Did this help?</p>
          {feedbackGiven ? (
            <p className="mt-2 text-sm text-text-muted">Thanks — we&apos;ll use this to refine suggestions.</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-2">
              <FeedbackButton label="Helped" onClick={() => handleFeedback('helped')} />
              <FeedbackButton label="Not sure" onClick={() => handleFeedback('unsure')} />
              <FeedbackButton label="Didn't help" onClick={() => handleFeedback('not-helpful')} />
            </div>
          )}
        </div>
      ) : null}
    </article>
  )
}

function MetaPill({
  label,
  icon: Icon,
}: {
  label: string
  icon?: typeof Clock
}) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2.5 py-1 text-[0.6875rem] font-medium text-text-muted">
      {Icon ? <Icon className="h-3 w-3" aria-hidden="true" /> : null}
      {label}
    </span>
  )
}

function FeedbackButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full border border-border bg-white px-3 py-1.5 text-xs font-medium text-text transition-colors hover:bg-cream"
    >
      {label}
    </button>
  )
}
