import { getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import type { ThemePreference } from '@/context/theme-context'
import { trackAnalyticsEvent } from '@/lib/product-analytics'
import { getUserRef } from '@/lib/work-check-ins'
import type { OnboardingAnswers } from '@/types/onboarding'
import type { UserWorkProfile } from '@/types/work-energy'

const A11Y_STORAGE_KEY = 'neurodiver-a11y'

export function getDisplayName(profile: UserWorkProfile, authName?: string | null): string {
  const fromProfile = profile.displayName?.trim()
  if (fromProfile) return fromProfile

  const fromAuth = authName?.trim()
  if (fromAuth) {
    const emailLocal = fromAuth.includes('@') ? fromAuth.split('@')[0] : fromAuth
    if (emailLocal) return emailLocal
  }

  return 'friend'
}

export function applyAccessibilityPreferences(
  preferences: UserWorkProfile['accessibilityPreferences'],
  setTheme?: (preference: ThemePreference) => void,
): void {
  const root = document.documentElement
  const wantsReducedMotion = preferences.includes('reduced-animations')
  const wantsLargerText = preferences.includes('larger-text')
  const wantsHighContrast = preferences.includes('high-contrast')
  const wantsDarkMode = preferences.includes('dark-mode')
  const wantsSimplified = preferences.includes('simplified-interface')

  root.classList.toggle('reduce-motion', wantsReducedMotion)
  root.classList.toggle('text-large', wantsLargerText)
  root.classList.toggle('high-contrast', wantsHighContrast)
  root.classList.toggle('simplified-ui', wantsSimplified)

  if (setTheme) {
    if (wantsDarkMode) {
      setTheme('dark')
    }
  }

  try {
    localStorage.setItem(A11Y_STORAGE_KEY, JSON.stringify(preferences))
  } catch {
    // ignore
  }
}

export function restoreAccessibilityFromStorage(
  setTheme?: (preference: ThemePreference) => void,
): void {
  try {
    const raw = localStorage.getItem(A11Y_STORAGE_KEY)
    if (!raw) return
    const parsed = JSON.parse(raw) as UserWorkProfile['accessibilityPreferences']
    if (Array.isArray(parsed)) {
      applyAccessibilityPreferences(parsed, setTheme)
    }
  } catch {
    // ignore
  }
}

function reminderEnabledFromNotification(
  preference: OnboardingAnswers['notificationPreference'],
): boolean {
  return preference === 'daily' || preference === 'weekdays' || preference === 'weekly'
}

export async function completeOnboarding(
  userId: string,
  answers: OnboardingAnswers,
  existingProfile: UserWorkProfile,
): Promise<UserWorkProfile> {
  const userRef = getUserRef(userId)
  const snap = await getDoc(userRef)
  const hasCreatedAt = snap.exists() && snap.data()?.createdAt

  const accessibilityPreferences = answers.accessibilityPreferences.filter(
    (pref) => pref !== 'none',
  )

  const nextProfile: UserWorkProfile = {
    ...existingProfile,
    displayName: answers.displayName.trim() || null,
    ndStatus: answers.ndStatus,
    ageRange: answers.ageRange,
    profession: answers.profession,
    workEnvironment: answers.workEnvironment,
    challenges: answers.challenges,
    goals: answers.goals,
    accessibilityPreferences,
    notificationPreference: answers.notificationPreference,
    onboardingCompleted: true,
    reminderEnabled:
      !accessibilityPreferences.includes('fewer-notifications') &&
      reminderEnabledFromNotification(answers.notificationPreference),
  }

  await setDoc(
    userRef,
    {
      workProfile: nextProfile,
      updatedAt: serverTimestamp(),
      ...(hasCreatedAt ? {} : { createdAt: serverTimestamp() }),
    },
    { merge: true },
  )

  void trackAnalyticsEvent(userId, 'completed_onboarding')

  return nextProfile
}
