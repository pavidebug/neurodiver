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
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        aria-hidden="true"
      >
        <svg
          className="absolute bottom-0 right-0 h-full w-2/3 max-w-md"
          viewBox="0 0 300 80"
          preserveAspectRatio="xMaxYMax slice"
          fill="none"
        >
          <path
            d="M80 80 C120 40 180 50 220 30 L300 20 L300 80 L0 80Z"
            fill="#D4C8E8"
            fillOpacity="0.5"
          />
          <path
            d="M140 80 C180 55 220 60 260 45 L300 40 L300 80 L60 80Z"
            fill="#C4B5DC"
            fillOpacity="0.35"
          />
          <path d="M248 38 L252 22 L256 38 Z" fill="#9B8BB8" fillOpacity="0.5" />
          <line
            x1="252"
            y1="22"
            x2="252"
            y2="38"
            stroke="#9B8BB8"
            strokeWidth="1.5"
            opacity="0.4"
          />
        </svg>
      </div>
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
