import { cn } from '@/lib/utils'
import type { WorkCheckInScaleOption } from '@/types/work-energy'

interface ScaleOptionProps {
  option: WorkCheckInScaleOption
  selected: boolean
  onSelect: (value: number) => void
}

export function ScaleOption({ option, selected, onSelect }: ScaleOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={selected}
      className={cn(
        'flex min-h-14 w-full items-center gap-4 rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 ease-out active:scale-[0.99]',
        selected
          ? 'border-green bg-green-muted shadow-sm'
          : 'border-border bg-surface hover:border-yellow hover:bg-yellow/20',
      )}
    >
      {option.emoji && (
        <span className="text-2xl leading-none" aria-hidden="true">
          {option.emoji}
        </span>
      )}
      <span className="text-lg font-medium text-text">{option.label}</span>
    </button>
  )
}
