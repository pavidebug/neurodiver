import type { UserWorkProfile } from '@/types/work-energy'

export const WEEKLY_REPORT_GUEST_MESSAGE =
  'Create an account to save your check-ins and unlock your weekly insight report.'

export const WEEKLY_REPORT_PREVIEW_MESSAGE =
  'Full weekly insights will be available with a paid plan. During the pilot, signed-in users can view the complete report.'

/** Signed-in pilot users get full report access during the pilot phase. */
export function canViewFullWeeklyReport(
  isGuest: boolean,
  profile: UserWorkProfile,
): boolean {
  if (isGuest) return false
  return profile.pilotAccess !== false
}

export function isWeeklyReportPreviewOnly(
  isGuest: boolean,
  profile: UserWorkProfile,
): boolean {
  if (isGuest) return false
  return profile.pilotAccess === false
}
