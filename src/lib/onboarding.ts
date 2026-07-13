import type { ThemePreference } from '@/context/theme-context'
import {
  canProceedFromOnboardingStep,
  getOnboardingValidationMessage,
  isOnboardingQuestionOptional,
} from '@/lib/onboarding-validation'
import { completeOnboardingDocument } from '@/lib/user-document-service'
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

  return 'user'
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

  if (setTheme && wantsDarkMode) {
    setTheme('dark')
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

export async function completeOnboarding(
  userId: string,
  answers: OnboardingAnswers,
  existingProfile: UserWorkProfile,
): Promise<UserWorkProfile> {
  return completeOnboardingDocument(userId, answers, existingProfile)
}

export {
  canProceedFromOnboardingStep,
  getOnboardingValidationMessage,
  isOnboardingQuestionOptional,
}

/** @deprecated Use isOnboardingQuestionOptional */
export const isOnboardingStepOptional = isOnboardingQuestionOptional
