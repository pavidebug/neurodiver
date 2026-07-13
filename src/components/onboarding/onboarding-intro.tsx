import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  ONBOARDING_INTRO_SUBTITLE,
  ONBOARDING_INTRO_TITLE,
} from '@/data/onboarding-steps'

interface OnboardingIntroProps {
  onBegin: () => void
}

export function OnboardingIntro({ onBegin }: OnboardingIntroProps) {
  return (
    <div className="onboarding-step-enter flex min-h-[50vh] flex-col justify-center space-y-8 text-center sm:min-h-[55vh]">
      <div className="space-y-4">
        <h1 className="font-display text-[2rem] font-semibold leading-tight text-text sm:text-4xl">
          {ONBOARDING_INTRO_TITLE}
        </h1>
        <p className="mx-auto max-w-md text-base leading-relaxed text-text-muted sm:text-lg">
          {ONBOARDING_INTRO_SUBTITLE}
        </p>
      </div>

      <Button size="lg" className="mx-auto w-full max-w-sm rounded-full" onClick={onBegin}>
        Let&apos;s begin
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </Button>
    </div>
  )
}
