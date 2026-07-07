import { logger } from 'firebase-functions'
import type { SessionEmailContext, SessionBookingRecord, UserWorkProfileRecord } from '../types'

/**
 * WhatsApp reminder placeholder — wire Meta Cloud API / Twilio here later.
 * Requires WHATSAPP_API_TOKEN and WHATSAPP_PHONE_NUMBER_ID secrets when enabled.
 */
export async function sendWhatsAppReminder(
  profile: UserWorkProfileRecord,
  context: Pick<SessionEmailContext, 'bookingId' | 'kind' | 'session'>,
): Promise<'sent' | 'skipped_no_config' | 'skipped_no_consent'> {
  const apiToken = process.env.WHATSAPP_API_TOKEN?.trim()

  if (!profile.whatsappNumber?.trim()) {
    return 'skipped_no_consent'
  }

  if (!profile.whatsappConsent) {
    return 'skipped_no_consent'
  }

  if (!apiToken) {
    logger.info('WhatsApp API not configured — reminder stored for future delivery', {
      bookingId: context.bookingId,
      kind: context.kind,
    })
    return 'skipped_no_config'
  }

  // TODO: Integrate WhatsApp Business API
  logger.info('WhatsApp send placeholder', {
    to: profile.whatsappNumber,
    bookingId: context.bookingId,
  })

  return 'skipped_no_config'
}

export function wantsEmail(
  profile: UserWorkProfileRecord,
  booking?: SessionBookingRecord,
): boolean {
  if (booking?.reminderEnabled === false) return false
  if (profile.reminderEnabled === false) return false
  return profile.reminderPreference === 'email' || profile.reminderPreference === 'both'
}

export function wantsWhatsApp(profile: UserWorkProfileRecord): boolean {
  if (profile.reminderEnabled === false) return false
  return (
    profile.reminderPreference === 'whatsapp' || profile.reminderPreference === 'both'
  )
}

/** Confirmation emails always send when a contact email exists. */
export function shouldSendConfirmation(
  profile: UserWorkProfileRecord,
  booking?: SessionBookingRecord,
): boolean {
  return Boolean((booking?.contactEmail ?? profile.email)?.trim())
}
