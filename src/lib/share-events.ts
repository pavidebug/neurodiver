import {
  collection,
  doc,
  increment,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ShareEventInput } from '@/types/share-events'

const SHARE_EVENTS_COLLECTION = 'shareEvents'
const USER_STATS_DOC = 'summary'

export async function trackShareEvent(input: ShareEventInput): Promise<void> {
  const batch = writeBatch(db)

  const eventRef = doc(collection(db, SHARE_EVENTS_COLLECTION))
  batch.set(eventRef, {
    userId: input.userId,
    createdAt: serverTimestamp(),
    shareType: input.shareType,
    templateId: input.templateId,
    sourceScreen: input.sourceScreen,
    isGuest: false,
  })

  batch.set(
    doc(db, 'users', input.userId, 'stats', USER_STATS_DOC),
    { shareCount: increment(1) },
    { merge: true },
  )

  await batch.commit()
}

/** Best-effort analytics — never block the share UX. */
export function logShareEvent(input: ShareEventInput): void {
  void trackShareEvent(input).catch(() => {
    // Analytics failure is non-fatal
  })
}
