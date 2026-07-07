import { Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { PreferenceRow } from '@/components/ui/preference-row'
import type { ContactProfileInput } from '@/lib/user-contact-profile'
import { cn } from '@/lib/utils'
import type { ReminderPreference } from '@/types/work-energy'

interface ReminderContactFormProps {
  value: ContactProfileInput
  onChange: (value: ContactProfileInput) => void
  compact?: boolean
  /** Booking screen: preference picker first, then contact fields */
  variant?: 'default' | 'booking'
}

const REMINDER_OPTIONS: Array<{
  value: ReminderPreference
  label: string
  description: string
}> = [
  {
    value: 'email',
    label: 'Email',
    description: 'Confirmations and reminders by email',
  },
  {
    value: 'whatsapp',
    label: 'WhatsApp',
    description: 'WhatsApp reminders coming soon',
  },
  {
    value: 'both',
    label: 'Both',
    description: 'Email now, WhatsApp when available',
  },
]

export function ReminderContactForm({
  value,
  onChange,
  compact = false,
  variant = 'default',
}: ReminderContactFormProps) {
  const isBooking = variant === 'booking'
  const showEmailField =
    !isBooking ||
    value.reminderPreference === 'email' ||
    value.reminderPreference === 'both'
  const showWhatsAppExtras =
    value.reminderPreference === 'whatsapp' || value.reminderPreference === 'both'
  const showWhatsAppInput = !isBooking || showWhatsAppExtras

  function patch(partial: Partial<ContactProfileInput>) {
    onChange({ ...value, ...partial })
  }

  const preferenceFieldset = (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-text">
        {isBooking ? 'How should we reach you?' : 'Reminder preference'}
      </legend>
      <div className="space-y-2">
        {REMINDER_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={value.reminderPreference === option.value}
            onClick={() => patch({ reminderPreference: option.value })}
            className={cn(
              'w-full rounded-2xl border-2 px-4 py-3 text-left transition-colors',
              value.reminderPreference === option.value
                ? 'border-green bg-green-muted'
                : 'border-border bg-surface hover:border-yellow hover:bg-yellow/15',
            )}
          >
            <span className="block font-medium text-text">{option.label}</span>
            <span className="mt-0.5 block text-sm text-text-muted">
              {option.description}
            </span>
          </button>
        ))}
      </div>
    </fieldset>
  )

  const emailField = showEmailField && (
    <div className="space-y-2">
      <label htmlFor="contact-email" className="block text-sm font-medium text-text">
        Email
      </label>
      <Input
        id="contact-email"
        type="email"
        autoComplete="email"
        value={value.email}
        onChange={(event) => patch({ email: event.target.value })}
        placeholder="you@example.com"
      />
      <p className="text-xs text-text-muted">
        Used for booking confirmations and session reminders only.
      </p>
    </div>
  )

  const whatsappField = showWhatsAppInput && (
    <div className="space-y-2">
      <label
        htmlFor="contact-whatsapp"
        className="block text-sm font-medium text-text"
      >
        WhatsApp number{' '}
        {!isBooking && <span className="font-normal text-text-muted">(optional)</span>}
      </label>
      <Input
        id="contact-whatsapp"
        type="tel"
        autoComplete="tel"
        value={value.whatsappNumber ?? ''}
        onChange={(event) =>
          patch({
            whatsappNumber: event.target.value.trim() || null,
            whatsappConsent: event.target.value.trim() ? value.whatsappConsent : false,
          })
        }
        placeholder="+1 555 000 0000"
      />
    </div>
  )

  const whatsappNotice = showWhatsAppExtras && (
    <p className="rounded-xl bg-yellow/25 px-4 py-3 text-sm text-text-muted">
      WhatsApp reminders coming soon. We&apos;ll save your number and preference for when
      messaging is enabled.
    </p>
  )

  const consentField = showWhatsAppExtras && value.whatsappNumber && (
    <label className="flex items-start gap-3 rounded-2xl border border-border bg-surface-solid p-4">
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 accent-green"
        checked={value.whatsappConsent}
        onChange={(event) => patch({ whatsappConsent: event.target.checked })}
      />
      <span className="text-sm leading-relaxed text-text">
        I agree to receive session reminders on WhatsApp when available.
      </span>
    </label>
  )

  const reminderToggle = (
    <PreferenceRow
      icon={Bell}
      label="Session reminders"
      description="24 hours and 30 minutes before your session"
      checked={value.reminderEnabled}
      onCheckedChange={(checked) => patch({ reminderEnabled: checked })}
    />
  )

  const timezoneField = !compact && (
    <div className="space-y-2">
      <label htmlFor="contact-timezone" className="block text-sm font-medium text-text">
        Timezone
      </label>
      <Input
        id="contact-timezone"
        value={value.timezone}
        onChange={(event) => patch({ timezone: event.target.value })}
        placeholder="Asia/Singapore"
      />
    </div>
  )

  if (isBooking) {
    return (
      <div className={cn('space-y-5', compact && 'space-y-4')}>
        {preferenceFieldset}
        {emailField}
        {whatsappField}
        {whatsappNotice}
        {consentField}
        {reminderToggle}
      </div>
    )
  }

  return (
    <div className={cn('space-y-5', compact && 'space-y-4')}>
      {emailField}
      {whatsappField}
      {preferenceFieldset}
      {whatsappNotice}
      {consentField}
      {reminderToggle}
      {timezoneField}
    </div>
  )
}
