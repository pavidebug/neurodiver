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
    <section className="space-y-4 sm:space-y-5">
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
              className="group flex min-w-0 flex-col items-center gap-1.5"
            >
              <span
                className={cn(
                  'flex items-center justify-center rounded-xl border border-white/60 p-1 shadow-[var(--shadow-premium)]',
                  'sm:rounded-2xl lg:p-1.5',
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

              <span className="flex min-h-[2rem] w-full items-start justify-center lg:min-h-[2.125rem]">
                <span className={strategyTileLabel}>{chip.label}</span>
              </span>
            </button>
          )
        })}
      </StrategyTileGrid>
    </section>
  )
}
