import { chipBase, chipDefault, chipSelected, typeHelper } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

interface FilterChipRowProps {
  label: string
  children: React.ReactNode
  className?: string
  /** `wrap` stacks chips in 2–3 rows; `scroll` keeps a single horizontal row */
  layout?: 'scroll' | 'wrap'
}

export function FilterChipRow({
  label,
  children,
  className,
  layout = 'scroll',
}: FilterChipRowProps) {
  return (
    <section className={cn('space-y-3', className)}>
      <h2 className={typeHelper}>{label}</h2>
      {layout === 'wrap' ? (
        <div className="flex flex-wrap gap-2">{children}</div>
      ) : (
        <div className="-mx-5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:px-0">
          <div className="flex w-max min-w-full flex-wrap gap-2">{children}</div>
        </div>
      )}
    </section>
  )
}

interface SelectableChipProps {
  label: string
  emoji?: string
  selected?: boolean
  onClick: () => void
}

export function SelectableChip({
  label,
  emoji,
  selected = false,
  onClick,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(chipBase, selected ? chipSelected : chipDefault)}
    >
      {emoji ? (
        <span className="text-[1.625rem] leading-none sm:text-3xl" aria-hidden="true">
          {emoji}
        </span>
      ) : null}
      <span>{label}</span>
    </button>
  )
}
