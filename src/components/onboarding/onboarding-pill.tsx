import { cn } from '@/lib/utils'

interface OnboardingPillProps {
  label: string
  selected: boolean
  disabled?: boolean
  onToggle: () => void
}

export function OnboardingPill({
  label,
  selected,
  disabled = false,
  onToggle,
}: OnboardingPillProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      disabled={disabled}
      onClick={onToggle}
      className={cn(
        'min-h-11 rounded-full border px-4 py-2.5 text-left text-sm font-medium transition-all duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C17F3A]',
        selected
          ? 'border-[#2D5A3D] bg-[#E8F0EB] text-[#1F2A24] shadow-sm'
          : 'border-[#E5E0D4] bg-white/90 text-[#1F2A24] hover:border-[#2D5A3D]/40 hover:bg-[#FDF8E2]',
        disabled && !selected && 'cursor-not-allowed opacity-50',
      )}
    >
      {label}
    </button>
  )
}
