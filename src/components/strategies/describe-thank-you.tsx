import { Button } from '@/components/ui/button'

interface DescribeThankYouProps {
  requestId: string
  onBack: () => void
}

export function DescribeThankYou({ onBack }: DescribeThankYouProps) {
  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface-solid px-5 py-8">
      <header className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-text">
          Nothing was sent or saved.
        </h2>
        <p className="text-base leading-relaxed text-text-muted">
          You don&apos;t need to have the perfect words.
        </p>
        <p className="text-base leading-relaxed text-text-muted">
          This Open Day test keeps your answers only on this screen. Returning
          to the deck clears them.
        </p>
      </header>

      <Button
        type="button"
        className="w-full"
        onClick={onBack}
      >
        Back to Strategy Navigator
      </Button>
    </div>
  )
}
