import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { FirebaseError } from 'firebase/app'
import { onAuthStateChanged, type User } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import {
  getAuthErrorMessage,
  signInAsGuest,
  signInWithEmail,
  signInWithGoogle,
  signOut as authSignOut,
  signUpWithEmail,
} from '@/lib/auth'

interface AuthContextValue {
  user: User | null
  loading: boolean
  isGuest: boolean
  signInWithGoogle: () => Promise<void>
  signInWithEmail: (email: string, password: string) => Promise<void>
  signUpWithEmail: (email: string, password: string) => Promise<void>
  signInAsGuest: () => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function toAuthError(error: unknown): Error {
  if (error instanceof FirebaseError) {
    return new Error(getAuthErrorMessage(error.code))
  }

  return new Error(getAuthErrorMessage('unknown'))
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signInWithGoogleHandler = useCallback(async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      throw toAuthError(error)
    }
  }, [])

  const signInWithEmailHandler = useCallback(
    async (email: string, password: string) => {
      try {
        await signInWithEmail(email, password)
      } catch (error) {
        throw toAuthError(error)
      }
    },
    [],
  )

  const signUpWithEmailHandler = useCallback(
    async (email: string, password: string) => {
      try {
        await signUpWithEmail(email, password)
      } catch (error) {
        throw toAuthError(error)
      }
    },
    [],
  )

  const signInAsGuestHandler = useCallback(async () => {
    try {
      await signInAsGuest()
    } catch (error) {
      throw toAuthError(error)
    }
  }, [])

  const signOutHandler = useCallback(async () => {
    try {
      await authSignOut()
    } catch (error) {
      throw toAuthError(error)
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isGuest: user?.isAnonymous ?? false,
      signInWithGoogle: signInWithGoogleHandler,
      signInWithEmail: signInWithEmailHandler,
      signUpWithEmail: signUpWithEmailHandler,
      signInAsGuest: signInAsGuestHandler,
      signOut: signOutHandler,
    }),
    [
      user,
      loading,
      signInWithGoogleHandler,
      signInWithEmailHandler,
      signUpWithEmailHandler,
      signInAsGuestHandler,
      signOutHandler,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
