import { Link } from 'react-router-dom'
import { ArrowRight, Lightbulb, Sparkles, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TodayPrimaryAction } from '@/lib/today-page'
import { cn } from '@/lib/utils'

interface TodayPrimaryActionCardProps {
  actions: TodayPrimaryAction[]
  className?: string
}

export function TodayPrimaryActionCard({ actions, className }: TodayPrimaryActionCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-[1.5rem] border border-green/15 bg-gradient-to-br from-white via-white to-green-muted/35 px-5 py-6 shadow-[var(--shadow-premium)] sm:px-6 xl:px-8 xl:py-8',
        className,
      )}
    >
      <div className="flex items-center gap-2 text-green">
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        <p className="text-xs font-semibold uppercase tracking-[0.1em]">
          Suggested for right now
        </p>
      </div>
      <div className="mt-4 space-y-3">
        {actions.map((action, index) => {
          const SuggestionIcon = action.kind === 'body-double' ? Users : Lightbulb

          return (
          <div
            key={`${action.kind}-${action.strategyId ?? action.sessionId ?? action.href}`}
            className="rounded-2xl border border-border/50 bg-white/75 p-4 shadow-sm transition-colors hover:border-green/20 hover:bg-white sm:p-5"
          >
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-muted text-green">
                <SuggestionIcon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="mb-1 text-[0.6875rem] font-semibold uppercase tracking-wide text-text-muted">
                  Suggestion {index + 1}
                </p>
            {action.kind === 'strategy' ? (
              <h2 className="max-w-prose font-display text-lg font-semibold leading-snug text-text sm:text-xl">
                {action.description}
              </h2>
            ) : (
              <>
                <h2 className="font-display text-lg font-semibold leading-snug text-text sm:text-xl">
                  {action.title}
                </h2>
                <p className="mt-2 max-w-prose text-sm leading-relaxed text-text-muted sm:text-base">
                  {action.description}
                </p>
              </>
            )}

            <div className="mt-3 flex items-center gap-3">
              <Button asChild size="sm" variant="outline" className="rounded-full border-green/25 px-5 text-green hover:bg-green-muted/60">
                <Link to={action.href}>
                  {action.ctaLabel}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </article>
  )
}
