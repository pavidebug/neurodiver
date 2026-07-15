import {
  collection,
  collectionGroup,
  getCountFromServer,
  getDocs,
  type Query,
  type Timestamp,
} from 'firebase/firestore'
import { getTodayString } from '@/lib/dates'
import { db } from '@/lib/firebase'
import { getDisplayName } from '@/lib/onboarding'
import {
  BROUGHT_HERE_OPTIONS,
  ENERGY_DRAIN_OPTIONS,
  FAMILIAR_EXPERIENCE_OPTIONS,
  SUPPORT_STYLE_OPTIONS,
} from '@/data/onboarding-options'
import type {
  AdminActivityItem,
  AdminBodyDoubleInterest,
  AdminDashboardData,
  AdminFeatureUsage,
  AdminFeedbackRow,
  AdminOverviewStats,
  AdminSignUp,
  AdminStrategyRow,
  AdminUserRow,
  SavedStrategyCount,
} from '@/types/admin-dashboard'
import {
  ANALYTICS_EVENT_LABELS,
  ANALYTICS_FEATURE_LABELS,
  type AnalyticsEventType,
} from '@/types/product-analytics'
import type { UserStrategyState } from '@/types/strategy'
import type { UserWorkProfile, WorkCheckInDocument } from '@/types/work-energy'

interface AnalyticsEventRecord {
  id: string
  eventType: AnalyticsEventType
  userId: string
  createdAt: Timestamp | null
}

interface UserRecord {
  id: string
  email: string | null
  displayName: string | null
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
  profile: UserWorkProfile
  strategyState: UserStrategyState
}

function getUserName(user: UserRecord): string {
  return user.profile.displayName?.trim() || user.displayName?.trim() || getDisplayName(user.profile)
}

function getOptionLabel(
  options: ReadonlyArray<{ value: string; label: string }>,
  value: string | null,
): string | null {
  if (!value) return null
  return options.find((option) => option.value === value)?.label ?? value
}

function getOptionLabels(
  options: ReadonlyArray<{ value: string; label: string }>,
  values: string[],
): string[] {
  return values.map(
    (value) => options.find((option) => option.value === value)?.label ?? value,
  )
}

function formatTimestamp(value: Timestamp | null | undefined): string | null {
  if (!value?.toDate) return null
  return value.toDate().toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function formatDate(value: Timestamp | null | undefined): string | null {
  if (!value?.toDate) return null
  return value.toDate().toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function isToday(value: Timestamp | null | undefined): boolean {
  if (!value?.toDate) return false
  const date = value.toDate()
  const today = new Date()
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  )
}

function mapUserStrategyState(data: unknown): UserStrategyState {
  if (!data || typeof data !== 'object') {
    return { savedIds: [], lastViewedId: null, usage: {} }
  }

  const state = data as Partial<UserStrategyState>
  return {
    savedIds: Array.isArray(state.savedIds) ? state.savedIds : [],
    lastViewedId: typeof state.lastViewedId === 'string' ? state.lastViewedId : null,
    usage:
      state.usage && typeof state.usage === 'object'
        ? (state.usage as UserStrategyState['usage'])
        : {},
  }
}

function mapUserProfile(data: unknown): UserWorkProfile {
  if (!data || typeof data !== 'object') {
    return {
      organisationId: null,
      role: 'employee',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      reminderEnabled: true,
      reminderTime: '17:00',
      email: null,
      whatsappNumber: null,
      whatsappConsent: false,
      reminderPreference: 'email',
      selfDescription: null,
      pilotAccess: true,
      displayName: null,
      ndStatus: null,
      whatBroughtYouHere: null,
      familiarExperiences: [],
      workLocation: null,
      energyDrains: [],
      peakEnergyTime: null,
      supportStyle: null,
      informationPreference: null,
      successGoals: [],
      gender: null,
      country: null,
      workStatus: null,
      ageRange: null,
      profession: null,
      workEnvironment: [],
      challenges: [],
      goals: [],
      accessibilityPreferences: [],
      notificationPreference: null,
      onboardingCompleted: false,
    }
  }

  return data as UserWorkProfile
}

async function safeCount(source: Query | ReturnType<typeof collection>): Promise<number> {
  try {
    const snapshot = await getCountFromServer(source)
    return snapshot.data().count
  } catch {
    return 0
  }
}

async function fetchUsers(): Promise<UserRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, 'users'))
    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data()
      return {
        id: docSnap.id,
        email: typeof data.email === 'string' ? data.email : null,
        displayName: typeof data.displayName === 'string' ? data.displayName : null,
        createdAt: (data.createdAt as Timestamp | undefined) ?? null,
        updatedAt: (data.updatedAt as Timestamp | undefined) ?? null,
        profile: mapUserProfile(data.workProfile),
        strategyState: mapUserStrategyState(data.strategyState),
      }
    })
  } catch {
    return []
  }
}

