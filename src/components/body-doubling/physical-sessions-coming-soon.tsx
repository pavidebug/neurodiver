import { MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const PHYSICAL_SESSIONS = [
  {
    id: 'saturday-reset',
    name: 'Saturday Reset',
    description:
      "Quiet weekend co-working for tasks you've been putting off.",
    tags: ['Quiet', 'Gentle', 'Low-pressure'],
  },
  {
    id: 'life-admin-club',
    name: 'Life Admin Club',
    description:
      'Emails, forms, budgeting, applications and adulting tasks — done together.',
    tags: ['Focused', 'Beginner-friendly', 'Gentle'],
  },
  {
    id: 'sunday-planning',
    name: 'Sunday Planning Session',
    description: 'A gentle space to plan the week before Monday arrives.',
    tags: ['Quiet', 'Gentle', 'Low-pressure'],
  },
] as const

interface PhysicalSessionsComingSoonProps {
  className?: string
  variant?: 'standalone' | 'tab'
}

export function PhysicalSessionsComingSoon({
  className,
  variant = 'standalone',
}: PhysicalSessionsComingSoonProps) {
  const isTab = variant === 'tab'

  return (
    <section
      aria-labelledby={isTab ? undefined : 'physical-sessions-heading'}
      className={cn(
        'space-y-5 lg:space-y-6',
        isTab && 'rounded-[1.75rem] border border-[#2F5D50]/15 bg-[#F9F7F2]/70 p-3 ring-1 ring-white/60 sm:p-4 lg:p-5',
        className,
      )}
    >
      {!isTab ? (
        <div className="space-y-2">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-muted text-green">
              <MapPin className="h-5 w-5" aria-hidden="true" />
            </span>
            <div className="min-w-0 space-y-1.5">
              <h2
                id="physical-sessions-heading"
                className="font-display text-xl font-semibold text-[#1F2A24] lg:text-2xl"
              >
                Physical Focus Together Sessions
              </h2>
              <p className="max-w-2xl text-sm leading-relaxed text-[#6B6B63] lg:text-base">
                In-person co-working spaces for quiet focus, life admin and weekend resets.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2 lg:gap-6">
        {PHYSICAL_SESSIONS.map((session, index) => (
          <article
            key={session.id}
            className="flex flex-col rounded-[1.5rem] border border-[#2F5D50]/10 bg-white p-5 shadow-[0_6px_24px_rgba(47,93,80,0.06)] lg:p-6"
          >
            <div className="flex gap-3">
              <span className={cn(
                'flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl',
                index % 2 === 0 ? 'bg-[#E8F0EB] text-[#2F5D50]' : 'bg-lavender-muted text-lavender-deep',
              )}>
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <span className="inline-flex w-fit rounded-full bg-lavender-muted px-2.5 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-lavender-deep uppercase">
                  Coming soon
                </span>
                <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-[#1F2A24]">
                  {session.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[#6B6B63]">
                  {session.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {session.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-[#F9F7F2] px-2.5 py-0.5 text-[10px] font-medium text-[#6B6B63]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled
              className="mt-4 w-full cursor-not-allowed rounded-2xl bg-[#F4E7BE] px-4 py-3 text-sm font-medium text-[#1F2A24] opacity-65"
            >
              Coming soon
            </button>
          </article>
        ))}
      </div>

    </section>
  )
}
