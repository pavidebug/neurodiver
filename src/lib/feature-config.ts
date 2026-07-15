import { doc, onSnapshot, serverTimestamp, setDoc, type Unsubscribe } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import {
  DEFAULT_FEATURE_CONFIG,
  type FeatureConfig,
  type FeatureTabKey,
} from '@/types/feature-config'

const FEATURE_CONFIG_REF = doc(db, 'appConfig', 'modules')

function mapFeatureConfig(data: Record<string, unknown> | undefined): FeatureConfig {
  const config = structuredClone(DEFAULT_FEATURE_CONFIG)

  for (const pageKey of Object.keys(config) as FeatureTabKey[]) {
    const pageData = data?.[pageKey]
    if (!pageData || typeof pageData !== 'object') continue

    const typedPage = pageData as { enabled?: unknown; sections?: unknown }
    if (typeof typedPage.enabled === 'boolean') {
      config[pageKey].enabled = typedPage.enabled
    }

    if (typedPage.sections && typeof typedPage.sections === 'object') {
      for (const sectionKey of Object.keys(config[pageKey].sections)) {
        const value = (typedPage.sections as Record<string, unknown>)[sectionKey]
        if (typeof value === 'boolean') {
          config[pageKey].sections[sectionKey] = value
        }
      }
    }
  }

  return config
}

export function subscribeToFeatureConfig(
  onData: (config: FeatureConfig) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    FEATURE_CONFIG_REF,
    (snapshot) => onData(mapFeatureConfig(snapshot.data())),
    (error) => {
      onData(structuredClone(DEFAULT_FEATURE_CONFIG))
      onError?.(error)
    },
  )
}

export async function saveFeatureConfig(config: FeatureConfig): Promise<void> {
  await setDoc(
    FEATURE_CONFIG_REF,
    {
      ...config,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
