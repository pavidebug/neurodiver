import { Loader2 } from 'lucide-react'
import { CheckInCalmIllustration } from '@/components/illustrations'

export function CheckInFindingSupport() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-8 text-center fade-in">
      <CheckInCalmIllustration className="h-40 w-56 opacity-90 sm:h-48 sm:w-64" />
      <div className="space-y-3">
        <Loader2
          className="mx-auto h-8 w-8 animate-spin text-green/70"
          aria-hidden="true"
        />
        <p className="font-display text-2xl font-semibold text-text sm:text-3xl">
          Finding today&apos;s support…
        </p>
        <p className="text-sm text-text-muted">Just a moment while we gather something gentle.</p>
      </div>
    </div>
  )
}
