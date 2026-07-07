import type { ReminderPreference, UserWorkProfile } from '@/types/work-energy'

export interface ContactProfileInput {
  email: string
  whatsappNumber: string | null
  whatsappConsent: boolean
  reminderPreference: ReminderPreference
  reminderEnabled: boolean
  timezone: string
}

export function buildContactProfileDefaults(
  profile: UserWorkProfile,
  authEmail?: string | null,
): ContactProfileInput {
  return {
    email: profile.email ?? authEmail ?? '',
    whatsappNumber: profile.whatsappNumber,
    whatsappConsent: profile.whatsappConsent,
    reminderPreference: profile.reminderPreference,
    reminderEnabled: profile.reminderEnabled,
    timezone: profile.timezone,
  }
}

export function normalizeContactProfileInput(
  input: ContactProfileInput,
): ContactProfileInput {
  const whatsappDigits = input.whatsappNumber?.replace(/\s+/g, '').trim() || null

  return {
    email: input.email.trim(),
    whatsappNumber: whatsappDigits,
    whatsappConsent: Boolean(whatsappDigits && input.whatsappConsent),
    reminderPreference: input.reminderPreference,
    reminderEnabled: input.reminderEnabled,
    timezone: input.timezone.trim() || Intl.DateTimeFormat().resolvedOptions().timeZone,
  }
}

export function isContactProfileValid(input: ContactProfileInput): boolean {
  if (!input.email.trim()) return false
  if (!input.timezone.trim()) return false

  if (input.reminderPreference === 'whatsapp' || input.reminderPreference === 'both') {
    if (!input.whatsappNumber?.trim()) return false
    if (!input.whatsappConsent) return false
  }

  return true
}

export function wantsEmailReminders(input: ContactProfileInput): boolean {
  if (!input.reminderEnabled) return false
  return input.reminderPreference === 'email' || input.reminderPreference === 'both'
}

export function wantsWhatsAppReminders(input: ContactProfileInput): boolean {
  if (!input.reminderEnabled) return false
  return input.reminderPreference === 'whatsapp' || input.reminderPreference === 'both'
}
