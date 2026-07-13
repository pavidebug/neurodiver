import { FirebaseError } from 'firebase/app'
import type { User } from 'firebase/auth'
import { getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { BUILD_INFO } from '@/constants/build-info'
import { trackAnalyticsEvent } from '@/lib/product-analytics'
import {
  answersToUserDocumentPatch,
  answersToWorkProfile,
} from '@/lib/onboarding-mapper'
import { getUserRef } from '@/lib/work-check-ins'
import type { OnboardingAnswers } from '@/types/onboarding'
import type { UserDocument } from '@/types/user-document'
import { DEFAULT_USER_WORK_PROFILE, type UserWorkProfile } from '@/types/work-energy'

export class UserDocumentServiceError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UserDocumentServiceError'
  }
}

function toServiceError(error: unknown): UserDocumentServiceError {
  if (error instanceof UserDocumentServiceError) return error
  if (error instanceof FirebaseError) {
    return new UserDocumentServiceError(
      'We could not save your profile right now. Please try again.',
    )
  }
  return new UserDocumentServiceError('Something went wrong. Please try again.')
}

export function mapUserDocument(data: Record<string, unknown> | undefined): UserDocument {
  if (!data) {
    return {
      displayName: null,
      preferredName: null,
      email: null,
      photoURL: null,
      createdAt: null,
      lastLogin: null,
      onboardingCompleted: false,
      reasonForJoining: null,
      ndStatus: null,
      experiences: [],
      workEnvironment: null,
      jobRole: null,
      energyDrainers: [],
      peakEnergyTime: null,
      supportStyle: null,
      informationPreference: null,
      goals: [],
      ageRange: null,
      gender: null,
      country: null,
      appVersion: null,
      updatedAt: null,
    }
  }

  return {
    displayName: typeof data.displayName === 'string' ? data.displayName : null,
    preferredName: typeof data.preferredName === 'string' ? data.preferredName : null,
    email: typeof data.email === 'string' ? data.email : null,
    photoURL: typeof data.photoURL === 'string' ? data.photoURL : null,
    createdAt: (data.createdAt as UserDocument['createdAt']) ?? null,
    lastLogin: (data.lastLogin as UserDocument['lastLogin']) ?? null,
    onboardingCompleted: data.onboardingCompleted === true,
    reasonForJoining:
      (data.reasonForJoining as UserDocument['reasonForJoining']) ?? null,
    ndStatus: (data.ndStatus as UserDocument['ndStatus']) ?? null,
    experiences: Array.isArray(data.experiences)
      ? (data.experiences as UserDocument['experiences'])
      : [],
    workEnvironment: (data.workEnvironment as UserDocument['workEnvironment']) ?? null,
    jobRole: (data.jobRole as UserDocument['jobRole']) ?? null,
    energyDrainers: Array.isArray(data.energyDrainers)
      ? (data.energyDrainers as UserDocument['energyDrainers'])
      : [],
    peakEnergyTime: (data.peakEnergyTime as UserDocument['peakEnergyTime']) ?? null,
    supportStyle: (data.supportStyle as UserDocument['supportStyle']) ?? null,
    informationPreference:
      (data.informationPreference as UserDocument['informationPreference']) ?? null,
    goals: Array.isArray(data.goals) ? (data.goals as UserDocument['goals']) : [],
    ageRange: (data.ageRange as UserDocument['ageRange']) ?? null,
    gender: (data.gender as UserDocument['gender']) ?? null,
    country: typeof data.country === 'string' ? data.country : null,
    appVersion: typeof data.appVersion === 'string' ? data.appVersion : null,
    updatedAt: (data.updatedAt as UserDocument['updatedAt']) ?? null,
    workProfile: data.workProfile as UserWorkProfile | undefined,
  }
}

/** Creates or updates users/{uid} on sign-in. Guests are skipped. */
export async function ensureUserDocument(user: User): Promise<void> {
  if (user.isAnonymous) return

  const userRef = getUserRef(user.uid)

  try {
    const snap = await getDoc(userRef)
    const now = serverTimestamp()

    if (!snap.exists()) {
      await setDoc(
        userRef,
        {
          displayName: user.displayName,
          preferredName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: now,
          lastLogin: now,
          onboardingCompleted: false,
          experiences: [],
          energyDrainers: [],
          goals: [],
          appVersion: BUILD_INFO.version,
          updatedAt: now,
          workProfile: DEFAULT_USER_WORK_PROFILE,
        },
        { merge: true },
      )
      return
    }

    await setDoc(
      userRef,
      {
        lastLogin: now,
        updatedAt: now,
        email: user.email,
        photoURL: user.photoURL,
        displayName: user.displayName ?? snap.data()?.displayName ?? null,
        appVersion: BUILD_INFO.version,
      },
      { merge: true },
    )
  } catch (error) {
    throw toServiceError(error)
  }
}

export async function saveOnboardingProgress(
  userId: string,
  answers: OnboardingAnswers,
  existingProfile: UserWorkProfile,
): Promise<void> {
  const userRef = getUserRef(userId)

  try {
    await setDoc(
      userRef,
      {
        ...answersToUserDocumentPatch(answers, false),
        workProfile: answersToWorkProfile(answers, existingProfile, false),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    )
  } catch (error) {
    throw toServiceError(error)
  }
}

export async function completeOnboardingDocument(
  userId: string,
  answers: OnboardingAnswers,
  existingProfile: UserWorkProfile,
): Promise<UserWorkProfile> {
  const userRef = getUserRef(userId)

  try {
    const snap = await getDoc(userRef)
    const hasCreatedAt = snap.exists() && snap.data()?.createdAt
    const nextProfile = answersToWorkProfile(answers, existingProfile, true)

    await setDoc(
      userRef,
      {
        ...answersToUserDocumentPatch(answers, true),
        workProfile: nextProfile,
        updatedAt: serverTimestamp(),
        ...(hasCreatedAt ? {} : { createdAt: serverTimestamp() }),
      },
      { merge: true },
    )

    void trackAnalyticsEvent(userId, 'completed_onboarding')
    return nextProfile
  } catch (error) {
    throw toServiceError(error)
  }
}

export function isOnboardingComplete(data: Record<string, unknown> | undefined): boolean {
  if (!data) return false
  if (data.onboardingCompleted === true) return true
  const workProfile = data.workProfile as Partial<UserWorkProfile> | undefined
  return workProfile?.onboardingCompleted === true
}
