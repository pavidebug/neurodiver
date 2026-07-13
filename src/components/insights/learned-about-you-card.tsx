import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Bookmark,
  Brain,
  Heart,
  Sun,
  Zap,
} from 'lucide-react'
import type { InsightHighlight, InsightIconKey, PersonalInsight } from '@/lib/personal-insights'
import { cn } from '@/lib/utils'

const ICONS: Record<
  InsightIconKey,
  { icon: typeof Zap; bg: string; text: string }
> = {
  drain: { icon: Zap, bg: 'bg-orange/15', text: 'text-orange' },
  energy: { icon: Sun, bg: 'bg-yellow/25', text: 'text-[#B8860B]' },
  strategy: { icon: Bookmark, bg: 'bg-lavender/20', text: 'text-lavender-deep' },
  pattern: { icon: Heart, bg: 'bg-green-muted', text: 'text-green' },
}

interface LearnedAboutYouCardProps {
  highlights: InsightHighlight[]
  allInsights: PersonalInsight[]
  className?: string
}

export function LearnedAboutYouCard({
  highlights,
  allInsights,
  className,
}: LearnedAboutYouCardProps) {
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    if (window.location.hash === '#all-insights') {
      setExpanded(true)
    }
  }, [])

  return (
    <article
      className={cn(
        'overflow-hidden rounded-[1.75rem] border border-green/15 bg-gradient-to-br from-[#E8F0EB] via-green-muted/50 to-[#D4E8DA] p-5 shadow-[0_8px_32px_rgba(45,90,61,0.08)] sm:p-6 lg:p-8',
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/80 text-green shadow-sm">
          <Brain className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="min-w-0 space-y-1">
          <h2 className="font-display text-xl font-semibold text-text sm:text-2xl">
            What NeuroDiver has learned about you
          </h2>
          <p className="text-sm leading-relaxed text-text-muted sm:text-base">
            Gentle insights from your check-ins and saved strategies.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {highlights.map((highlight) => (
          <InsightHighlightCell key={highlight.id} highlight={highlight} />
        ))}
      </div>

      {(allInsights.length > 0 && expanded) && (
        <div
          id="all-insights"
          className="mt-6 space-y-3 border-t border-green/15 pt-6"
        >
          {allInsights.map((insight) => (
            <div
              key={insight.id}
              className="rounded-2xl bg-white/55 px-4 py-3"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.08em] text-text-muted">
                {insight.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-text">{insight.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex justify-end">
        {allInsights.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setExpanded((open) => {
                const next = !open
                if (next) window.location.hash = 'all-insights'
                else if (window.location.hash === '#all-insights') {
                  history.replaceState(null, '', window.location.pathname)
                }
                return next
              })
            }}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-green transition-opacity hover:opacity-80"
          >
            {expanded ? 'Show less' : 'See all insights'}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </article>
  )
}

function InsightHighlightCell({ highlight }: { highlight: InsightHighlight }) {
  const config = ICONS[highlight.icon]
  const Icon = config.icon

  return (
    <div className="space-y-3 rounded-2xl bg-white/45 px-4 py-4">
      <div
        className={cn(
          'flex h-10 w-10 items-center justify-center rounded-full',
          config.bg,
          config.text,
        )}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium leading-snug text-text">{highlight.title}</p>
        <p className="text-xs text-text-muted">{highlight.subtitle}</p>
      </div>
    </div>
  )
}
