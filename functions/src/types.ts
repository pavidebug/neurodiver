export interface FocusSessionRecord {
  title: string
  startsAt: FirebaseFirestore.Timestamp
  durationMinutes: number
  platform: string
  meetingLink: string
}

export interface UserWorkProfileRecord {
  email?: string | null
  whatsappNumber?: string | null
  whatsappConsent?: boolean
  reminderPreference?: 'email' | 'whatsapp' | 'both'
  reminderEnabled?: boolean
  timezone?: string
}

export interface SessionBookingRecord {
  userId: string
  sessionId: string
  intention?: string | null
  attendanceStatus: string
  contactEmail?: string | null
  reminderEnabled?: boolean | null
  confirmationEmailSentAt?: FirebaseFirestore.Timestamp | null
  reminder24hSentAt?: FirebaseFirestore.Timestamp | null
  reminder30mSentAt?: FirebaseFirestore.Timestamp | null
  reminder10mSentAt?: FirebaseFirestore.Timestamp | null
}

export type EmailKind = 'confirmation' | 'reminder_24h' | 'reminder_30m' | 'reminder_10m'

export interface SessionEmailContext {
  bookingId: string
  sessionId: string
  userId: string
  toEmail: string
  session: FocusSessionRecord
  intention: string | null
  timezone: string
  kind: EmailKind
}
