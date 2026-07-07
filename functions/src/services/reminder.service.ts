import { getFirestore, FieldValue } from 'firebase-admin/firestore'
import { logger } from 'firebase-functions'
import { sendSessionEmail } from './email.service'
import { sendWhatsAppReminder, shouldSendConfirmation, wantsEmail, wantsWhatsApp } from './whatsapp.service'
import type {
  FocusSessionRecord,
  SessionBookingRecord,
  SessionEmailContext,
  UserWorkProfileRecord,
} from '../types'

const db = getFirestore()

export async function loadSession(sessionId: string): Promise<FocusSessionRecord | null> {
  const snap = await db.collection('focusSessions').doc(sessionId).get()
  if (!snap.exists) return null
  return snap.data() as FocusSessionRecord
}

export async function loadUserProfile(
  userId: string,
): Promise<UserWorkProfileRecord> {
  const snap = await db.collection('users').doc(userId).get()
  const workProfile = snap.data()?.workProfile
  return (workProfile ?? {}) as UserWorkProfileRecord
}

async function logEmailAttempt(
  context: SessionEmailContext,
  status: string,
): Promise<void> {
  await db.collection('sessionEmailLog').add({
    bookingId: context.bookingId,
    sessionId: context.sessionId,
    userId: context.userId,
    kind: context.kind,
    toEmail: context.toEmail,
    status,
    createdAt: FieldValue.serverTimestamp(),
  })
}

export async function sendBookingConfirmation(
  bookingId: string,
  booking: SessionBookingRecord,
): Promise<void> {
  const session = await loadSession(booking.sessionId)
  if (!session) {
    logger.error('Session not found for booking confirmation', { bookingId })
    return
  }

  const profile = await loadUserProfile(booking.userId)
  const toEmail = (booking.contactEmail ?? profile.email)?.trim()

  if (!shouldSendConfirmation(profile, booking) || !toEmail) {
    logger.info('No contact email — skipping confirmation', { bookingId })
    return
  }

  const context: SessionEmailContext = {
    bookingId,
    sessionId: booking.sessionId,
    userId: booking.userId,
    toEmail,
    session,
    intention: booking.intention ?? null,
    timezone: profile.timezone ?? 'UTC',
    kind: 'confirmation',
  }

  const status = await sendSessionEmail(context)
  await logEmailAttempt(context, status)

  if (status === 'sent') {
    await db.collection('sessionBookings').doc(bookingId).update({
      confirmationEmailSentAt: FieldValue.serverTimestamp(),
    })
  }

  if (wantsWhatsApp(profile)) {
    await sendWhatsAppReminder(profile, {
      bookingId,
      kind: 'confirmation',
      session,
    })
  }
}

export async function sendScheduledReminder(
  bookingId: string,
  booking: SessionBookingRecord,
  kind: 'reminder_24h' | 'reminder_30m' | 'reminder_10m',
): Promise<void> {
  const session = await loadSession(booking.sessionId)
  if (!session) return

  if (booking.reminderEnabled === false) {
    return
  }

  const profile = await loadUserProfile(booking.userId)
  const toEmail = (booking.contactEmail ?? profile.email)?.trim()

  if (!wantsEmail(profile, booking) || !toEmail) {
    return
  }

  const context: SessionEmailContext = {
    bookingId,
    sessionId: booking.sessionId,
    userId: booking.userId,
    toEmail,
    session,
    intention: booking.intention ?? null,
    timezone: profile.timezone ?? 'UTC',
    kind,
  }

  const status = await sendSessionEmail(context)
  await logEmailAttempt(context, status)

  const field =
    kind === 'reminder_24h'
      ? 'reminder24hSentAt'
      : kind === 'reminder_10m'
        ? 'reminder10mSentAt'
        : 'reminder30mSentAt'

  if (status === 'sent') {
    await db.collection('sessionBookings').doc(bookingId).update({
      [field]: FieldValue.serverTimestamp(),
    })
  }

  if (wantsWhatsApp(profile)) {
    await sendWhatsAppReminder(profile, { bookingId, kind, session })
  }
}