async function fetchBodyDoubleInterests(): Promise<AdminBodyDoubleInterest[]> {
  try {
    const snapshot = await getDocs(collection(db, 'bodyDoubleInterest'))
    return snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data()
        return {
          userId: String(data.userId ?? docSnap.id),
          email: String(data.email ?? ''),
          isGuest: data.isGuest === true,
          joinedAt: formatTimestamp(data.createdAt as Timestamp | undefined),
          createdAt: (data.createdAt as Timestamp | undefined) ?? null,
        }
      })
      .filter((entry) => entry.email.length > 0)
      .sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
      )
      .map(({ createdAt: _createdAt, ...entry }) => entry)
  } catch {
    return []
  }
}

async function fetchAnalyticsEvents(): Promise<AnalyticsEventRecord[]> {
  try {
    const snapshot = await getDocs(collection(db, 'analyticsEvents'))
    return snapshot.docs
      .map((docSnap) => {
        const data = docSnap.data()
        const eventType = data.eventType as AnalyticsEventType
        if (!eventType || !ANALYTICS_EVENT_LABELS[eventType]) return null

        return {
          id: docSnap.id,
          eventType,
          userId: String(data.userId ?? ''),
          createdAt: (data.createdAt as Timestamp | undefined) ?? null,
        }
      })
      .filter((event): event is AnalyticsEventRecord => event !== null)
  } catch {
    return []
  }
}

async function fetchWorkCheckIns(): Promise<
  Array<WorkCheckInDocument & { docId: string }>
> {
  try {
    const snapshot = await getDocs(collectionGroup(db, 'workCheckIns'))
    return snapshot.docs.map((docSnap) => ({
      docId: docSnap.id,
      ...(docSnap.data() as WorkCheckInDocument),
    }))
  } catch {
    return []
  }
}

async function fetchStrategyTitles(): Promise<Map<string, string>> {
  try {
    const snapshot = await getDocs(collection(db, 'strategies'))
    const titles = new Map<string, string>()
    for (const docSnap of snapshot.docs) {
      const title = docSnap.data().title
      if (typeof title === 'string') {
        titles.set(docSnap.id, title)
      }
    }
    return titles
  } catch {
    return new Map()
  }
}

async function fetchFeedbackRows(): Promise<AdminFeedbackRow[]> {
  try {
    const snapshot = await getDocs(collection(db, 'sessionFeedback'))
    return [...snapshot.docs]
      .map((docSnap) => {
        const data = docSnap.data()
        return {
          id: docSnap.id,
          userId: String(data.userId ?? ''),
          rating: typeof data.wouldJoinAgain === 'number' ? data.wouldJoinAgain : 0,
          comment: typeof data.notes === 'string' ? data.notes : null,
          date: formatTimestamp(data.submittedAt as Timestamp | undefined),
          submittedAt: (data.submittedAt as Timestamp | undefined) ?? null,
        }
      })
      .sort(
        (a, b) =>
          (b.submittedAt?.toMillis?.() ?? 0) - (a.submittedAt?.toMillis?.() ?? 0),
      )
      .map(({ submittedAt: _submittedAt, ...row }) => row)
  } catch {
    return []
  }
}

