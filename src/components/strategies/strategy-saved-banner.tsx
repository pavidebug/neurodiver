import { Heart, Sparkles } from 'lucide-react'
import { SavedCollectionIllustration } from '@/components/illustrations'
import type { Strategy } from '@/types/strategy'
import { cn } from '@/lib/utils'

interface StrategySavedBannerProps {
  savedStrategies: Strategy[]
  onSavedSelect: (strategy: Strategy) => void
  onExplore: () => void
  onViewAllSaved: () => void
  variant?: 'mobile' | 'desktop'
}

export function StrategySavedBanner({
  savedStrategies,
  onSavedSelect,
  onExplore,
  onViewAllSaved,
  variant = 'desktop',
}: StrategySavedBannerProps) {
  const hasSaved = savedStrategies.length > 0
  const isMobile = variant === 'mobile'
  const previewLimit = isMobile ? 2 : 3

  return (
    <section className="rounded-2xl border border-green/15 bg-green-muted/50 p-4 shadow-sm lg:rounded-3xl lg:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <div className="flex gap-3 lg:min-w-0 lg:flex-1 lg:items-center lg:gap-4">
          <SavedCollectionIllustration
            className={cn('shrink-0', isMobile ? 'h-12 w-16' : 'h-14 w-[4.5rem]')}
          />

          <div className="min-w-0 flex-1 space-y-1.5">
            <h2 className="flex items-center gap-2 font-display text-xl font-semibold text-text lg:text-[1.75rem]">
              Saved strategies
              <Heart className="h-4 w-4 text-orange" aria-hidden="true" />
            </h2>

            {hasSaved ? (
              <ul className="space-y-1.5 lg:grid lg:grid-cols-2 lg:gap-2 lg:space-y-0">
                {savedStrategies.slice(0, previewLimit).map((strategy) => (
                  <li key={strategy.id}>
                    <button
                      type="button"
                      onClick={() => onSavedSelect(strategy)}
                      className="w-full rounded-xl bg-white/50 px-3 py-2 text-left text-sm leading-snug text-text transition-colors hover:bg-white/80 lg:text-base"
                    >
                      &ldquo;{strategy.situation}&rdquo;
                    </button>
                  </li>
                ))}
                {savedStrategies.length > previewLimit ? (
                  <p className="text-xs text-text-muted lg:col-span-2 lg:text-sm">
                    +{savedStrategies.length - previewLimit} more saved
                  </p>
                ) : null}
              </ul>
            ) : (
              <p className="max-w-xl text-sm leading-relaxed text-text-muted lg:text-base">
                You haven&apos;t saved any strategies yet. Save strategies you find helpful so you
                can come back to them anytime.
              </p>
            )}
          </div>
        </div>

        <div
          className={cn(
            'flex flex-col gap-2',
            isMobile ? 'w-full' : 'shrink-0',
          )}
        >
          {hasSaved ? (
            <button
              type="button"
              onClick={onViewAllSaved}
              className={cn(
                'inline-flex items-center justify-center gap-2 rounded-full border border-green/25 bg-white/70 text-base font-medium text-green transition-colors hover:bg-white',
                isMobile ? 'w-full py-3' : 'px-6 py-3',
              )}
            >
              View saved
            </button>
          ) : null}
          <button
            type="button"
            onClick={onExplore}
            className={cn(
              'inline-flex items-center justify-center gap-2 rounded-full bg-green text-base font-medium text-white shadow-[0_4px_16px_rgba(47,93,80,0.2)] transition-colors hover:bg-green-soft',
              isMobile ? 'w-full py-3' : 'px-6 py-3',
            )}
          >
            Explore strategies
            <Sparkles className="h-4 w-4 opacity-80" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
