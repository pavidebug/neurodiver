import { cn } from '@/lib/utils'
import type { WorkCheckInQuestionOption } from '@/types/work-energy'

interface ChoiceOptionProps {
  option: WorkCheckInQuestionOption
  selected: boolean
  onSelect: (value: string) => void
}

export function ChoiceOption({ option, selected, onSelect }: ChoiceOptionProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(option.value)}
      aria-pressed={selected}
      className={cn(
        'flex min-h-14 w-full items-center rounded-2xl border-2 px-5 py-4 text-left transition-all duration-200 ease-out active:scale-[0.99]',
        selected
          ? 'border-green bg-green-muted shadow-sm'
          : 'border-border bg-surface hover:border-yellow hover:bg-yellow/20',
      )}
    >
      <span className="text-lg font-medium text-text">{option.label}</span>
    </button>
  )
}
