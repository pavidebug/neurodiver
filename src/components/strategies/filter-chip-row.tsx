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
      <h2 className="text-sm font-medium text-text-muted">{label}</h2>
      {layout === 'wrap' ? (
        <div className="flex flex-wrap gap-2 [&_button]:px-3 [&_button]:py-2 [&_button]:text-xs sm:[&_button]:px-4 sm:[&_button]:py-2.5 sm:[&_button]:text-sm">
          {children}
        </div>
      ) : (
        <div className="-mx-5 overflow-x-auto px-5 pb-1 lg:mx-0 lg:px-0">
          <div className="flex w-max min-w-full gap-2">{children}</div>
        </div>
      )}
    </section>
  )
}

interface SelectableChipProps {
  label: string
  selected?: boolean
  onClick: () => void
}

export function SelectableChip({
  label,
  selected = false,
  onClick,
}: SelectableChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'shrink-0 rounded-full px-4 py-2.5 text-sm font-medium transition-colors active:scale-[0.98]',
        selected
          ? 'bg-green text-white shadow-sm'
          : 'bg-surface-solid text-text ring-1 ring-border hover:bg-yellow/30',
      )}
    >
      {label}
    </button>
  )
}
