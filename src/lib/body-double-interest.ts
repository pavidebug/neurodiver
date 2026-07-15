import { doc, serverTimestamp, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

const BODY_DOUBLE_INTEREST_COLLECTION = 'bodyDoubleInterest'

export interface BodyDoubleInterestInput {
  userId: string
  email: string
  isGuest: boolean
}

export function isValidBodyDoubleEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

export async function saveBodyDoubleInterest(
  input: BodyDoubleInterestInput,
): Promise<void> {
  const email = input.email.trim().toLowerCase()

  await setDoc(
    doc(db, BODY_DOUBLE_INTEREST_COLLECTION, input.userId),
    {
      userId: input.userId,
      email,
      isGuest: input.isGuest,
      source: 'body_double',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
