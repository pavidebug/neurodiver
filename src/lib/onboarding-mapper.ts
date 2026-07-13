import { BUILD_INFO } from '@/constants/build-info'
import type { OnboardingAnswers } from '@/types/onboarding'
import type { OnboardingDocumentPatch } from '@/types/user-document'
import type { UserWorkProfile } from '@/types/work-energy'
import {
  buildAccessibilityPreferences,
  buildChallengesFromAnswers,
  buildGoalsFromAnswers,
  mapWorkLocationToLegacy,
} from '@/lib/onboarding-profile'

export function answersToUserDocumentPatch(
  answers: OnboardingAnswers,
  complete = false,
): OnboardingDocumentPatch {
  return {
    preferredName: answers.displayName.trim() || null,
    reasonForJoining: answers.whatBroughtYouHere,
    ndStatus: answers.ndStatus,
    experiences: answers.familiarExperiences,
    workEnvironment: answers.workLocation,
    jobRole: answers.profession,
    energyDrainers: answers.energyDrains,
    peakEnergyTime: answers.peakEnergyTime,
    supportStyle: answers.supportStyle,
    informationPreference: answers.informationPreference,
    goals: answers.successGoals,
    ageRange: answers.ageRange,
    gender: answers.gender,
    country: answers.country.trim() || null,
    appVersion: BUILD_INFO.version,
    ...(complete ? { onboardingCompleted: true } : {}),
  }
}

export function answersToWorkProfile(
  answers: OnboardingAnswers,
  existingProfile: UserWorkProfile,
  complete = false,
): UserWorkProfile {
  const locationMapping = mapWorkLocationToLegacy(answers.workLocation)
  const accessibilityPreferences = buildAccessibilityPreferences(
    answers.supportStyle,
    answers.informationPreference,
    answers.accessibilityPreferences,
  )

  return {
    ...existingProfile,
    displayName: answers.displayName.trim() || null,
    ndStatus: answers.ndStatus,
    whatBroughtYouHere: answers.whatBroughtYouHere,
    familiarExperiences: answers.familiarExperiences,
    workLocation: answers.workLocation,
    energyDrains: answers.energyDrains,
    peakEnergyTime: answers.peakEnergyTime,
    supportStyle: answers.supportStyle,
    informationPreference: answers.informationPreference,
    successGoals: answers.successGoals,
    gender: answers.gender,
    country: answers.country.trim() || null,
    workStatus: locationMapping.workStatus ?? answers.workStatus,
    ageRange: answers.ageRange,
    profession: answers.profession,
    workEnvironment:
      locationMapping.workEnvironment.length > 0
        ? locationMapping.workEnvironment
        : answers.workEnvironment,
    challenges: buildChallengesFromAnswers(answers),
    goals: buildGoalsFromAnswers(answers),
    accessibilityPreferences,
    notificationPreference: answers.notificationPreference,
    onboardingCompleted: complete ? true : existingProfile.onboardingCompleted,
    reminderEnabled:
      !accessibilityPreferences.includes('fewer-notifications') &&
      (answers.notificationPreference === 'daily' ||
        answers.notificationPreference === 'weekdays' ||
        answers.notificationPreference === 'weekly'),
  }
}

export function userDocumentToOnboardingAnswers(
  data: Record<string, unknown> | undefined,
  workProfile: UserWorkProfile,
): OnboardingAnswers {
  const preferredName =
    (typeof data?.preferredName === 'string' ? data.preferredName : null) ??
    workProfile.displayName ??
    ''

  return {
    displayName: preferredName,
    whatBroughtYouHere:
      (data?.reasonForJoining as OnboardingAnswers['whatBroughtYouHere']) ??
      workProfile.whatBroughtYouHere,
    ndStatus: workProfile.ndStatus,
    familiarExperiences: workProfile.familiarExperiences,
    workLocation: workProfile.workLocation,
    profession: workProfile.profession,
    energyDrains: workProfile.energyDrains,
    peakEnergyTime: workProfile.peakEnergyTime,
    supportStyle: workProfile.supportStyle,
    informationPreference: workProfile.informationPreference,
    successGoals: workProfile.successGoals,
    ageRange: workProfile.ageRange,
    gender: workProfile.gender,
    country: workProfile.country ?? '',
    workStatus: workProfile.workStatus,
    workEnvironment: workProfile.workEnvironment,
    challenges: workProfile.challenges,
    goals: workProfile.goals,
    accessibilityPreferences: workProfile.accessibilityPreferences,
    notificationPreference: workProfile.notificationPreference,
  }
}
