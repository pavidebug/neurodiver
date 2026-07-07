import { ArrowRight } from 'lucide-react'
import { ReflectionSnapshotGrid } from '@/components/work-reflection/reflection-snapshot-grid'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { WorkReflectionContent } from '@/lib/work-reflection'
import type { WorkCheckIn } from '@/types/work-energy'

interface WorkReflectionLayoutProps {
  checkIn: WorkCheckIn
  reflection: WorkReflectionContent
  onContinue: () => void
}

export function WorkReflectionLayout({
  checkIn,
  reflection,
  onContinue,
}: WorkReflectionLayoutProps) {
  return (
    <div className="page-enter mx-auto flex min-h-[80dvh] max-w-4xl flex-col gap-8 bg-cream py-2 pb-8">
      <header className="space-y-1 text-center lg:text-left">
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          What you noticed today
        </h1>
        <p className="text-base text-text-muted">
          A quick snapshot of your day.
        </p>
      </header>

      <ReflectionSnapshotGrid checkIn={checkIn} />

      <section
        aria-label="Encouragement"
        className="rounded-3xl bg-yellow/25 px-6 py-8 text-center shadow-sm ring-1 ring-yellow/30"
      >
        <p className="font-display text-xl font-semibold text-text">
          You did your best today.
        </p>
        <p className="mt-2 text-base leading-relaxed text-text-muted">
          Not every day has to be perfect.
        </p>
      </section>

      <section aria-labelledby="experiment-heading">
        <Card className="overflow-hidden border-green/20 bg-green-muted/30 shadow-sm">
          <CardContent className="space-y-3 p-6">
            <p
              id="experiment-heading"
              className="text-xs font-semibold uppercase tracking-widest text-green"
            >
              A small experiment for tomorrow
            </p>
            <p className="text-base leading-relaxed text-text">
              {reflection.experiment}
            </p>
          </CardContent>
        </Card>
      </section>

      <div className="mt-auto pt-2">
        <Button size="lg" className="w-full lg:w-auto lg:min-w-52" onClick={onContinue}>
          Back to Dashboard
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
