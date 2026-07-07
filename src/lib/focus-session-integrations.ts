import type { SessionBooking } from '@/types/body-doubling'

/**
 * Future automation hooks for Body Doubling pilot.
 * Calendar content is generated in memory — never written to disk.
 * Wire Google Calendar, Outlook, email, and WhatsApp APIs here later.
 */
export async function scheduleCalendarInvite(_booking: SessionBooking): Promise<void> {
  // TODO: Google Calendar API — create event from in-memory ICS metadata
  // TODO: Outlook Calendar API — create event from in-memory ICS metadata
}

export async function scheduleEmailReminder(_booking: SessionBooking): Promise<void> {
  // TODO: Email reminder — attach ICS via buildSessionIcsAttachment() content, not a file path
}

export async function scheduleWhatsAppReminder(_booking: SessionBooking): Promise<void> {
  // TODO: WhatsApp reminder automation
}

export async function runPostBookingIntegrations(booking: SessionBooking): Promise<void> {
  try {
    await Promise.all([
      scheduleCalendarInvite(booking),
      scheduleEmailReminder(booking),
      scheduleWhatsAppReminder(booking),
    ])
  } catch {
    // Integrations are best-effort — never block the booking flow.
  }
}
