import { Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export function EncouragementBanner({ large = false }: { large?: boolean }) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-3xl border border-lavender/30 bg-gradient-to-r from-lavender-muted via-[#F5EDE8] to-lavender-muted shadow-sm',
        large ? 'p-5 sm:p-6 lg:p-8' : 'p-5 sm:p-6',
      )}
    >
      <div className="relative flex items-start gap-3 sm:items-center sm:gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-lavender/50 text-lavender-deep">
          <Sparkles className="h-5 w-5" aria-hidden="true" />
        </span>
        <p
          className={cn(
            'leading-relaxed text-text',
            large ? 'text-base sm:text-lg lg:text-xl' : 'text-base sm:text-lg',
          )}
        >
          <span className="font-medium text-text">You&apos;ve got this.</span>{' '}
          <span className="text-text-muted">
            Progress isn&apos;t always linear—and that&apos;s okay.
          </span>
        </p>
      </div>
    </div>
  )
}