function buildUserRows(
  users: UserRecord[],
  checkIns: Array<WorkCheckInDocument & { docId: string }>,
  events: AnalyticsEventRecord[],
): AdminUserRow[] {
  const checkInsByUser = new Map<string, Array<WorkCheckInDocument & { docId: string }>>()
  for (const checkIn of checkIns) {
    const existing = checkInsByUser.get(checkIn.userId) ?? []
    existing.push(checkIn)
    checkInsByUser.set(checkIn.userId, existing)
  }

  const latestEventByUser = new Map<string, Timestamp>()
  for (const event of events) {
    if (!event.createdAt) continue
    const current = latestEventByUser.get(event.userId)
    if (!current || event.createdAt.toMillis() > current.toMillis()) {
      latestEventByUser.set(event.userId, event.createdAt)
    }
  }

  return users
    .map((user) => {
      const userCheckIns = checkInsByUser.get(user.id) ?? []
      const sortedCheckIns = [...userCheckIns].sort(
        (a, b) =>
          (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
      )
      const latestCheckIn = sortedCheckIns[0]

      const lastActiveTimestamp =
        latestEventByUser.get(user.id) ??
        user.updatedAt ??
        latestCheckIn?.createdAt ??
        user.createdAt

      return {
        userId: user.id,
        name: getUserName(user),
        email: user.email ?? user.profile.email,
        broughtHere: getOptionLabel(BROUGHT_HERE_OPTIONS, user.profile.whatBroughtYouHere),
        familiarExperiences: getOptionLabels(
          FAMILIAR_EXPERIENCE_OPTIONS,
          user.profile.familiarExperiences,
        ),
        energyDrains: getOptionLabels(ENERGY_DRAIN_OPTIONS, user.profile.energyDrains),
        supportStyle: getOptionLabel(SUPPORT_STYLE_OPTIONS, user.profile.supportStyle),
        joinedAt: formatDate(user.createdAt),
        lastActive: formatTimestamp(lastActiveTimestamp),
        totalCheckIns: userCheckIns.length,
        savedStrategies: user.strategyState.savedIds.length,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.lastActive ?? 0).getTime() - new Date(a.lastActive ?? 0).getTime(),
    )
}

function computePulseAverages(
  checkIns: Array<WorkCheckInDocument & { docId: string }>,
): Pick<AdminOverviewStats, 'avgEnergy' | 'avgFocus' | 'avgStress'> {
  const energyValues: number[] = []
  const focusValues: number[] = []
  const stressValues: number[] = []

  for (const checkIn of checkIns) {
    const energy = typeof checkIn.energy === 'number' ? checkIn.energy : checkIn.energyTank
    const focus = typeof checkIn.focus === 'number' ? checkIn.focus : null
    const stress = typeof checkIn.stress === 'number' ? checkIn.stress : null

    if (typeof energy === 'number') energyValues.push(energy)
    if (typeof focus === 'number') focusValues.push(focus)
    if (typeof stress === 'number') stressValues.push(stress)
  }

  const average = (values: number[]) =>
    values.length > 0
      ? Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10
      : null

  return {
    avgEnergy: average(energyValues),
    avgFocus: average(focusValues),
    avgStress: average(stressValues),
  }
}

function buildStrategyRows(
  users: UserRecord[],
  strategyTitles: Map<string, string>,
): AdminStrategyRow[] {
  const views = new Map<string, number>()
  const saves = new Map<string, number>()
  const lastUsed = new Map<string, string>()

  for (const user of users) {
    for (const strategyId of user.strategyState.savedIds) {
      saves.set(strategyId, (saves.get(strategyId) ?? 0) + 1)
    }

    for (const [strategyId, usage] of Object.entries(user.strategyState.usage)) {
      if (usage.timesViewed > 0) {
        views.set(strategyId, (views.get(strategyId) ?? 0) + usage.timesViewed)
      }

      if (usage.lastViewedAt) {
        const current = lastUsed.get(strategyId)
        if (!current || usage.lastViewedAt > current) {
          lastUsed.set(strategyId, usage.lastViewedAt)
        }
      }
    }
  }

  const strategyIds = new Set([...views.keys(), ...saves.keys(), ...strategyTitles.keys()])

  return [...strategyIds]
    .map((strategyId) => ({
      strategyId,
      name: strategyTitles.get(strategyId) ?? strategyId,
      views: views.get(strategyId) ?? 0,
      saves: saves.get(strategyId) ?? 0,
      lastUsed: lastUsed.get(strategyId) ?? null,
    }))
    .sort((a, b) => b.views - a.views || b.saves - a.saves)
}

function buildMostSavedStrategies(
  users: UserRecord[],
  strategyTitles: Map<string, string>,
): SavedStrategyCount[] {
  const saveCounts = new Map<string, number>()

  for (const user of users) {
    for (const strategyId of user.strategyState.savedIds) {
      saveCounts.set(strategyId, (saveCounts.get(strategyId) ?? 0) + 1)
    }
  }

  return [...saveCounts.entries()]
    .map(([strategyId, saveCount]) => ({
      strategyId,
      title: strategyTitles.get(strategyId) ?? strategyId,
      saveCount,
    }))
    .sort((a, b) => b.saveCount - a.saveCount)
    .slice(0, 5)
}

function buildMostUsedFeatures(events: AnalyticsEventRecord[]): AdminFeatureUsage[] {
  const counts = new Map<AnalyticsEventType, number>()

  for (const event of events) {
    counts.set(event.eventType, (counts.get(event.eventType) ?? 0) + 1)
  }

  return [...counts.entries()]
    .map(([eventType, count]) => ({
      feature: ANALYTICS_FEATURE_LABELS[eventType],
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

function buildRecentActivity(
  events: AnalyticsEventRecord[],
  users: UserRecord[],
): AdminActivityItem[] {
  const nameByUserId = new Map(
    users.map((user) => [user.id, getUserName(user)]),
  )

  return [...events]
    .sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
    )
    .slice(0, 8)
    .map((event) => ({
      id: event.id,
      eventType: event.eventType,
      userId: event.userId,
      userName: nameByUserId.get(event.userId) ?? 'User',
      label: ANALYTICS_EVENT_LABELS[event.eventType],
      createdAt: formatTimestamp(event.createdAt),
    }))
}

function buildNewSignUps(users: UserRecord[]): AdminSignUp[] {
  return [...users]
    .sort(
      (a, b) =>
        (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0),
    )
    .slice(0, 5)
    .map((user) => ({
      userId: user.id,
      name: getUserName(user),
      email: user.email ?? user.profile.email,
      joinedAt: formatDate(user.createdAt),
    }))
}

function countActiveToday(
  users: UserRecord[],
  events: AnalyticsEventRecord[],
  checkIns: Array<WorkCheckInDocument & { docId: string }>,
): number {
  const today = getTodayString()
  const activeUserIds = new Set<string>()

  for (const user of users) {
    if (isToday(user.updatedAt)) {
      activeUserIds.add(user.id)
    }
  }

  for (const event of events) {
    if (isToday(event.createdAt)) {
      activeUserIds.add(event.userId)
    }
  }

  for (const checkIn of checkIns) {
    if (checkIn.date === today || isToday(checkIn.createdAt)) {
      activeUserIds.add(checkIn.userId)
    }
  }

  return activeUserIds.size
}

export async function fetchAdminDashboard(): Promise<AdminDashboardData> {
  const [users, events, checkIns, strategyTitles, feedback, bodyDoubleInterests] = await Promise.all([
    fetchUsers(),
    fetchAnalyticsEvents(),
    fetchWorkCheckIns(),
    fetchStrategyTitles(),
    fetchFeedbackRows(),
    fetchBodyDoubleInterests(),
  ])

  const totalStrategySaves = users.reduce(
    (sum, user) => sum + user.strategyState.savedIds.length,
    0,
  )

  const stats: AdminOverviewStats = {
    totalUsers: users.length || (await safeCount(collection(db, 'users'))),
    activeToday: countActiveToday(users, events, checkIns),
    totalCheckIns: checkIns.length || (await countCheckInsFallback()),
    totalStrategySaves,
    ...computePulseAverages(checkIns),
  }

  return {
    stats,
    newSignUps: buildNewSignUps(users),
    recentActivity: buildRecentActivity(events, users),
    mostUsedFeatures: buildMostUsedFeatures(events),
    mostSavedStrategies: buildMostSavedStrategies(users, strategyTitles),
    users: buildUserRows(users, checkIns, events),
    bodyDoubleInterests,
    strategies: buildStrategyRows(users, strategyTitles),
    feedback,
  }
}

async function countCheckInsFallback(): Promise<number> {
  const workCheckInCount = await safeCount(collectionGroup(db, 'workCheckIns'))
  if (workCheckInCount > 0) return workCheckInCount
  return safeCount(collection(db, 'checkIns'))
}
