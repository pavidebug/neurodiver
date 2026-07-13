import { Link } from 'react-router-dom'
import { ArrowRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { TodayPrimaryAction } from '@/lib/today-page'
import { cn } from '@/lib/utils'

interface TodayPrimaryActionCardProps {
  action: TodayPrimaryAction
  className?: string
}

export function TodayPrimaryActionCard({ action, className }: TodayPrimaryActionCardProps) {
  return (
    <article
      className={cn(
        'flex flex-col rounded-[1.5rem] border border-green/20 bg-surface-solid px-5 py-6 shadow-[var(--shadow-premium)] sm:px-6 xl:px-8 xl:py-8',
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.1em] text-green">
        Suggested for right now
      </p>
      <h2 className="mt-3 font-display text-2xl font-semibold leading-tight text-text">
        {action.title}
      </h2>
      <p className="mt-3 max-w-prose text-sm leading-relaxed text-text-muted sm:text-base">
        {action.description}
      </p>

      <div className="mt-5 flex items-center gap-3 xl:mt-auto xl:pt-8">
        <Button asChild size="lg" className="rounded-full">
          <Link to={action.href}>
            {action.ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        {action.kind === 'body-double' ? (
          <Users className="h-5 w-5 text-text-muted/50" aria-hidden="true" />
        ) : null}
      </div>
    </article>
  )
}
