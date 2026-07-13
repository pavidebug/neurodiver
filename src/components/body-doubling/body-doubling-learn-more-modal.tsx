import { createPortal } from 'react-dom'
import { useEffect } from 'react'
import {
  ArrowUpRight,
  CameraOff,
  Coffee,
  MessageCircle,
  Users,
  Video,
  X,
} from 'lucide-react'
import { CommunityIllustration } from '@/components/illustrations'
import { cn } from '@/lib/utils'

export const BODY_DOUBLING_LEARN_MORE_URL = 'https://add.org/the-body-double/'

const SESSION_EXPECTATIONS = [
  { icon: Video, label: 'Quiet co-working' },
  { icon: CameraOff, label: 'Cameras optional' },
  { icon: MessageCircle, label: 'Gentle check-ins' },
  { icon: Coffee, label: 'Short breaks' },
  { icon: Users, label: 'No pressure to socialize' },
] as const

interface BodyDoublingLearnMoreModalProps {
  open: boolean
  onClose: () => void
}

export function BodyDoublingLearnMoreModal({ open, onClose }: BodyDoublingLearnMoreModalProps) {
  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center lg:items-center lg:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#1F2A24]/30 backdrop-blur-[2px]"
        aria-label="Close"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="body-doubling-learn-more-title"
        className={cn(
          'popup-enter relative z-10 flex max-h-[min(92dvh,720px)] w-full flex-col',
          'rounded-t-[1.75rem] bg-gradient-to-b from-[#F9F7F2] to-white shadow-[0_-8px_40px_rgba(47,93,80,0.12)]',
          'lg:max-w-lg lg:rounded-[1.75rem] lg:shadow-[0_12px_48px_rgba(47,93,80,0.15)]',
        )}
      >
        <div className="flex shrink-0 justify-center pt-3 lg:hidden" aria-hidden="true">
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>

        <div className="flex items-start justify-between gap-3 px-6 pt-4 lg:px-7 lg:pt-6">
          <CommunityIllustration className="h-14 w-14 shrink-0" />
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-text-muted transition-colors hover:bg-cream-dark/80"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4 lg:px-7">
          <h2
            id="body-doubling-learn-more-title"
            className="font-display text-2xl font-semibold text-text lg:text-[1.75rem]"
          >
            What is Body Doubling?
          </h2>

          <div className="mt-4 space-y-4 text-sm leading-relaxed text-text-muted lg:text-base">
            <p>
              Body doubling is working alongside another person—virtually or in person—to make it
              easier to start, stay focused and finish tasks.
            </p>
            <p>It isn&apos;t about being supervised or constantly talking.</p>
            <p>
              Many people find that simply having someone else quietly present makes difficult
              tasks easier to begin.
            </p>
          </div>

          <div className="mt-6 rounded-[1.25rem] border border-green/15 bg-green-muted/35 px-5 py-5">
            <p className="text-sm font-medium text-text">What to expect in NeuroDiver sessions:</p>
            <ul className="mt-4 space-y-3">
              {SESSION_EXPECTATIONS.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3 text-sm text-text-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 text-green">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex shrink-0 flex-col-reverse gap-2.5 border-t border-border/50 px-6 py-5 sm:flex-row sm:justify-end lg:px-7 lg:py-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl border border-green/20 bg-white px-5 py-3.5 text-sm font-medium text-text transition-colors hover:bg-cream active:scale-[0.98] sm:min-w-[7rem]"
          >
            Close
          </button>
          <a
            href={BODY_DOUBLING_LEARN_MORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green px-5 py-3.5 text-sm font-medium text-white shadow-[0_4px_16px_rgba(47,93,80,0.2)] transition-all hover:bg-green-soft active:scale-[0.98] sm:min-w-[12rem]"
          >
            Learn more online
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </div>,
    document.body,
  )
}
