import { useEffect, useMemo, useState } from 'react'
import { Clock3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Strategy } from '@/types/strategy'
import { cn } from '@/lib/utils'
import {
  getStrategyEstimatedMinutes,
  getStrategyTimerOptions,
  hasBuiltInStrategyTimer,
} from '@/lib/strategy-duration'

interface StrategyTimerButtonProps {
  strategy: Strategy
  timerActive: boolean
  onStart: (minutes: number, trigger: HTMLButtonElement) => void
}

export function StrategyTimerButton({
  strategy,
  timerActive,
  onStart,
}: StrategyTimerButtonProps) {
  const options = useMemo(
    () => getStrategyTimerOptions(strategy),
    [strategy.estimatedMinutes, strategy.estimatedTime, strategy.timerOptions],
  )
  const estimatedMinutes = getStrategyEstimatedMinutes(strategy)
  const [selectedMinutes, setSelectedMinutes] = useState(
    estimatedMinutes && options.includes(estimatedMinutes)
      ? estimatedMinutes
      : options[0]!,
  )

  useEffect(() => {
    setSelectedMinutes(
      estimatedMinutes && options.includes(estimatedMinutes)
        ? estimatedMinutes
        : options[0]!,
    )
  }, [estimatedMinutes, options])

  if (!hasBuiltInStrategyTimer(strategy)) return null

  return (
    <section className="space-y-4 rounded-2xl border border-lavender/20 bg-gradient-to-br from-lavender-muted/60 to-surface-solid px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-lavender-deep shadow-sm">
          <Clock3 className="h-4 w-4" aria-hidden="true" />
        </span>
        <div>
          <p className="font-medium text-text">Built-in timer</p>
          <p className="mt-1 text-sm leading-relaxed text-text-muted">
            The timer is optional. You can pause or stop whenever you need.
          </p>
        </div>
      </div>

      {options.length > 1 ? (
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-text-muted">Choose a gentle starting point</legend>
          <div className="flex flex-wrap gap-2">
            {options.map((minutes) => (
              <button
                key={minutes}
                type="button"
                aria-pressed={selectedMinutes === minutes}
                onClick={() => setSelectedMinutes(minutes)}
                className={cn(
                  'rounded-full px-3.5 py-2 text-sm font-medium transition-colors',
                  selectedMinutes === minutes
                    ? 'bg-lavender-deep text-white shadow-sm'
                    : 'bg-white/80 text-text ring-1 ring-lavender/25 hover:bg-white',
                )}
              >
                {minutes} minute{minutes === 1 ? '' : 's'}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <Button
        type="button"
        className="w-full"
        disabled={timerActive}
        onClick={(event) => onStart(selectedMinutes, event.currentTarget)}
      >
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        {timerActive
          ? 'A timer is already running'
          : `Start ${selectedMinutes}-minute timer`}
      </Button>
    </section>
  )
}
