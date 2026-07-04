import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import type { EnergySnapshotItem } from '@/lib/reflection'

interface EnergySnapshotProps {
  items: EnergySnapshotItem[]
}

function levelLabel(value: number): string {
  if (value <= 2) return 'Low'
  if (value <= 3) return 'Moderate'
  return 'Good'
}

export function EnergySnapshot({ items }: EnergySnapshotProps) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.4,
            delay: prefersReducedMotion ? 0 : index * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="rounded-2xl bg-surface-solid p-4 ring-1 ring-border"
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-text">{item.label}</span>
            <span className="text-xs text-text-muted">{levelLabel(item.value)}</span>
          </div>

          <div
            className="flex gap-1"
            role="img"
            aria-label={`${item.label}: ${item.value} out of 5`}
          >
            {Array.from({ length: 5 }, (_, dotIndex) => {
              const filled = dotIndex < item.value
              return (
                <span
                  key={dotIndex}
                  className={cn(
                    'h-2.5 flex-1 rounded-full transition-colors',
                    filled ? item.colorClass : 'bg-cream-dark',
                  )}
                />
              )
            })}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
