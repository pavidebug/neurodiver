export interface AdminOverviewStats {
  totalUsers: number
  activeToday: number
  totalCheckIns: number
  totalStrategySaves: number
  avgEnergy: number | null
  avgFocus: number | null
  avgStress: number | null
}

export interface AdminSignUp {
  userId: string
  name: string
  email: string | null
  joinedAt: string | null
}

export interface AdminActivityItem {
  id: string
  eventType: string
  userId: string
  userName: string
  label: string
  createdAt: string | null
}

export interface AdminFeatureUsage {
  feature: string
  count: number
}

export interface SavedStrategyCount {
  strategyId: string
  title: string
  saveCount: number
}

export interface AdminUserRow {
  userId: string
  name: string
  email: string | null
  broughtHere: string | null
  familiarExperiences: string[]
  energyDrains: string[]
  supportStyle: string | null
  joinedAt: string | null
  lastActive: string | null
  totalCheckIns: number
  savedStrategies: number
}

export interface AdminBodyDoubleInterest {
  userId: string
  email: string
  isGuest: boolean
  joinedAt: string | null
}

export interface AdminStrategyRow {
  strategyId: string
  name: string
  views: number
  saves: number
  lastUsed: string | null
}

export interface AdminFeedbackRow {
  id: string
  userId: string
  rating: number
  comment: string | null
  date: string | null
}

export interface AdminDashboardData {
  stats: AdminOverviewStats
  newSignUps: AdminSignUp[]
  recentActivity: AdminActivityItem[]
  mostUsedFeatures: AdminFeatureUsage[]
  mostSavedStrategies: SavedStrategyCount[]
  users: AdminUserRow[]
  bodyDoubleInterests: AdminBodyDoubleInterest[]
  strategies: AdminStrategyRow[]
  feedback: AdminFeedbackRow[]
}
