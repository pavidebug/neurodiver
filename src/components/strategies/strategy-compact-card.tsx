import type { CSSProperties } from 'react'
import { Bookmark, Clock, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { Strategy } from '@/types/strategy'

interface StrategyCompactCardProps {
  strategy: Strategy
  isSaved: boolean
  onToggleSave: () => void
  onTryThis: () => void
  savePending?: boolean
  className?: string
  style?: CSSProperties
}

export function StrategyCompactCard({
  strategy,
  isSaved,
  onToggleSave,
  onTryThis,
  savePending = false,
  className,
  style,
}: StrategyCompactCardProps) {
  return (
    <Card
      className={cn(
        'flex min-h-[420px] flex-col border-green/10 bg-surface shadow-md select-none',
        className,
      )}
      style={style}
    >
      <CardContent className="flex flex-1 flex-col justify-between gap-6 p-6">
        <div className="space-y-4">
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
              )}
              aria-label={isSaved ? 'Remove from saved' : 'Save strategy'}
              aria-pressed={isSaved}
              disabled={savePending}
              onClick={(event) => {
                event.stopPropagation()
                onToggleSave()
              }}
            >
              <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
            </Button>
          </div>

          <p className="font-display text-2xl font-medium leading-snug text-text">
            &ldquo;{strategy.situation}&rdquo;
          </p>
          <span className="sr-only">{strategy.title}</span>
        </div>

        <div className="space-y-5">
          <div className="flex flex-wrap gap-2">
            <MetaChip icon={Clock} label={strategy.estimatedTime} />
            <MetaChip icon={Zap} label={`${strategy.energyRequired} energy`} />
          </div>

          <Button
            type="button"
            className="w-full"
            onClick={(event) => {
              event.stopPropagation()
              onTryThis()
            }}
          >
            Try this
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function MetaChip({
  icon: Icon,
  label,
}: {
  icon: typeof Clock
  label: string
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-xs font-medium text-text-muted">
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  )
}
