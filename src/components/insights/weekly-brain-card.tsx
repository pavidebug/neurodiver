import { Link } from 'react-router-dom'
import { ArrowRight, Coffee, NotebookPen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WeeklyBrainCardProps {
  showNewBadge?: boolean
  className?: string
}

export function WeeklyBrainCard({ showNewBadge = false, className }: WeeklyBrainCardProps) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-[1.75rem] border border-[#E8DFD0] bg-gradient-to-br from-[#FBF7F0] via-[#F7F2EA] to-[#F0EBE3] shadow-[var(--shadow-premium)]',
        className,
      )}
    >
      <div className="flex flex-col sm:flex-row">
        <div className="relative flex min-h-[10rem] flex-1 items-center justify-center bg-gradient-to-br from-[#E8DFD0]/60 to-[#D4C4A8]/40 p-6 sm:min-h-0 sm:max-w-[12rem]">
          <div className="flex flex-col items-center gap-3 text-[#8B7355]">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/70 shadow-sm">
              <NotebookPen className="h-8 w-8" aria-hidden="true" />
            </div>
            <Coffee className="h-6 w-6 opacity-60" aria-hidden="true" />
          </div>
        </div>

        <div className="relative flex flex-1 flex-col justify-center gap-4 p-5 sm:p-6 lg:p-8">
          {showNewBadge ? (
            <span className="absolute right-5 top-5 rounded-full bg-orange/15 px-3 py-1 text-xs font-semibold text-orange sm:right-6 sm:top-6">
              New
            </span>
          ) : null}

          <div className="space-y-2 pr-16">
            <h2 className="font-display text-xl font-semibold text-text sm:text-2xl">
              This Week With Your Brain
            </h2>
            <p className="text-sm leading-relaxed text-text-muted sm:text-base">
              Your weekly reset turns the week into a short story — what helped, what felt
              heavy, and one gentle intention for next week.
            </p>
          </div>

          <Button
            asChild
            className="w-fit rounded-full bg-green px-6 hover:bg-green-soft"
          >
            <Link to="/weekly-reflection">
              Open weekly reset
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
