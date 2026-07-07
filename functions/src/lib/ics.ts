interface BuildIcsInput {
  bookingId: string
  sessionTitle: string
  startsAt: Date
  durationMinutes: number
  platform: string
  meetingLink: string
  intention: string | null
  timezone: string
}

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

/** Build ICS content in memory — never touches the filesystem. */
export function buildSessionIcsContent(input: BuildIcsInput): string {
  const end = new Date(input.startsAt.getTime() + input.durationMinutes * 60_000)
  const tzid = escapeIcsText(input.timezone || 'UTC')
  const summary = escapeIcsText('NeuroDiver Body Doubling Session')
  const description = escapeIcsText(
    [
      input.sessionTitle,
      `Platform: ${input.platform}`,
      input.intention ? `Your intention: ${input.intention}` : null,
      input.meetingLink ? `Join: ${input.meetingLink}` : null,
    ]
      .filter(Boolean)
      .join('\n'),
  )

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//NeuroDiver//Body Doubling Pilot//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VTIMEZONE',
    `TZID:${tzid}`,
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0000',
    'TZOFFSETTO:+0000',
    'TZNAME:STD',
    'END:STANDARD',
    'END:VTIMEZONE',
    'BEGIN:VEVENT',
    `UID:${input.bookingId}@neurodiver.app`,
    `DTSTAMP:${formatIcsUtc(new Date())}`,
    `DTSTART;TZID=${tzid}:${formatIcsLocal(input.startsAt)}`,
    `DTEND;TZID=${tzid}:${formatIcsLocal(end)}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    input.meetingLink ? `URL:${input.meetingLink}` : null,
    `LOCATION:${escapeIcsText(input.platform)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ]
    .filter(Boolean)
    .join('\r\n')
}
