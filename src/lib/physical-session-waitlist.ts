import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const PHYSICAL_SESSION_WAITLIST_COLLECTION = 'physicalSessionWaitlist'

export interface PhysicalSessionWaitlistInput {
  userId: string
  email: string
}

export function isValidWaitlistEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export async function joinPhysicalSessionWaitlist(
  input: PhysicalSessionWaitlistInput,
): Promise<void> {
  const email = input.email.trim().toLowerCase()

  await setDoc(
    doc(db, PHYSICAL_SESSION_WAITLIST_COLLECTION, input.userId),
    {
      userId: input.userId,
      email,
      source: 'physical_sessions',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
