import { useState } from 'react'
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
          'px-1',
          desktop ? 'py-2' : 'pt-1',
        )}
      >
        <div className={cn('flex gap-3', desktop ? 'items-center justify-between' : 'flex-col')}>
          <h1
            className={cn(
              'min-w-0 font-display font-semibold leading-tight tracking-tight text-text',
              desktop ? 'text-3xl' : 'text-2xl',
            )}
          >
            Help me find a strategy
          </h1>

          <button
            type="button"
            onClick={() => setExplainerOpen(true)}
            className={cn(
              'inline-flex shrink-0 items-center justify-center rounded-full border border-green/20 bg-surface-solid px-4 py-2.5 text-sm font-medium text-green transition-colors hover:bg-cream',
              !desktop && 'self-start',
            )}
          >
            What is a Strategy Deck?
          </button>
        </div>
      </header>

      <StrategyDeckExplainer open={explainerOpen} onClose={() => setExplainerOpen(false)} />
    </>
  )
}
