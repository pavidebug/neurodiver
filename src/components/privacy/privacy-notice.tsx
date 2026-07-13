import { Lock, Shield } from 'lucide-react'
import { PlantAccentIllustration } from '@/components/illustrations'
import { cn } from '@/lib/utils'

interface PrivacyNoticeProps {
  className?: string
  compact?: boolean
  variant?: 'default' | 'check-in' | 'homepage'
}

export function PrivacyNotice({
  className,
  compact = false,
  variant = 'default',
}: PrivacyNoticeProps) {
  if (variant === 'check-in') {
    return (
      <div
        className={cn(
          'flex items-start gap-3 rounded-2xl border border-green/20 bg-green-muted/50 px-4 py-4',
          className,
        )}
      >
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green" aria-hidden="true" />
        <p className="flex-1 text-sm leading-relaxed text-text-muted">
          Your personal check-ins are private. Individual responses are not shared with
          employers.
        </p>
        <Lock className="h-10 w-10 shrink-0 text-green opacity-80" aria-hidden="true" />
      </div>
    )
  }

  if (variant === 'homepage') {
    return (
      <div
        className={cn(
          'card-premium slide-up flex items-start gap-4 rounded-[1.25rem] border border-green/25 bg-green-muted/25 px-5 py-5 shadow-[0_2px_16px_rgba(45,90,61,0.04)]',
          className,
        )}
        style={{ animationDelay: '120ms' }}
      >
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green" aria-hidden="true" />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-sm font-medium text-text">
            Your personal check-ins stay private.
          </p>
          <p className="text-sm leading-relaxed text-text-muted">
            Only you can see your responses — they&apos;re just for you.
          </p>
        </div>
        <PlantAccentIllustration className="h-12 w-12 shrink-0 opacity-90" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex gap-3 rounded-2xl border border-green/15 bg-green-muted/30 px-4 py-3',
        className,
      )}
    >
      <Shield className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
      <p className={cn('leading-relaxed text-text-muted', compact ? 'text-xs' : 'text-sm')}>
        Your personal check-ins are private. Individual responses are not shared with
        employers.
      </p>
    </div>
  )
}
