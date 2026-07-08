import { FirebaseError } from 'firebase/app'
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  Timestamp,
  type Unsubscribe,
} from 'firebase/firestore'
import { WORK_CHECK_IN_QUESTIONS } from '@/data/work-check-in-questions'
import type { BrainStatusType } from '@/lib/data'
import { getTodayString } from '@/lib/dates'
import { db } from '@/lib/firebase'
import { trackAnalyticsEvent } from '@/lib/product-analytics'
import { getBrainStatusFromWorkCheckIn } from '@/lib/strategy-analytics'
import type {
  AccommodationOption,
  DrainOption,
  RefillOption,
  ReminderPreference,
  UserWorkProfile,
  WorkCheckIn,
  WorkCheckInDocument,
  WorkCheckInInput,
} from '@/types/work-energy'
import type {
  AccessibilityPreference,
  AgeRange,
  NdStatus,
  NotificationPreference,
  OnboardingChallenge,
  OnboardingGoal,
  Profession,
  WorkEnvironment,
} from '@/types/onboarding'
import { DEFAULT_USER_WORK_PROFILE } from '@/types/work-energy'

export class DuplicateWorkCheckInError extends Error {
  constructor(date = getTodayString()) {
    super(`You already completed your work check-in for ${date}.`)
    this.name = 'DuplicateWorkCheckInError'
  }
}

export class IncompleteWorkCheckInError extends Error {
  constructor() {
    super('Please answer all required work check-in questions.')
    this.name = 'IncompleteWorkCheckInError'
  }
}

export function getUserRef(userId: string) {
  return doc(db, 'users', userId)
}

function getWorkCheckInRef(userId: string, date: string) {
  return doc(db, 'users', userId, 'workCheckIns', date)
}

function getWorkCheckInsCollection(userId: string) {
  return collection(db, 'users', userId, 'workCheckIns')
}

function isDrainOption(value: unknown): value is DrainOption {
  return typeof value === 'string'
}

function isRefillOption(value: unknown): value is RefillOption {
  return typeof value === 'string'
}

function isAccommodationOption(value: unknown): value is AccommodationOption {
  return typeof value === 'string'
}

function normalizeStringArray<T extends string>(
  value: unknown,
  guard: (entry: unknown) => entry is T,
): T[] {
  if (!Array.isArray(value)) return []
  return value.filter(guard)
}

/** Map legacy single-select fields to arrays for older documents. */
function normalizeDrains(data: Record<string, unknown>): {
  drains: DrainOption[]
  drainsOther: string | null
} {
  const drains = normalizeStringArray(data.drains, isDrainOption)
  if (drains.length > 0) {
    return {
      drains,
      drainsOther:
        typeof data.drainsOther === 'string' ? data.drainsOther : null,
    }
  }

  if (typeof data.biggestDrain === 'string') {
    return {
      drains: [data.biggestDrain as DrainOption],
      drainsOther:
        typeof data.biggestDrainOther === 'string'
          ? data.biggestDrainOther
          : null,
    }
  }

  return { drains: [], drainsOther: null }
}

function normalizeRefills(data: Record<string, unknown>): {
  refills: RefillOption[]
  refillsOther: string | null
} {
  const refills = normalizeStringArray(data.refills, isRefillOption)
  if (refills.length > 0) {
    return {
      refills,
      refillsOther:
        typeof data.refillsOther === 'string' ? data.refillsOther : null,
    }
  }

  if (typeof data.biggestRefill === 'string') {
    return {
      refills: [data.biggestRefill as RefillOption],
      refillsOther:
        typeof data.biggestRefillOther === 'string'
          ? data.biggestRefillOther
          : null,
    }
  }

  return { refills: [], refillsOther: null }
}

function normalizeAccommodationNeeds(data: Record<string, unknown>): {
  accommodationNeeds: AccommodationOption[]
  accommodationNeedsOther: string | null
} {
  const accommodationNeeds = normalizeStringArray(
    data.accommodationNeeds,
    isAccommodationOption,
  )
  if (accommodationNeeds.length > 0) {
    return {
      accommodationNeeds,
      accommodationNeedsOther:
        typeof data.accommodationNeedsOther === 'string'
          ? data.accommodationNeedsOther
          : null,
    }
  }

  return { accommodationNeeds: [], accommodationNeedsOther: null }
}

