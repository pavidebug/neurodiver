import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { AnalyticsEventType } from '@/types/product-analytics'

const ANALYTICS_COLLECTION = 'analyticsEvents'

export async function trackAnalyticsEvent(
  userId: string,
  eventType: AnalyticsEventType,
  metadata?: Record<string, string | number | boolean | null>,
): Promise<void> {
  if (!userId) return

  try {
    await addDoc(collection(db, ANALYTICS_COLLECTION), {
      eventType,
      userId,
      createdAt: serverTimestamp(),
      ...(metadata && Object.keys(metadata).length > 0 ? { metadata } : {}),
    })
  } catch {
    // Analytics should never block the user flow.
  }
}
