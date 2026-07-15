import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthLoadingScreen } from '@/components/auth/auth-loading-screen'
import { useFeatureConfig } from '@/context/feature-config-context'
import type { ConfigurablePageKey } from '@/types/feature-config'

const PAGE_PATHS: Array<[ConfigurablePageKey, string]> = [
  ['today', '/home'],
  ['strategies', '/strategies'],
  ['bodyDouble', '/body-double'],
]

export function FeaturePageGate({ page, children }: { page: ConfigurablePageKey; children: ReactNode }) {
  const { loading, isPageEnabled } = useFeatureConfig()

  if (loading) return <AuthLoadingScreen />
  if (isPageEnabled(page)) return children

  const fallback = PAGE_PATHS.find(([key]) => key !== page && isPageEnabled(key))?.[1] ?? '/profile'
  return <Navigate to={fallback} replace />
}