function mapWorkCheckIn(id: string, data: Record<string, unknown>): WorkCheckIn {
  const { drains, drainsOther } = normalizeDrains(data)
  const { refills, refillsOther } = normalizeRefills(data)
  const { accommodationNeeds, accommodationNeedsOther } =
    normalizeAccommodationNeeds(data)

  const energyTank = Number(data.energyTank ?? 0)
  const maskingLoad = Number(data.maskingLoad ?? 0)
  const supportFelt = Number(data.supportFelt ?? 0)

  const legacyBrainStatus = data.brainStatus as BrainStatusType | undefined
  const brainStatus: BrainStatusType =
    legacyBrainStatus ??
    getBrainStatusFromWorkCheckIn({
      id,
      userId: String(data.userId ?? ''),
      organisationId:
        typeof data.organisationId === 'string' ? data.organisationId : null,
      date: String(data.date ?? id),
      checkInTime: String(data.checkInTime ?? ''),
      createdAt: data.createdAt as Timestamp,
      energyTank,
      maskingLoad,
      supportFelt,
      drains,
      drainsOther,
      refills,
      refillsOther,
      mostDrainingTime: data.mostDrainingTime as WorkCheckIn['mostDrainingTime'],
      ableToAskNeeds: data.ableToAskNeeds as WorkCheckIn['ableToAskNeeds'],
      accommodationNeeds,
      accommodationNeedsOther,
      freeTextReflection:
        typeof data.freeTextReflection === 'string'
          ? data.freeTextReflection
          : typeof data.accommodationWish === 'string'
            ? data.accommodationWish
            : null,
      wouldUseAgain:
        typeof data.wouldUseAgain === 'number' ? data.wouldUseAgain : 3,
      brainStatus: legacyBrainStatus ?? 'steady',
      isGuest: data.isGuest === true,
    }) ??
    'steady'

  return {
    id,
    userId: String(data.userId ?? ''),
    organisationId:
      typeof data.organisationId === 'string' ? data.organisationId : null,
    date: String(data.date ?? id),
    checkInTime: String(data.checkInTime ?? ''),
    createdAt: data.createdAt as Timestamp,
    energyTank,
    maskingLoad,
    supportFelt,
    drains,
    drainsOther,
    refills,
    refillsOther,
    mostDrainingTime: data.mostDrainingTime as WorkCheckIn['mostDrainingTime'],
    ableToAskNeeds: data.ableToAskNeeds as WorkCheckIn['ableToAskNeeds'],
    accommodationNeeds,
    accommodationNeedsOther,
    freeTextReflection:
      typeof data.freeTextReflection === 'string'
        ? data.freeTextReflection
        : typeof data.accommodationWish === 'string'
          ? data.accommodationWish
          : null,
    wouldUseAgain:
      typeof data.wouldUseAgain === 'number' ? data.wouldUseAgain : 3,
    brainStatus,
    isGuest: data.isGuest === true,
  }
}

export function mapUserWorkProfile(data: unknown): UserWorkProfile {
  if (!data || typeof data !== 'object') {
    return DEFAULT_USER_WORK_PROFILE
  }

  const profile = data as Partial<UserWorkProfile>

  return {
    organisationId:
      typeof profile.organisationId === 'string' ? profile.organisationId : null,
    role: profile.role ?? DEFAULT_USER_WORK_PROFILE.role,
    timezone: profile.timezone ?? DEFAULT_USER_WORK_PROFILE.timezone,
    reminderEnabled:
      profile.reminderEnabled ?? DEFAULT_USER_WORK_PROFILE.reminderEnabled,
    reminderTime: profile.reminderTime ?? DEFAULT_USER_WORK_PROFILE.reminderTime,
    email: typeof profile.email === 'string' ? profile.email : null,
    whatsappNumber:
      typeof profile.whatsappNumber === 'string' ? profile.whatsappNumber : null,
    whatsappConsent: profile.whatsappConsent === true,
    reminderPreference: isReminderPreference(profile.reminderPreference)
      ? profile.reminderPreference
      : DEFAULT_USER_WORK_PROFILE.reminderPreference,
    selfDescription:
      typeof profile.selfDescription === 'string' ? profile.selfDescription : null,
    pilotAccess: profile.pilotAccess !== false,
    displayName: typeof profile.displayName === 'string' ? profile.displayName : null,
    ndStatus: isNdStatus(profile.ndStatus) ? profile.ndStatus : null,
    ageRange: isAgeRange(profile.ageRange) ? profile.ageRange : null,
    profession: isProfession(profile.profession) ? profile.profession : null,
    workEnvironment: filterWorkEnvironment(profile.workEnvironment),
    challenges: filterChallenges(profile.challenges),
    goals: filterGoals(profile.goals),
    accessibilityPreferences: filterAccessibility(profile.accessibilityPreferences),
    notificationPreference: isNotificationPreference(profile.notificationPreference)
      ? profile.notificationPreference
      : null,
    onboardingCompleted: profile.onboardingCompleted === true,
  }
}

