import { LayoutGrid } from 'lucide-react'
import { SelectableChip } from '@/components/strategies/filter-chip-row'
import { STRATEGY_SECTION_HEADER } from '@/components/strategies/strategy-navigator-styles'
import { BROWSE_CATEGORY_CHIPS } from '@/data/strategy-navigator-chips'

interface StrategyCategoryScrollProps {
  onSelect: (id: string) => void
}

export function StrategyCategoryScroll({ onSelect }: StrategyCategoryScrollProps) {
  return (
    <section className="space-y-3 lg:space-y-4">
      <h2 className={STRATEGY_SECTION_HEADER}>
        <LayoutGrid className="h-5 w-5 shrink-0 text-green lg:h-6 lg:w-6" aria-hidden="true" />
        Browse by category
      </h2>

      <div className="flex flex-wrap gap-2 lg:gap-2.5">
        {BROWSE_CATEGORY_CHIPS.map((chip) => (
          <SelectableChip
            key={chip.id}
            label={chip.label}
            emoji={chip.emoji}
            onClick={() => onSelect(chip.id)}
          />
        ))}
      </div>
    </section>
  )
}
