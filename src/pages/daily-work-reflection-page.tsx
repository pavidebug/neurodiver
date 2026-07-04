import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { WorkReflectionLayout } from '@/components/work-reflection/work-reflection-layout'
import { useWorkEnergy } from '@/context/work-energy-context'
import { getTodayString } from '@/lib/dates'
import { buildWorkReflection } from '@/lib/work-reflection'
import {
  clearCachedWorkReflection,
  readCachedWorkReflection,
} from '@/lib/work-reflection-cache'
import type { WorkCheckIn } from '@/types/work-energy'

export function DailyWorkReflectionPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const today = getTodayString()
  const { todayCheckIn } = useWorkEnergy()

  const navigationCheckIn = (location.state as { checkIn?: WorkCheckIn } | null)
    ?.checkIn
  const cachedCheckIn = readCachedWorkReflection(today)

  const checkIn = navigationCheckIn ?? cachedCheckIn ?? todayCheckIn ?? null

  const handleContinue = () => {
    clearCachedWorkReflection()
    navigate('/home', { replace: true })
  }

  if (!checkIn) {
    return (
      <div className="page-enter flex min-h-[60dvh] flex-col items-center justify-center gap-4 px-5 text-center">
        <p className="max-w-xs text-lg leading-relaxed text-text-muted">
          Complete today&apos;s work check-in to see your daily reflection.
        </p>
        <Button asChild size="lg">
          <Link to="/work-check-in">Start Work Check-in</Link>
        </Button>
      </div>
    )
  }

  const reflection = buildWorkReflection(checkIn)

  return (
    <WorkReflectionLayout
      energySummary={reflection.energySummary}
      reflection={reflection}
      onContinue={handleContinue}
    />
  )
}
