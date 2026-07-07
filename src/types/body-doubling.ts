import type { Timestamp } from 'firebase/firestore'

export type SessionPlatform = 'Google Meet' | 'Microsoft Teams'

export type AttendanceStatus = 'booked' | 'attended' | 'no-show' | 'cancelled'

export type SessionHelpfulRating = 'yes' | 'somewhat' | 'not-today'

export type CompletedPlanRating = 'yes' | 'mostly' | 'not-today'

export interface FocusSessionDocument {
  title: string
  startsAt: Timestamp
  durationMinutes: number
  platform: SessionPlatform
  meetingLink: string
  capacity: number
  isActive: boolean
  /** Reserved for future calendar / reminder automation */
  integrations?: {
    googleCalendarEventId: string | null
    outlookCalendarEventId: string | null
    emailReminderEnabled: boolean
    whatsappReminderEnabled: boolean
  }
}

export interface FocusSession {
  id: string
  title: string
  startsAt: Date
  durationMinutes: number
  platform: SessionPlatform
  meetingLink: string
  capacity: number
  isActive: boolean
  bookedCount: number
}

export interface SessionBookingDocument {
  userId: string
  sessionId: string
  bookedAt: Timestamp
  intention: string | null
  attendanceStatus: AttendanceStatus
}

export interface SessionBooking {
  id: string
  userId: string
  sessionId: string
  bookedAt: Date
  intention: string | null
  attendanceStatus: AttendanceStatus
}

export interface SessionFeedbackDocument {
  userId: string
  sessionId: string
  bookingId: string
  sessionHelpful: SessionHelpfulRating
  completedPlan: CompletedPlanRating
  wouldJoinAgain: number
  notes: string | null
  submittedAt: Timestamp
}

export interface SessionFeedbackInput {
  userId: string
  sessionId: string
  bookingId: string
  sessionHelpful: SessionHelpfulRating
  completedPlan: CompletedPlanRating
  wouldJoinAgain: number
  notes: string | null
}

export interface SessionBookingInput {
  userId: string
  sessionId: string
  intention: string | null
  contactEmail?: string | null
  reminderEnabled?: boolean
}
