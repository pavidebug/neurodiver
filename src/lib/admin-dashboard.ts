import {
  collection,
  collectionGroup,
  getCountFromServer,
  getDocs,
  type Query,
  type Timestamp,
} from 'firebase/firestore'
import { ND_STATUS_OPTIONS, PROFESSION_OPTIONS } from '@/data/onboarding-steps'
import type { BrainStatusType } from '@/lib/data'
import { getTodayString } from '@/lib/dates'
import { db } from '@/lib/firebase'
import { getDisplayName } from '@/lib/onboarding'
import type {
  AdminActivityItem,
  AdminDashboardData,
  AdminFeatureUsage,
  AdminFeedbackRow,
  AdminOverviewStats,
  AdminSignUp,
  AdminStrategyRow,
  AdminUserRow,
  SavedStrategyCount,
} from '@/types/admin-dashboard'
import type { NdStatus, Profession } from '@/types/onboarding'
import {
  ANALYTICS_EVENT_LABELS,
  ANALYTICS_FEATURE_LABELS,
  type AnalyticsEventType,
} from '@/types/product-analytics'
import type { UserStrategyState } from '@/types/strategy'
import type { UserWorkProfile, WorkCheckInDocument } from '@/types/work-energy'

const BURNOUT_RISK_LABELS: Record<BrainStatusType, string> = {
  'high-energy': 'Low risk',
  steady: 'Stable',
  'running-low': 'Watch closely',
  'recovery-needed': 'High risk',
}

interface AnalyticsEventRecord {
  id: string
  eventType: AnalyticsEventType
  userId: string
  createdAt: Timestamp | null
}

interface UserRecord {
  id: string
  createdAt: Timestamp | null
  updatedAt: Timestamp | null
  profile: UserWorkProfile
  strategyState: UserStrategyState
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

function getProfessionLabel(value: Profession | null): string | null {
  if (!value) return null
  return PROFESSION_OPTIONS.find((option) => option.value === value)?.label ?? value
}

function getNdStatusLabel(value: NdStatus | null): string | null {
  if (!value) return null
  return ND_STATUS_OPTIONS.find((option) => option.value === value)?.label ?? value
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
      const brainStatus = latestCheckIn?.brainStatus ?? null

      const lastActiveTimestamp =
        latestEventByUser.get(user.id) ??
        user.updatedAt ??
        latestCheckIn?.createdAt ??
        user.createdAt

      return {
        userId: user.id,
        name: getDisplayName(user.profile),
        email: user.profile.email,
        joinedAt: formatDate(user.createdAt),
        lastActive: formatTimestamp(lastActiveTimestamp),
        profession: getProfessionLabel(user.profile.profession),
        ndStatus: getNdStatusLabel(user.profile.ndStatus),
        totalCheckIns: userCheckIns.length,
        savedStrategies: user.strategyState.savedIds.length,
        latestEnergy: latestCheckIn?.energyTank ?? null,
        latestBurnout: brainStatus ? BURNOUT_RISK_LABELS[brainStatus] : null,
      }
    })
    .sort(
      (a, b) =>
        new Date(b.lastActive ?? 0).getTime() - new Date(a.lastActive ?? 0).getTime(),
    )
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
    users.map((user) => [user.id, getDisplayName(user.profile)]),
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
      name: getDisplayName(user.profile),
      email: user.profile.email,
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
  const [users, events, checkIns, strategyTitles, feedback] = await Promise.all([
    fetchUsers(),
    fetchAnalyticsEvents(),
    fetchWorkCheckIns(),
    fetchStrategyTitles(),
    fetchFeedbackRows(),
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
  }

  return {
    stats,
    newSignUps: buildNewSignUps(users),
    recentActivity: buildRecentActivity(events, users),
    mostUsedFeatures: buildMostUsedFeatures(events),
    mostSavedStrategies: buildMostSavedStrategies(users, strategyTitles),
    users: buildUserRows(users, checkIns, events),
    strategies: buildStrategyRows(users, strategyTitles),
    feedback,
  }
}

async function countCheckInsFallback(): Promise<number> {
  const workCheckInCount = await safeCount(collectionGroup(db, 'workCheckIns'))
  if (workCheckInCount > 0) return workCheckInCount
  return safeCount(collection(db, 'checkIns'))
}