function isNdStatus(value: unknown): value is NdStatus {
  return (
    value === 'diagnosed' ||
    value === 'self-identify' ||
    value === 'exploring' ||
    value === 'supporting' ||
    value === 'not-nd' ||
    value === 'prefer-not-to-say'
  )
}

function isAgeRange(value: unknown): value is AgeRange {
  return (
    value === 'under-18' ||
    value === '18-24' ||
    value === '25-34' ||
    value === '35-44' ||
    value === '45-54' ||
    value === '55-plus' ||
    value === 'prefer-not-to-say'
  )
}

function isProfession(value: unknown): value is Profession {
  const values: Profession[] = [
    'student',
    'working-professional',
    'manager',
    'executive',
    'founder',
    'freelancer',
    'consultant',
    'creative',
    'engineer',
    'finance',
    'hr',
    'educator',
    'healthcare',
    'government',
    'looking-for-work',
    'other',
  ]
  return typeof value === 'string' && values.includes(value as Profession)
}

function isNotificationPreference(value: unknown): value is NotificationPreference {
  return (
    value === 'never' ||
    value === 'when-i-ask' ||
    value === 'daily' ||
    value === 'weekdays' ||
    value === 'weekly'
  )
}

function filterWorkEnvironment(value: unknown): WorkEnvironment[] {
  if (!Array.isArray(value)) return []
  const allowed: WorkEnvironment[] = [
    'office',
    'hybrid',
    'remote',
    'shift-work',
    'freelance',
    'university',
    'home',
  ]
  return value.filter(
    (entry): entry is WorkEnvironment =>
      typeof entry === 'string' && allowed.includes(entry as WorkEnvironment),
  )
}

function filterChallenges(value: unknown): OnboardingChallenge[] {
  if (!Array.isArray(value)) return []
  const allowed: OnboardingChallenge[] = [
    'starting-tasks',
    'prioritising',
    'switching-tasks',
    'remembering-things',
    'time-blindness',
    'sensory-overwhelm',
    'meetings',
    'burnout',
    'emotional-regulation',
    'focus',
    'planning',
    'procrastination',
    'communication',
    'sleep',
    'work-life-balance',
  ]
  return value.filter(
    (entry): entry is OnboardingChallenge =>
      typeof entry === 'string' && allowed.includes(entry as OnboardingChallenge),
  )
}

function filterGoals(value: unknown): OnboardingGoal[] {
  if (!Array.isArray(value)) return []
  const allowed: OnboardingGoal[] = [
    'reduce-burnout',
    'improve-focus',
    'build-routines',
    'understand-myself',
    'discover-strategies',
    'feel-less-overwhelmed',
    'improve-performance',
    'build-habits',
  ]
  return value.filter(
    (entry): entry is OnboardingGoal =>
      typeof entry === 'string' && allowed.includes(entry as OnboardingGoal),
  )
}

function filterAccessibility(value: unknown): AccessibilityPreference[] {
  if (!Array.isArray(value)) return []
  const allowed: AccessibilityPreference[] = [
    'reduced-animations',
    'larger-text',
    'high-contrast',
    'fewer-notifications',
    'simplified-interface',
    'dark-mode',
    'none',
  ]
  return value.filter(
    (entry): entry is AccessibilityPreference =>
      typeof entry === 'string' && allowed.includes(entry as AccessibilityPreference),
  )
}

