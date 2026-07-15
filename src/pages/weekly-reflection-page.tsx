import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { GuidedWeeklyResetFlow } from '@/components/weekly-reset/guided-weekly-reset-flow'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import {
  fetchWeeklyReflectionForWeek,
  submitWeeklyReflection,
} from '@/lib/weekly-reflection'
import type { WeeklyReflection } from '@/types/weekly-reflection'
import { countWeekCheckIns } from '@/lib/weekly-report'
import { WEEKLY_REPORT_MIN_CHECK_INS } from '@/types/work-energy'

export function WeeklyReflectionPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { currentWeekId, checkIns, loading: checkInsLoading } = useWorkEnergy()
  const [completedReflection, setCompletedReflection] = useState<WeeklyReflection | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    let cancelled = false

    void fetchWeeklyReflectionForWeek(user.uid, currentWeekId)
      .then((reflection) => {
        if (!cancelled) setCompletedReflection(reflection)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [currentWeekId, user])

  if (loading || checkInsLoading) {
    return (
      <div className="flex min-h-[calc(100dvh-2rem)] items-center justify-center">
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  const previewOnly = countWeekCheckIns(checkIns) < WEEKLY_REPORT_MIN_CHECK_INS

  return (
    <div className="page-enter pb-6">
      <GuidedWeeklyResetFlow
        saving={saving}
        error={error}
        completedReflection={completedReflection}
        previewOnly={previewOnly}
        onExit={() => navigate('/home')}
        onSubmit={async (input) => {
          if (previewOnly) throw new Error('Complete three check-ins to save a weekly reset')
          if (!user) throw new Error('Sign in required')
          setSaving(true)
          setError(null)
          try {
            const reflection = await submitWeeklyReflection(user.uid, input)
            setCompletedReflection(reflection)
            return reflection
          } catch {
            setError('Unable to save your weekly reset. Please try again.')
            throw new Error('save failed')
          } finally {
            setSaving(false)
          }
        }}
      />
    </div>
  )
}
