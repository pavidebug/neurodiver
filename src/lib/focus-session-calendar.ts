import { getSessionEnd } from '@/lib/focus-session-format'
import type { FocusSession, SessionBooking } from '@/types/body-doubling'

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
}

function formatIcsUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z')
}

function formatIcsLocal(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, '0')
  return (
    `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}` +
    `T${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`
  )
}

function buildDescription(
  session: FocusSession,
  booking: SessionBooking,
): string {
  return [
    'NeuroDiver Body Doubling Session',
    `Platform: ${session.platform}`,
    booking.intention ? `Your intention: ${booking.intention}` : null,
    session.meetingLink ? `Join: ${session.meetingLink}` : null,
  ]
    .filter(Boolean)
    .join('\n')
}

export interface SessionIcsOptions {
  timezone?: string
}

/**
 * Build ICS calendar content in memory — no filesystem paths required.
 */
export function buildSessionIcsContent(
  session: FocusSession,
  booking: SessionBooking,
  options: SessionIcsOptions = {},
): string {
  const timezone =
    options.timezone?.trim() || Intl.DateTimeFormat().resolvedOptions().timeZone
  const start = session.startsAt
  const end = getSessionEnd(session)
  const summary = escapeIcsText('NeuroDiver Body Doubling Session')
  const description = escapeIcsText(buildDescription(session, booking))
  const uid = `${booking.id}@neurodiver.app`
  const tzid = escapeIcsText(timezone)

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NeuroDiver//Body Doubling Pilot//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    `TZID:${tzid}`,
    'X-LIC-LOCATION:' + tzid,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0000',
    'TZOFFSETTO:+0000',
    'TZNAME:STD',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART;TZID=${tzid}:${formatIcsLocal(start)}`,
    `DTEND;TZID=${tzid}:${formatIcsLocal(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    session.meetingLink ? `URL:${session.meetingLink}` : null,
    `LOCATION:${escapeIcsText(session.platform)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}

/** Trigger a browser download of ICS content generated in memory. */
export function downloadSessionIcsFile(
  session: FocusSession,
  booking: SessionBooking,
  options: SessionIcsOptions = {},
): void {
  const content = buildSessionIcsContent(session, booking, options)
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `neurodiver-body-doubling-${session.id}.ics`
  link.click()
  URL.revokeObjectURL(url)
}

export function buildSessionIcsAttachment(
  session: FocusSession,
  booking: SessionBooking,
  options: SessionIcsOptions = {},
): { filename: string; content: string; mimeType: string } {
  return {
    filename: `neurodiver-body-doubling-${session.id}.ics`,
    content: buildSessionIcsContent(session, booking, options),
    mimeType: 'text/calendar;charset=utf-8',
  }
}
