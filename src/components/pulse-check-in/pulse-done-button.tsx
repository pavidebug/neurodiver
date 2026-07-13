import { ArrowRight, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PulseDoneButtonProps {
  disabled?: boolean
  loading?: boolean
  onClick: () => void
}

export function PulseDoneButton({ disabled, loading, onClick }: PulseDoneButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        'group flex w-full items-center gap-3 rounded-2xl bg-green px-5 py-4 text-left text-white shadow-md transition-all',
        'hover:bg-green-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange',
        'disabled:cursor-not-allowed disabled:opacity-50',
      )}
    >
      <Sparkles className="h-5 w-5 shrink-0 opacity-80" aria-hidden="true" />
      <span className="flex-1">
        <span className="block font-display text-lg font-semibold">
          {loading ? 'Saving…' : 'Done'}
        </span>
        <span className="block text-xs text-white/80">Save my check-in</span>
      </span>
      <span
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform group-hover:translate-x-0.5"
        aria-hidden="true"
      >
        <ArrowRight className="h-5 w-5" />
      </span>
    </button>
  )
}
