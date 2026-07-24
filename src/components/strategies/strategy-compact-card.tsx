import type { CSSProperties } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  surfaceCard,
  typeCardTitle,
} from '@/design-system/tokens'
import type { Strategy, StrategyFeedback } from '@/types/strategy'
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
  onTryThis,
  className,
  style,
}: StrategyCompactCardProps) {
  return (
    <Card
      className={cn(
        surfaceCard,
        'flex min-h-[17rem] w-full flex-col border-green/10 bg-surface select-none sm:min-h-[19rem]',
        className,
      )}
      style={style}
    >
      <CardContent className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-8">
        <div className="flex flex-1 items-center">
          <p className={cn(typeCardTitle, 'font-display text-xl leading-relaxed sm:text-2xl')}>
            &ldquo;{strategy.situation}&rdquo;
          </p>
          <span className="sr-only">{strategy.title}</span>
        </div>

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
      </CardContent>
    </Card>
  )
}
