import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { WorkReflectionContent } from '@/lib/work-reflection'

interface WorkReflectionLayoutProps {
  energySummary: string
  reflection: WorkReflectionContent
  onContinue: () => void
}

export function WorkReflectionLayout({
  energySummary,
  reflection,
  onContinue,
}: WorkReflectionLayoutProps) {
  return (
    <div className="page-enter mx-auto flex min-h-[80dvh] max-w-md flex-col gap-10 py-2 pb-8">
      <header className="space-y-4 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          Daily Work Reflection
        </p>
        <div className="rounded-3xl bg-yellow/25 px-8 py-10 ring-1 ring-yellow/40">
          <p className="mb-2 text-sm font-medium uppercase tracking-widest text-text-muted">
            Today&apos;s energy
          </p>
          <p className="font-display text-2xl font-semibold leading-snug text-text">
            {energySummary}
          </p>
        </div>
      </header>

      <section className="space-y-3 px-1">
        <h2 className="font-display text-xl font-semibold text-text">
          Today&apos;s reflection
        </h2>
        <p className="text-lg leading-relaxed text-text">{reflection.insight}</p>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-text">
          What you noticed today
        </h2>
        <div className="space-y-3">
          {reflection.snapshot.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-surface-solid px-5 py-4"
            >
              <p className="text-sm text-text-muted">{item.label}</p>
              <p className="mt-1 text-lg font-medium text-text">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="experiment-heading">
        <Card className="overflow-hidden border-green/20 bg-green-muted/30">
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
        <Button size="lg" className="w-full" onClick={onContinue}>
          Back to Dashboard
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
