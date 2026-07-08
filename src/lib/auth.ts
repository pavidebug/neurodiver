import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { trackAnalyticsEvent } from '@/lib/product-analytics'

const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: 'select_account' })

function isNewAuthUser(user: User): boolean {
  return user.metadata.creationTime === user.metadata.lastSignInTime
}

export async function signInAsGuest(): Promise<User> {
  const result = await signInAnonymously(auth)
  void trackAnalyticsEvent(result.user.uid, 'user_signed_up', { method: 'guest' })
  return result.user
}

export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider)
  if (isNewAuthUser(result.user)) {
    void trackAnalyticsEvent(result.user.uid, 'user_signed_up', {
      method: 'google',
      email: result.user.email,
    })
  }
  return result.user
}

export async function signInWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export async function signUpWithEmail(
  email: string,
  password: string,
): Promise<User> {
  const result = await createUserWithEmailAndPassword(auth, email, password)
  void trackAnalyticsEvent(result.user.uid, 'user_signed_up', {
    method: 'email',
    email,
  })
  return result.user
}

export async function signOut(): Promise<void> {
  await firebaseSignOut(auth)
}

export function getAuthErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/popup-closed-by-user': 'Sign-in was cancelled.',
    'auth/popup-blocked': 'Pop-up was blocked. Allow pop-ups and try again.',
    'auth/too-many-requests': 'Too many attempts. Please wait and try again.',
    'auth/network-request-failed':
      'Network error. Check your connection and try again.',
    'auth/operation-not-allowed':
      'Guest sign-in is not enabled. Please use email or Google instead.',
  }

  return messages[code] ?? 'Something went wrong. Please try again.'
}
