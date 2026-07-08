export type AnalyticsEventType =
  | 'user_signed_up'
  | 'completed_onboarding'
  | 'completed_check_in'
  | 'opened_strategy_card'
  | 'saved_strategy'
  | 'started_body_doubling'
  | 'submitted_feedback'

export interface AnalyticsEventDocument {
  eventType: AnalyticsEventType
  userId: string
  createdAt: import('firebase/firestore').Timestamp
  metadata?: Record<string, string | number | boolean | null>
}

export const ANALYTICS_EVENT_TYPES: AnalyticsEventType[] = [
  'user_signed_up',
  'completed_onboarding',
  'completed_check_in',
  'opened_strategy_card',
  'saved_strategy',
  'started_body_doubling',
  'submitted_feedback',
]

export const ANALYTICS_EVENT_LABELS: Record<AnalyticsEventType, string> = {
  user_signed_up: 'User signed up',
  completed_onboarding: 'Completed onboarding',
  completed_check_in: 'Completed check-in',
  opened_strategy_card: 'Opened strategy cards',
  saved_strategy: 'Saved strategy',
  started_body_doubling: 'Started body doubling',
  submitted_feedback: 'Submitted feedback',
}

export const ANALYTICS_FEATURE_LABELS: Record<AnalyticsEventType, string> = {
  user_signed_up: 'Sign up',
  completed_onboarding: 'Onboarding',
  completed_check_in: 'Check-in',
  opened_strategy_card: 'Strategy cards',
  saved_strategy: 'Save strategy',
  started_body_doubling: 'Body doubling',
  submitted_feedback: 'Feedback',
}
