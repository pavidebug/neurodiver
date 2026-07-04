import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { ReflectionLayout } from '@/components/reflection/reflection-layout'
import {
  useCheckIn,
  type CheckInResult,
} from '@/context/check-in-context'
import { getTodayString } from '@/lib/dates'
import { buildDailyReflection } from '@/lib/reflection'
import {
  clearCachedReflectionResult,
  readCachedReflectionResult,
} from '@/lib/reflection-cache'
import type { BrainStatus } from '@/lib/data'

function resolveReflectionData(
  context: {
    brainStatus: BrainStatus | null
    todayAnswers: Record<string, number> | null
  },
  navigationState: CheckInResult | null,
  cachedState: CheckInResult | null,
) {
  const brainStatus =
    context.brainStatus ??
    navigationState?.brainStatus ??
    cachedState?.brainStatus ??
    null

  const answers =
    context.todayAnswers ??
    navigationState?.answers ??
    cachedState?.answers ??
    null

  return { brainStatus, answers }
}

export function DailyReflectionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigationState = location.state as CheckInResult | null
  const today = getTodayString()
  const cachedState = readCachedReflectionResult(today)

  const {
    brainStatus,
    todayAnswers,
    todayIntention,
    loading,
    saveTodayIntention,
    savingIntention,
  } = useCheckIn()

  const [intention, setIntention] = useState('')
  const [intentionSaved, setIntentionSaved] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { brainStatus: resolvedBrainStatus, answers: resolvedAnswers } =
    resolveReflectionData(
      { brainStatus, todayAnswers },
      navigationState,
      cachedState,
    )

  const canShowReflection = Boolean(resolvedBrainStatus && resolvedAnswers)

  useEffect(() => {
    setIntention(todayIntention)
  }, [todayIntention])

  useEffect(() => {
    if (!canShowReflection || intention === todayIntention) {
      return
    }

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    setIntentionSaved(false)

    saveTimerRef.current = setTimeout(() => {
      void saveTodayIntention(intention)
        .then(() => setIntentionSaved(true))
        .catch(() => setIntentionSaved(false))
    }, 700)

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [intention, todayIntention, canShowReflection, saveTodayIntention])

  const handleContinue = async () => {
    if (intention.trim() !== todayIntention.trim()) {
      await saveTodayIntention(intention)
    }
    clearCachedReflectionResult()
    navigate('/home', { replace: true })
  }

  if (loading && !canShowReflection) {
    return (
      <div className="flex min-h-[60dvh] items-center justify-center">
        <p className="text-sm text-text-muted">Preparing your reflection…</p>
      </div>
    )
  }

  if (!canShowReflection) {
    return (
      <div className="page-enter flex flex-col items-center gap-4 py-12 text-center">
        <p className="max-w-xs text-lg text-text-muted">
          Complete today&apos;s check-in to see your daily reflection.
        </p>
        <Button asChild size="lg">
          <Link to="/check-in">Start Check-in</Link>
        </Button>
      </div>
    )
  }

  const reflection = buildDailyReflection(
    resolvedAnswers!,
    resolvedBrainStatus!,
    today,
  )

  return (
    <ReflectionLayout
      status={reflection.status}
      brainStatusTitle={resolvedBrainStatus!.title}
      summary={reflection.summary}
      energySnapshot={reflection.energySnapshot}
      recommendation={reflection.recommendation}
      quote={reflection.quote}
      intention={intention}
      onIntentionChange={setIntention}
      onContinue={handleContinue}
      savingIntention={savingIntention}
      intentionSaved={intentionSaved}
    />
  )
}
