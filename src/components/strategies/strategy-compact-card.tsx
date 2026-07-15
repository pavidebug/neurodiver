import type { CSSProperties } from 'react'
import { useState } from 'react'
import { Bookmark, Clock, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  surfaceCard,
  typeCardTitle,
} from '@/design-system/tokens'
import type { Strategy, StrategyFeedback } from '@/types/strategy'
import { hasBuiltInStrategyTimer } from '@/lib/strategy-duration'
import { cn } from '@/lib/utils'

interface StrategyCompactCardProps {
  strategy: Strategy
  isSaved: boolean
  onToggleSave: () => void
  onTryThis: () => void
  onFeedback?: (feedback: StrategyFeedback) => void
  lastFeedback?: StrategyFeedback | null
  savePending?: boolean
  className?: string
  style?: CSSProperties
}

export function StrategyCompactCard({
  strategy,
  isSaved,
  onToggleSave,
  onTryThis,
  onFeedback,
  lastFeedback = null,
  savePending = false,
  className,
  style,
}: StrategyCompactCardProps) {
  const [justSaved, setJustSaved] = useState(false)
  const [feedbackGiven, setFeedbackGiven] = useState<StrategyFeedback | null>(lastFeedback)

  function handleSave() {
    onToggleSave()
    setJustSaved(true)
    window.setTimeout(() => setJustSaved(false), 500)
  }

  function handleFeedback(feedback: StrategyFeedback) {
    setFeedbackGiven(feedback)
    onFeedback?.(feedback)
  }

  return (
    <Card
      className={cn(
        surfaceCard,
        'flex min-h-[min(72dvh,420px)] w-full flex-col border-green/10 bg-surface select-none sm:min-h-[420px]',
        className,
      )}
      style={style}
    >
      <CardContent className="flex flex-1 flex-col justify-between gap-5 sm:gap-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between gap-3">
            <Badge variant="yellow" className="w-fit">
              {strategy.category}
            </Badge>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className={cn(
                'shrink-0 rounded-xl',
                isSaved && 'bg-green-muted text-green',
                justSaved && 'bookmark-pop',
              )}
              aria-label={isSaved ? 'Remove from saved' : 'Save strategy'}
              aria-pressed={isSaved}
              disabled={savePending}
              onClick={(event) => {
                event.stopPropagation()
                handleSave()
              }}
            >
              <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
            </Button>
          </div>

          <p className={cn(typeCardTitle, 'font-display')}>
            &ldquo;{strategy.situation}&rdquo;
          </p>
          <span className="sr-only">{strategy.title}</span>

          <div className="flex flex-wrap gap-2">
            {strategy.bestWhen.slice(0, 2).map((label) => (
              <MetaChip key={label} label={`Best for ${label}`} />
            ))}
            <MetaChip icon={Clock} label={strategy.estimatedTime} />
            <MetaChip icon={Zap} label={`${strategy.energyRequired} energy`} />
            {hasBuiltInStrategyTimer(strategy) ? (
              <MetaChip icon={Clock} label="Built-in timer" />
            ) : null}
            {strategy.tags.slice(0, 2).map((tag) => (
              <MetaChip key={tag} label={tag} />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Button
            type="button"
            className="w-full rounded-full"
            onClick={(event) => {
              event.stopPropagation()
              onTryThis()
            }}
          >
            Try this now
          </Button>

          {onFeedback ? (
            <div className="border-t border-border/50 pt-4">
              <p className="text-sm font-medium text-text">Did this help?</p>
              {feedbackGiven ? (
                <p className="mt-2 text-sm text-text-muted">Thanks — noted for future suggestions.</p>
              ) : (
                <div className="mt-2 flex flex-wrap gap-2">
                  <FeedbackButton label="Helped" onClick={() => handleFeedback('helped')} />
                  <FeedbackButton label="Not sure" onClick={() => handleFeedback('unsure')} />
                  <FeedbackButton label="Didn't help" onClick={() => handleFeedback('not-helpful')} />
                </div>
              )}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  )
}

function MetaChip({
  label,
  icon: Icon,
}: {
  label: string
  icon?: typeof Clock
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-text-muted">
      {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden="true" /> : null}
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
