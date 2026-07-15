import { Navigate, Outlet } from 'react-router-dom'
import { AuthLoadingScreen } from '@/components/auth/auth-loading-screen'
import { useAuth } from '@/context/auth-context'
import { useFeatureConfig } from '@/context/feature-config-context'
import { useWorkEnergy } from '@/context/work-energy-context'

/** Blocks app routes until onboarding is complete (non-guest users only). */
export function OnboardingGate() {
  const { isGuest, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading } = useWorkEnergy()
  const { config, loading: featureConfigLoading } = useFeatureConfig()

  if (authLoading || profileLoading || featureConfigLoading) {
    return <AuthLoadingScreen />
  }

  if (!config.onboarding.enabled || isGuest || profile.onboardingCompleted) {
    return <Outlet />
  }

  return <Navigate to="/onboarding" replace />
}
