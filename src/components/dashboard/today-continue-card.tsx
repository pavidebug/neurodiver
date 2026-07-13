import { Link } from 'react-router-dom'
import { ArrowRight, Bookmark, NotebookPen, Users } from 'lucide-react'
import type { TodayContinueItem } from '@/lib/today-page'
import { cn } from '@/lib/utils'

const ICONS = {
  'saved-strategy': Bookmark,
  'body-double': Users,
  reflection: NotebookPen,
  'recent-strategy': Bookmark,
} as const

interface TodayContinueCardProps {
  item: TodayContinueItem
  className?: string
}

export function TodayContinueCard({ item, className }: TodayContinueCardProps) {
  const Icon = ICONS[item.kind]

  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/50 bg-cream/40 px-5 py-4',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/80 text-text-muted">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
            Continue where you left off
          </p>
          <h3 className="text-base font-medium text-text">{item.title}</h3>
          <p className="text-sm text-text-muted">{item.description}</p>
          <Link
            to={item.href}
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green hover:opacity-80"
          >
            {item.ctaLabel}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
