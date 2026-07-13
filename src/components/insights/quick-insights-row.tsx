import { Link } from 'react-router-dom'
import {
  ArrowUpRight,
  BarChart3,
  Bookmark,
  Heart,
  RefreshCw,
} from 'lucide-react'
import { typeSectionTitle } from '@/design-system/tokens'
import type { QuickInsightCard, QuickInsightIconKey } from '@/lib/personal-insights'
import { cn } from '@/lib/utils'

const ICONS: Record<
  QuickInsightIconKey,
  { icon: typeof BarChart3; bg: string; text: string }
> = {
  energy: { icon: BarChart3, bg: 'bg-green-muted', text: 'text-green' },
  strategies: { icon: Bookmark, bg: 'bg-lavender/20', text: 'text-lavender-deep' },
  drains: { icon: RefreshCw, bg: 'bg-orange/15', text: 'text-orange' },
  recovery: { icon: Heart, bg: 'bg-sage-light/60', text: 'text-green' },
}

interface QuickInsightsRowProps {
  cards: QuickInsightCard[]
  className?: string
}

export function QuickInsightsRow({ cards, className }: QuickInsightsRowProps) {
  return (
    <section aria-labelledby="quick-insights-heading" className={cn('space-y-4', className)}>
      <h2 id="quick-insights-heading" className={typeSectionTitle}>
        Quick insights
      </h2>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {cards.map((card) => (
          <QuickInsightTile key={card.id} card={card} />
        ))}
      </div>
    </section>
  )
}

function QuickInsightTile({ card }: { card: QuickInsightCard }) {
  const config = ICONS[card.icon]
  const Icon = config.icon
  const isAnchor = card.href.startsWith('#')

  const content = (
    <>
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          config.bg,
          config.text,
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="mt-4 space-y-1">
        <p className="text-sm font-medium text-text">{card.title}</p>
        <p className="text-xs leading-relaxed text-text-muted">{card.description}</p>
      </div>
      <ArrowUpRight
        className="absolute bottom-4 right-4 h-4 w-4 text-text-muted/50"
        aria-hidden="true"
      />
    </>
  )

  const className =
    'relative flex min-h-[9.5rem] flex-col rounded-[1.25rem] border border-border/60 bg-surface-solid p-4 shadow-[var(--shadow-premium)] transition-shadow hover:shadow-[0_8px_24px_rgba(31,42,36,0.08)]'

  if (isAnchor) {
    return (
      <a href={card.href} className={className}>
        {content}
      </a>
    )
  }

  return (
    <Link to={card.href} className={className}>
      {content}
    </Link>
  )
}
