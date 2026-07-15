import { useState } from 'react'
import { CircleHelp, Compass } from 'lucide-react'
import { StrategyDeckExplainer } from '@/components/strategies/strategy-deck-explainer'
import { cn } from '@/lib/utils'

interface StrategyNavigatorHeaderProps {
  desktop?: boolean
}

export function StrategyNavigatorHeader({ desktop = false }: StrategyNavigatorHeaderProps) {
  const [explainerOpen, setExplainerOpen] = useState(false)

  return (
    <>
      <header
        className={cn(
          'overflow-hidden rounded-[2rem] border border-green/10 bg-green-muted/35 shadow-[var(--shadow-premium)]',
          desktop ? 'px-9 py-9 xl:px-11 xl:py-10' : 'px-5 py-6',
        )}
      >
        <div className={cn('flex gap-4', desktop ? 'items-center justify-between' : 'flex-col')}>
          <div className="flex min-w-0 items-center gap-4">
            <span
              className={cn(
                'flex shrink-0 items-center justify-center rounded-2xl bg-green text-white shadow-sm',
                desktop ? 'h-16 w-16' : 'h-12 w-12',
              )}
            >
              <Compass className={desktop ? 'h-8 w-8' : 'h-6 w-6'} aria-hidden="true" />
            </span>

            <h1
              className={cn(
                'min-w-0 font-display font-semibold leading-tight tracking-tight text-text',
                desktop ? 'text-4xl xl:text-[2.75rem]' : 'text-[1.75rem]',
              )}
            >
              Help me find a strategy
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setExplainerOpen(true)}
            className={cn(
              'inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-green/20 bg-surface-solid px-4 py-2.5 text-sm font-medium text-green transition-colors hover:bg-cream',
              !desktop && 'self-start',
            )}
          >
            <CircleHelp className="h-4 w-4" aria-hidden="true" />
            What is a Strategy Deck?
          </button>
        </div>
      </header>

      <StrategyDeckExplainer open={explainerOpen} onClose={() => setExplainerOpen(false)} />
    </>
  )
}
