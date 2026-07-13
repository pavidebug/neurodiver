import { Check } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface WeeklyResetSelectCardProps {
  label: string
  icon?: LucideIcon
  selected: boolean
  onSelect: () => void
}

export function WeeklyResetSelectCard({
  label,
  icon: Icon,
  selected,
  onSelect,
}: WeeklyResetSelectCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        'flex w-full items-start gap-4 rounded-[1.25rem] border-2 px-5 py-4 text-left transition-all duration-200',
        'hover:border-lavender/40 hover:shadow-sm active:scale-[0.99]',
        selected
          ? 'border-lavender-deep bg-lavender-muted/50 shadow-[0_4px_20px_rgba(122,107,150,0.12)]'
          : 'border-border/60 bg-white/80',
      )}
    >
      {Icon ? (
        <span
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            selected ? 'bg-lavender-deep/15 text-lavender-deep' : 'bg-cream text-text-muted',
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      ) : null}
      <span className="flex-1 pt-1.5 text-base leading-relaxed font-medium text-text sm:text-[1.0625rem]">
        {label}
      </span>
      <span
        className={cn(
          'mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors',
          selected ? 'border-lavender-deep bg-lavender-deep text-white' : 'border-border bg-transparent',
        )}
        aria-hidden="true"
      >
        {selected ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
      </span>
    </button>
  )
}

interface WeeklyResetChipProps {
  label: string
  selected: boolean
  onToggle: () => void
}

export function WeeklyResetChip({ label, selected, onToggle }: WeeklyResetChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onToggle}
      className={cn(
        'rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.98]',
        selected
          ? 'border-lavender-deep bg-lavender-muted text-lavender-deep shadow-sm'
          : 'border-border/70 bg-white/80 text-text hover:border-lavender/30 hover:bg-cream',
      )}
    >
      {label}
    </button>
  )
}
