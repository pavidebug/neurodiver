import { Leaf } from 'lucide-react'
import { StrategyTileGrid } from '@/design-system/layout'
import {
  strategyTileHover,
  strategyTileIcon,
  strategyTileLabel,
  strategyTileSize,
  typeSectionTitle,
} from '@/design-system/tokens'
import { SITUATION_CHIPS } from '@/data/strategy-navigator-chips'
import { SITUATION_CARD_STYLES } from '@/data/strategy-navigator-visuals'
import { SITUATION_LUCIDE_ICONS } from '@/data/strategy-lucide-icons'
import { cn } from '@/lib/utils'

const SITUATION_ICON_STROKE = 1.75

interface StrategySituationGridProps {
  onSelect: (id: string) => void
}

export function StrategySituationGrid({ onSelect }: StrategySituationGridProps) {
  return (
    <section className="space-y-3 rounded-[1.5rem] border border-orange/10 bg-gradient-to-br from-surface-solid to-yellow/20 p-4 shadow-[var(--shadow-premium)] sm:space-y-4 sm:p-6">
      <h2 className={cn(typeSectionTitle, 'flex items-center gap-2')}>
        <Leaf className="h-5 w-5 shrink-0 text-orange sm:h-6 sm:w-6" aria-hidden="true" />
        I&apos;m struggling with…
      </h2>

      <StrategyTileGrid>
        {SITUATION_CHIPS.map((chip) => {
          const style = SITUATION_CARD_STYLES[chip.id] ?? {
            bgClass: 'bg-cream',
            iconClass: 'text-text-muted',
          }
          const Icon = SITUATION_LUCIDE_ICONS[chip.id]

          return (
            <button
              key={chip.id}
              type="button"
              onClick={() => onSelect(chip.id)}
              className="group flex min-w-0 flex-col items-center gap-1"
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl border border-white/60 p-1 shadow-[0_3px_12px_rgba(31,42,36,0.05)]',
                  'sm:rounded-[0.875rem] lg:p-1',
                  strategyTileSize,
                  strategyTileHover,
                  style.bgClass,
                )}
              >
                {Icon ? (
                  <Icon
                    className={cn(strategyTileIcon, style.iconClass)}
                    strokeWidth={SITUATION_ICON_STROKE}
                    aria-hidden="true"
                  />
                ) : null}
              </span>

              <span className="flex min-h-[1.75rem] w-full items-start justify-center">
                <span className={strategyTileLabel}>{chip.label}</span>
              </span>
            </button>
          )
        })}
      </StrategyTileGrid>
    </section>
  )
}
