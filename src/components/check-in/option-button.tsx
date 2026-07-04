import { cn } from '@/lib/utils'
import type { CheckInOption } from '@/lib/data'

interface OptionButtonProps {
  option: CheckInOption
  selected: boolean
  onSelect: (value: number) => void
}

export function OptionButton({ option, selected, onSelect }: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={selected}
      className={cn(
        'flex min-h-16 w-full flex-col items-start rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 ease-out active:scale-[0.99]',
        selected
          ? 'border-green bg-green-muted shadow-sm'
          : 'border-border bg-surface hover:border-yellow hover:bg-yellow/20',
      )}
    >
      <span className="text-base font-semibold text-text">{option.label}</span>
      <span className="text-sm text-text-muted">{option.description}</span>
    </button>
  )
}
