import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ONBOARDING_COMPLETE_BODY,
  ONBOARDING_COMPLETE_TITLE,
} from '@/data/onboarding-steps'

interface OnboardingCompleteProps {
  saving: boolean
  onFinish: () => void
}

export function OnboardingComplete({ saving, onFinish }: OnboardingCompleteProps) {
  return (
    <div className="onboarding-step-enter flex min-h-[50vh] flex-col justify-center space-y-8 text-center sm:min-h-[55vh]">
      <div className="space-y-4">
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-text sm:text-4xl">
          {ONBOARDING_COMPLETE_TITLE}
        </h1>
        <p className="mx-auto max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
          {ONBOARDING_COMPLETE_BODY}
        </p>
      </div>

      <Button
        size="lg"
        className="mx-auto w-full max-w-sm rounded-full"
        disabled={saving}
        onClick={onFinish}
      >
        {saving ? 'Saving…' : 'Start my journey'}
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  )
}
