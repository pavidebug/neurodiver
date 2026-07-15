import { Link } from 'react-router-dom'
import { Bookmark } from 'lucide-react'
import { typeBodyMuted, typeSectionTitle } from '@/design-system/tokens'
import { cn } from '@/lib/utils'
import type { Strategy } from '@/types/strategy'

interface SavedStrategiesSectionProps {
  strategies: Strategy[]
  title?: string
  subtitle?: string
  className?: string
}

export function SavedStrategiesSection({
  strategies,
  title = 'Saved strategies',
  subtitle,
  className,
}: SavedStrategiesSectionProps) {
  if (strategies.length === 0) return null

  return (
    <section aria-labelledby="saved-heading" className={cn('space-y-4', className)}>
      <div>
        <h2 id="saved-heading" className={typeSectionTitle}>
          {title}
        </h2>
        {subtitle ? <p className={cn(typeBodyMuted, 'mt-1')}>{subtitle}</p> : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {strategies.map((strategy) => (
          <Link
            key={strategy.id}
            to={`/strategies?strategy=${encodeURIComponent(strategy.id)}`}
            className="card-premium group rounded-[1.25rem] bg-surface-solid p-5 shadow-[var(--shadow-premium)]"
          >
            <Bookmark
              className="mb-3 h-4 w-4 text-green transition-transform duration-200 group-hover:scale-110"
              aria-hidden="true"
            />
            <p className="line-clamp-2 text-sm font-medium leading-snug text-text">
              &ldquo;{strategy.situation}&rdquo;
            </p>
          </Link>
        ))}
      </div>
    </section>
  )
}
