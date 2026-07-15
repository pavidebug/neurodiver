import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GuidedCheckInFlow } from '@/components/pulse-check-in/guided-check-in-flow'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { getDisplayName } from '@/lib/onboarding'

export function WorkCheckInPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    hasCheckedInToday,
    profile,
    loading,
    submitting,
    error,
    clearError,
    submitPulseCheckIn,
  } = useWorkEnergy()

  const displayName = getDisplayName(profile, user?.displayName ?? user?.email)

  useEffect(() => {
    if (!loading && hasCheckedInToday) {
      navigate('/home', { replace: true })
    }
  }, [hasCheckedInToday, loading, navigate])

  if (loading) {
    return (
      <div className="flex min-h-[calc(100dvh-2rem)] items-center justify-center">
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (hasCheckedInToday) {
    return null
  }

  return (
    <GuidedCheckInFlow
      displayName={displayName}
      submitting={submitting}
      error={error}
      onSubmit={async (input) => {
        clearError()
        return submitPulseCheckIn(input)
      }}
      onSkip={() => navigate('/home')}
    />
  )
}
