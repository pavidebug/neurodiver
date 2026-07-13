import { Link } from 'react-router-dom'
import type { ExploreInsightTile } from '@/lib/personal-insights'
import { cn } from '@/lib/utils'

interface ExploreInsightsTilesProps {
  tiles: ExploreInsightTile[]
  muted?: boolean
  className?: string
}

export function ExploreInsightsTiles({
  tiles,
  muted = false,
  className,
}: ExploreInsightsTilesProps) {
  return (
    <section aria-labelledby="explore-insights-heading" className={cn('space-y-3', className)}>
      <h2 id="explore-insights-heading" className="text-sm font-medium text-text-muted">
        Explore insights
      </h2>

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        {tiles.map((tile) => (
          <ExploreTile key={tile.id} tile={tile} muted={muted} />
        ))}
      </div>
    </section>
  )
}

function ExploreTile({ tile, muted }: { tile: ExploreInsightTile; muted: boolean }) {
  const className = cn(
    'block rounded-xl border border-border/50 bg-surface-solid px-3.5 py-3 transition-colors',
    muted
      ? 'pointer-events-none opacity-50'
      : 'hover:border-green/20 hover:bg-cream/40',
  )

  return (
    <Link to={tile.href} className={className} tabIndex={muted ? -1 : undefined}>
      <p className="text-sm font-medium text-text">{tile.title}</p>
      <p className="mt-0.5 text-xs text-text-muted">{tile.subtitle}</p>
    </Link>
  )
}
