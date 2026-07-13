import { LandscapeIllustration } from '@/components/illustrations'

export function PulseCheckInFooter() {
  return (
    <footer className="hidden items-center justify-between gap-4 rounded-2xl bg-yellow-soft/60 px-5 py-4 lg:flex">
      <p className="text-sm text-text-muted">
        <span aria-hidden="true">🌱</span> Small check-ins, big difference.{' '}
        <span aria-hidden="true">💛</span>
      </p>
      <LandscapeIllustration className="h-10 w-24 shrink-0" />
    </footer>
  )
}