function isReminderPreference(value: unknown): value is ReminderPreference {
  return value === 'email' || value === 'whatsapp' || value === 'both'
}

function isScaleValid(value: unknown): value is number {
  return typeof value === 'number' && value >= 1 && value <= 5
}

function isWorkCheckInComplete(input: WorkCheckInInput): boolean {
  if (!isScaleValid(input.energyTank)) return false
  if (!isScaleValid(input.maskingLoad)) return false
  if (!isScaleValid(input.supportFelt)) return false
  if (!isScaleValid(input.wouldUseAgain)) return false
  if (input.drains.length === 0 || input.refills.length === 0) return false
  if (input.accommodationNeeds.length === 0) return false
  if (!input.mostDrainingTime || !input.ableToAskNeeds) return false
  if (input.drains.includes('other') && !input.drainsOther?.trim()) return false
  if (input.refills.includes('other') && !input.refillsOther?.trim()) return false
  if (
    input.accommodationNeeds.includes('other') &&
    !input.accommodationNeedsOther?.trim()
  ) {
    return false
  }

  return WORK_CHECK_IN_QUESTIONS.every((question) => {
    if (!question.required) return true

    const value = input[question.id as keyof WorkCheckInInput]
    if (Array.isArray(value)) return value.length > 0
    return value !== undefined && value !== null && value !== ''
  })
}

