import { ArrowRight, Clock } from 'lucide-react'
import {
  surfaceCard,
  surfaceCardPadding,
  typeCardTitle,
  typeHelper,
} from '@/design-system/tokens'
import type { Strategy } from '@/types/strategy'
import { cn } from '@/lib/utils'

const CATEGORY_ACCENT: Record<string, { label: string; className: string }> = {
  'Executive Function': { label: 'Initiation', className: 'text-orange' },
  'Energy & Burnout': { label: 'Energy', className: 'text-green' },
  'Emotional Regulation': { label: 'Regulation', className: 'text-lavender-deep' },
  'Sensory Management': { label: 'Sensory', className: 'text-lavender-deep' },
  'Social & Communication': { label: 'Communication', className: 'text-green-soft' },
  'Daily Living': { label: 'Daily living', className: 'text-text-muted' },
}

function getCategoryAccent(category: string) {
  return (
    CATEGORY_ACCENT[category] ?? {
      label: category,
      className: 'text-text-muted',
    }
  )
}

interface StrategyBrowseCardProps {
  strategy: Strategy
  onOpen: () => void
  className?: string
  fullHeight?: boolean
}

export function StrategyBrowseCard({
  strategy,
  onOpen,
  className,
  fullHeight = false,
}: StrategyBrowseCardProps) {
  const accent = getCategoryAccent(strategy.category)

  return (
    <article
      className={cn(
        surfaceCard,
        surfaceCardPadding,
        'flex w-full flex-col shadow-[var(--shadow-premium)]',
        fullHeight && 'h-full min-h-0',
        className,
      )}
    >
      <span className="sr-only">{strategy.title}</span>

      <p
        className={cn(
          'text-[0.6875rem] font-semibold tracking-[0.14em] uppercase',
          accent.className,
        )}
      >
        {accent.label}
      </p>

      <div className="flex flex-1 flex-col justify-center py-4 sm:py-6">
        <p className={cn(typeCardTitle, 'font-display')}>
          &ldquo;{strategy.situation}&rdquo;
        </p>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-border/40 pt-4">
        <span className={cn(typeHelper, 'inline-flex items-center gap-1.5 font-medium')}>
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Read · {strategy.estimatedTime}
        </span>
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex items-center gap-1 text-sm font-medium text-text transition-opacity hover:opacity-70"
        >
          Open
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  )
}

interface StrategyBrowseUnlockCardProps {
  lockedCount: number
  className?: string
}

export function StrategyBrowseUnlockCard({
  lockedCount,
  className,
}: StrategyBrowseUnlockCardProps) {
  return (
    <section
      aria-labelledby="unlock-heading"
      className={cn(
        'flex h-full min-h-0 shrink-0 snap-start snap-always flex-col items-center justify-center rounded-[1.25rem] border border-dashed border-lavender/40 bg-lavender-muted/20 px-4 py-10 text-center sm:rounded-[1.5rem] sm:px-6',
        className,
      )}
    >
      <h2 id="unlock-heading" className="font-display text-xl font-semibold text-text">
        {lockedCount} more strateg{lockedCount === 1 ? 'y' : 'ies'} waiting
      </h2>
      <p className="mt-3 max-w-xs text-sm leading-relaxed text-text-muted">
        The full library isn&apos;t included in the pilot. Unlock more is a paid upgrade — not
        available yet.
      </p>
      <button
        type="button"
        disabled
        className="mt-6 cursor-not-allowed rounded-full border border-lavender/30 bg-white/70 px-6 py-2.5 text-sm font-medium text-text-muted"
      >
        Unlock more
      </button>
    </section>
  )
}
