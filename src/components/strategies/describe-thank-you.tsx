import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { updateFreeTextRequestNotify } from '@/lib/strategy-analytics'

interface DescribeThankYouProps {
  requestId: string
  onBack: () => void
}

export function DescribeThankYou({ requestId, onBack }: DescribeThankYouProps) {
  const [notifyWhenAvailable, setNotifyWhenAvailable] = useState(false)
  const [pending, setPending] = useState(false)

  const handleBack = async () => {
    setPending(true)

    try {
      await updateFreeTextRequestNotify(requestId, notifyWhenAvailable)
    } catch {
      // Non-blocking — still let the user leave
    } finally {
      setPending(false)
      onBack()
    }
  }

  return (
    <div className="space-y-6 rounded-2xl border border-border bg-surface-solid px-5 py-8">
      <header className="space-y-4">
        <h2 className="font-display text-2xl font-semibold text-text">
          Thank you for sharing.
        </h2>
        <p className="text-base leading-relaxed text-text-muted">
          You don&apos;t need to have the perfect words.
        </p>
        <p className="text-base leading-relaxed text-text-muted">
          Sometimes describing what happened is enough to help us find a starting
          point.
        </p>
        <p className="text-base leading-relaxed text-text-muted">
          We don&apos;t have the right strategy for this yet, but experiences like
          yours help us build better support for everyone.
        </p>
        <p className="text-base leading-relaxed text-text-muted">
          We&apos;ll use anonymous insights to improve NeuroDiver over time.
        </p>
      </header>

      <label className="flex items-start gap-3 rounded-2xl bg-cream px-4 py-4">
        <Switch
          checked={notifyWhenAvailable}
          onCheckedChange={setNotifyWhenAvailable}
          aria-label="Let me know if a strategy for this becomes available"
        />
        <span className="text-sm leading-relaxed text-text">
          Let me know if a strategy for this becomes available.
        </span>
      </label>

      <Button
        type="button"
        className="w-full"
        disabled={pending}
        onClick={() => void handleBack()}
      >
        {pending ? 'Saving…' : 'Back to Strategy Navigator'}
      </Button>
    </div>
  )
}
