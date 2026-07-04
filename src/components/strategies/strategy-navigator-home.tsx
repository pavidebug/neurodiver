import { Bookmark, ChevronRight, Search, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export type NavigatorEntry = 'search' | 'help-me-choose' | 'saved'

interface StrategyNavigatorHomeProps {
  savedCount: number
  onSelect: (entry: NavigatorEntry) => void
}

const entries: {
  id: NavigatorEntry
  title: string
  description: string
  icon: typeof Search
  accent: string
}[] = [
  {
    id: 'search',
    title: 'Search',
    description: 'Find a strategy by name, feeling, or challenge.',
    icon: Search,
    accent: 'bg-green-muted text-green',
  },
  {
    id: 'help-me-choose',
    title: 'Help Me Choose',
    description: 'Tell us how you feel — we’ll narrow it down.',
    icon: Sparkles,
    accent: 'bg-yellow/60 text-text',
  },
  {
    id: 'saved',
    title: 'Saved Strategies',
    description: 'Jump back to strategies you bookmarked.',
    icon: Bookmark,
    accent: 'bg-orange/10 text-orange',
  },
]

export function StrategyNavigatorHome({
  savedCount,
  onSelect,
}: StrategyNavigatorHomeProps) {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          Strategy Navigator
        </h1>
        <p className="text-base text-text-muted">
          Swipe through ideas. Tap when one feels right.
        </p>
      </header>

      <div className="space-y-3">
        {entries.map((entry) => {
          const Icon = entry.icon
          const badge =
            entry.id === 'saved' && savedCount > 0 ? `${savedCount} saved` : null

          return (
            <button
              key={entry.id}
              type="button"
              onClick={() => onSelect(entry.id)}
              className="group flex w-full items-center gap-4 rounded-2xl border border-border bg-surface-solid p-5 text-left shadow-sm transition-all hover:border-green/20 hover:shadow-md active:scale-[0.99]"
            >
              <span
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl',
                  entry.accent,
                )}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="font-display text-lg font-semibold text-text">
                    {entry.title}
                  </span>
                  {badge && (
                    <span className="rounded-full bg-green-muted px-2 py-0.5 text-xs font-medium text-green">
                      {badge}
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-text-muted">
                  {entry.description}
                </span>
              </span>

              <ChevronRight
                className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
          )
        })}
      </div>
    </div>
  )
}