export function getWorkCheckInErrorMessage(error: unknown): string {
  if (error instanceof DuplicateWorkCheckInError) {
    return error.message
  }

  if (error instanceof IncompleteWorkCheckInError) {
    return error.message
  }

  if (error instanceof FirebaseError) {
    if (error.code === 'permission-denied') {
      return 'Unable to access your work check-in data. Make sure Firestore rules are deployed and you are signed in.'
    }

    if (error.code === 'unavailable') {
      return 'Work check-ins are temporarily unavailable. Check your connection and try again.'
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong while saving your work check-in.'
}

export function subscribeToWorkCheckIns(
  userId: string,
  onData: (checkIns: WorkCheckIn[]) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  const checkInsQuery = query(
    getWorkCheckInsCollection(userId),
    orderBy('date', 'desc'),
  )

  return onSnapshot(
    checkInsQuery,
    (snapshot) => {
      onData(
        snapshot.docs.map((entry) =>
          mapWorkCheckIn(entry.id, entry.data() as Record<string, unknown>),
        ),
      )
    },
    (error) => onError?.(error),
  )
}

export function subscribeToUserWorkProfile(
  userId: string,
  onData: (profile: UserWorkProfile) => void,
  onError?: (error: Error) => void,
): Unsubscribe {
  return onSnapshot(
    getUserRef(userId),
    (snapshot) => {
      const data = snapshot.data()
      onData(mapUserWorkProfile(data?.workProfile))
    },
    (error) => onError?.(error),
  )
}

export interface UserContactProfileUpdate {
  email: string
  whatsappNumber: string | null
  whatsappConsent: boolean
  reminderPreference: ReminderPreference
  reminderEnabled: boolean
  timezone: string
  selfDescription?: string | null
}

export async function updateUserContactProfile(
  userId: string,
  update: UserContactProfileUpdate,
  existingProfile: UserWorkProfile = DEFAULT_USER_WORK_PROFILE,
): Promise<void> {
  const nextProfile: UserWorkProfile = {
    ...existingProfile,
    email: update.email.trim(),
    whatsappNumber: update.whatsappNumber?.trim() || null,
    whatsappConsent: update.whatsappConsent,
    reminderPreference: update.reminderPreference,
    reminderEnabled: update.reminderEnabled,
    timezone: update.timezone.trim() || existingProfile.timezone,
    selfDescription:
      update.selfDescription !== undefined
        ? update.selfDescription?.trim() || null
        : existingProfile.selfDescription,
  }

  await setDoc(
    getUserRef(userId),
    {
      workProfile: nextProfile,
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

function buildCheckInDocument(
  userId: string,
  input: WorkCheckInInput,
  date: string,
  now: string,
  isGuest: boolean,
): Omit<WorkCheckInDocument, 'createdAt'> & {
  createdAt: ReturnType<typeof serverTimestamp>
} {
  const energyTank = input.energyTank
  const maskingLoad = input.maskingLoad
  const supportFelt = input.supportFelt

  const brainStatus =
    getBrainStatusFromWorkCheckIn({
      id: date,
      userId,
      organisationId: input.organisationId ?? null,
      date,
      checkInTime: now,
      createdAt: Timestamp.now(),
      energyTank,
      maskingLoad,
      supportFelt,
      drains: input.drains,
      drainsOther:
        input.drains.includes('other') ? input.drainsOther?.trim() || null : null,
      refills: input.refills,
      refillsOther:
        input.refills.includes('other') ? input.refillsOther?.trim() || null : null,
      mostDrainingTime: input.mostDrainingTime,
      ableToAskNeeds: input.ableToAskNeeds,
      accommodationNeeds: input.accommodationNeeds,
      accommodationNeedsOther: input.accommodationNeeds.includes('other')
        ? input.accommodationNeedsOther?.trim() || null
        : null,
      freeTextReflection: input.freeTextReflection?.trim() || null,
      wouldUseAgain: input.wouldUseAgain,
      brainStatus: 'steady',
      isGuest,
    }) ?? 'steady'

  return {
    userId,
    organisationId: input.organisationId ?? null,
    date,
    checkInTime: now,
    createdAt: serverTimestamp(),
    energyTank,
    maskingLoad,
    supportFelt,
    drains: input.drains,
    drainsOther: input.drains.includes('other')
      ? input.drainsOther?.trim() || null
      : null,
    refills: input.refills,
    refillsOther: input.refills.includes('other')
      ? input.refillsOther?.trim() || null
      : null,
    mostDrainingTime: input.mostDrainingTime,
    ableToAskNeeds: input.ableToAskNeeds,
    accommodationNeeds: input.accommodationNeeds,
    accommodationNeedsOther: input.accommodationNeeds.includes('other')
      ? input.accommodationNeedsOther?.trim() || null
      : null,
    freeTextReflection: input.freeTextReflection?.trim() || null,
    wouldUseAgain: input.wouldUseAgain,
    brainStatus,
    isGuest,
  }
}

export async function submitWorkCheckIn(
  userId: string,
  input: WorkCheckInInput,
  options: { date?: string; isGuest?: boolean } = {},
): Promise<WorkCheckIn> {
  const date = options.date ?? getTodayString()
  const isGuest = options.isGuest ?? false

  if (!isWorkCheckInComplete(input)) {
    throw new IncompleteWorkCheckInError()
  }

  const checkInRef = getWorkCheckInRef(userId, date)
  const now = new Date().toISOString()

  await setDoc(getUserRef(userId), { updatedAt: serverTimestamp() }, { merge: true })

  const payload = buildCheckInDocument(userId, input, date, now, isGuest)

  await runTransaction(db, async (transaction) => {
    const snapshot = await transaction.get(checkInRef)

    if (snapshot.exists()) {
      throw new DuplicateWorkCheckInError(date)
    }

    transaction.set(checkInRef, payload)
  })

  void trackAnalyticsEvent(userId, 'completed_check_in', { date })

  return {
    id: date,
    ...payload,
    createdAt: Timestamp.now(),
  } as WorkCheckIn
}

export async function fetchWorkCheckInForDate(
  userId: string,
  date = getTodayString(),
): Promise<WorkCheckIn | null> {
  const snapshot = await getDoc(getWorkCheckInRef(userId, date))
  if (!snapshot.exists()) return null

  return mapWorkCheckIn(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export function getWorkCheckInForDate(
  checkIns: WorkCheckIn[],
  date: string,
): WorkCheckIn | null {
  return checkIns.find((checkIn) => checkIn.date === date) ?? null
}

export function hasWorkCheckInForDate(
  checkIns: WorkCheckIn[],
  date = getTodayString(),
): boolean {
  return checkIns.some((checkIn) => checkIn.date === date)
}

export function getCheckInsForDateRange(
  checkIns: WorkCheckIn[],
  startDate: string,
  endDate: string,
): WorkCheckIn[] {
  return checkIns
    .filter((checkIn) => checkIn.date >= startDate && checkIn.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date))
}
