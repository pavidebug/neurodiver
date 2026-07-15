import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { subscribeToFeatureConfig } from '@/lib/feature-config'
import { useAuth } from '@/context/auth-context'
import {
  DEFAULT_FEATURE_CONFIG,
  type ConfigurablePageKey,
  type FeatureConfig,
  type FeatureTabKey,
} from '@/types/feature-config'

interface FeatureConfigContextValue {
  config: FeatureConfig
  loading: boolean
  isPageEnabled: (page: ConfigurablePageKey) => boolean
  isSectionEnabled: (page: FeatureTabKey, section: string) => boolean
}

const FeatureConfigContext = createContext<FeatureConfigContextValue | null>(null)

export function FeatureConfigProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth()
  const [config, setConfig] = useState<FeatureConfig>(() => structuredClone(DEFAULT_FEATURE_CONFIG))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading) return
    if (!user) {
      setConfig(structuredClone(DEFAULT_FEATURE_CONFIG))
      setLoading(false)
      return
    }

    setLoading(true)
    return subscribeToFeatureConfig(
      (nextConfig) => {
        setConfig(nextConfig)
        setLoading(false)
      },
      () => setLoading(false),
    )
  }, [authLoading, user])

  const value = useMemo<FeatureConfigContextValue>(
    () => ({
      config,
      loading,
      isPageEnabled: (page) => config[page].enabled,
      isSectionEnabled: (page, section) => config[page].sections[section] !== false,
    }),
    [config, loading],
  )

  return <FeatureConfigContext.Provider value={value}>{children}</FeatureConfigContext.Provider>
}

export function useFeatureConfig() {
  const context = useContext(FeatureConfigContext)
  if (!context) throw new Error('useFeatureConfig must be used within FeatureConfigProvider')
  return context
}
