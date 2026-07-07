import { onDocumentCreated } from 'firebase-functions/v2/firestore'
import { onSchedule } from 'firebase-functions/v2/scheduler'
import { initializeApp } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { resendApiKey, emailFrom } from './services/email.service'
import { sendBookingConfirmation, sendScheduledReminder } from './services/reminder.service'
import type { SessionBookingRecord } from './types'

initializeApp()

export const onSessionBookingCreated = onDocumentCreated(
  {
    document: 'sessionBookings/{bookingId}',
    secrets: [resendApiKey, emailFrom],
  },
  async (event) => {
    const bookingId = event.params.bookingId
    const booking = event.data?.data() as SessionBookingRecord | undefined

    if (!booking) return

    try {
      await sendBookingConfirmation(bookingId, booking)
    } catch (error) {
      logger.error('Booking confirmation pipeline failed', { bookingId, error })
    }
  },
)

const REMINDER_WINDOWS_MS = {
  reminder_24h: { target: 24 * 60 * 60 * 1000, tolerance: 20 * 60 * 1000 },
  reminder_30m: { target: 30 * 60 * 1000, tolerance: 10 * 60 * 1000 },
  reminder_10m: { target: 10 * 60 * 1000, tolerance: 5 * 60 * 1000 },
} as const

/**
 * Runs every 15 minutes. Finds upcoming bookings and sends 24h / 30m reminders.
 */
export const processSessionReminders = onSchedule(
  {
    schedule: 'every 15 minutes',
    secrets: [resendApiKey, emailFrom],
  },
  async () => {
    const db = getFirestore()
    const now = Date.now()
    const horizon = now + 25 * 60 * 60 * 1000

    const sessionsSnap = await db
      .collection('focusSessions')
      .where('startsAt', '>', new Date(now))
      .where('startsAt', '<=', new Date(horizon))
      .get()

    if (sessionsSnap.empty) return

    for (const sessionDoc of sessionsSnap.docs) {
      const session = sessionDoc.data()
      const startsAt = session.startsAt.toDate().getTime()
      const msUntilStart = startsAt - now

      const bookingsSnap = await db
        .collection('sessionBookings')
        .where('sessionId', '==', sessionDoc.id)
        .where('attendanceStatus', '==', 'booked')
        .get()

      for (const bookingDoc of bookingsSnap.docs) {
        const booking = bookingDoc.data() as SessionBookingRecord
        const bookingId = bookingDoc.id

        for (const kind of ['reminder_24h', 'reminder_30m', 'reminder_10m'] as const) {
          const window = REMINDER_WINDOWS_MS[kind]
          const alreadySentField =
            kind === 'reminder_24h'
              ? booking.reminder24hSentAt
              : kind === 'reminder_10m'
                ? booking.reminder10mSentAt
                : booking.reminder30mSentAt

          if (alreadySentField) continue

          const delta = Math.abs(msUntilStart - window.target)
          if (delta > window.tolerance) continue

          try {
            await sendScheduledReminder(bookingId, booking, kind)
          } catch (error) {
            logger.error('Scheduled reminder failed', { bookingId, kind, error })
          }
        }
      }
    }
  },
)
