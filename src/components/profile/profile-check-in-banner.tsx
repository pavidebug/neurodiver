import { Link } from 'react-router-dom'
import { ArrowRight, Sprout } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ProfileCheckInBanner() {
  return (
    <article className="card-premium flex items-center gap-4 rounded-[1.25rem] bg-yellow-soft/70 p-4 shadow-[0_2px_16px_rgba(31,42,36,0.04)] lg:p-5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-green-muted text-green">
        <Sprout className="h-5 w-5" aria-hidden="true" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-text">Haven&apos;t checked in yet</p>
        <p className="text-xs text-text-muted">Take 2 minutes to log your work energy.</p>
      </div>
      <Button
        asChild
        size="icon"
        className="h-11 w-11 shrink-0 rounded-full bg-green hover:bg-green-soft lg:hidden"
      >
        <Link to="/work-check-in" aria-label="Start work check-in">
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Link>
      </Button>
      <Button
        asChild
        className="hidden shrink-0 rounded-full bg-green px-5 hover:bg-green-soft lg:inline-flex"
      >
        <Link to="/work-check-in">
          Start check-in
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  )
}
