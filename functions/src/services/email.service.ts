import { defineSecret } from 'firebase-functions/params'
import { logger } from 'firebase-functions'
import { buildSessionIcsContent } from '../lib/ics'
import type { EmailKind, SessionEmailContext } from '../types'

const resendApiKey = defineSecret('RESEND_API_KEY')
const emailFrom = defineSecret('EMAIL_FROM')

export { resendApiKey, emailFrom }

function formatSessionTime(date: Date, timezone: string): string {
  return date.toLocaleString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  })
}

function buildSubject(kind: EmailKind, sessionTitle: string): string {
  if (kind === 'confirmation') {
    return `You're booked — ${sessionTitle}`
  }
  if (kind === 'reminder_24h') {
    return `Reminder: Focus Together tomorrow — ${sessionTitle}`
  }
  if (kind === 'reminder_10m') {
    return `Starting in 10 minutes: ${sessionTitle}`
  }
  return `Starting soon: ${sessionTitle}`
}

function buildHtml(context: SessionEmailContext): string {
  const startsAt = context.session.startsAt.toDate()
  const when = formatSessionTime(startsAt, context.timezone)
  const intro =
    context.kind === 'confirmation'
      ? `<p>You're booked for a NeuroDiver Focus Together session.</p>`
      : context.kind === 'reminder_24h'
        ? `<p>Your Focus Together session is tomorrow.</p>`
        : context.kind === 'reminder_10m'
          ? `<p>Your Focus Together session starts in about 10 minutes.</p>`
          : `<p>Your Focus Together session starts in about 30 minutes.</p>`

  return [
    intro,
    `<p><strong>When:</strong> ${when}</p>`,
    `<p><strong>Duration:</strong> ${context.session.durationMinutes} minutes</p>`,
    `<p><strong>Platform:</strong> ${context.session.platform}</p>`,
    context.intention
      ? `<p><strong>Your intention:</strong> ${context.intention}</p>`
      : '',
    context.session.meetingLink
      ? `<p><strong>Join link:</strong> <a href="${context.session.meetingLink}">${context.session.meetingLink}</a></p>`
      : '',
    `<p>A calendar invite is attached. We hope to see you there.</p>`,
  ]
    .filter(Boolean)
    .join('')
}

function getResendApiKey(): string | null {
  return process.env.RESEND_API_KEY?.trim() || null
}

function getEmailFrom(): string {
  return process.env.EMAIL_FROM?.trim() || 'NeuroDiver <onboarding@resend.dev>'
}

export async function sendSessionEmail(
  context: SessionEmailContext,
): Promise<'sent' | 'skipped_no_config' | 'failed'> {
  const apiKey = getResendApiKey()
  const from = getEmailFrom()

  if (!apiKey) {
    logger.warn('RESEND_API_KEY not configured — skipping session email', {
      bookingId: context.bookingId,
      kind: context.kind,
    })
    return 'skipped_no_config'
  }

  const startsAt = context.session.startsAt.toDate()
  const icsContent = buildSessionIcsContent({
    bookingId: context.bookingId,
    sessionTitle: context.session.title,
    startsAt,
    durationMinutes: context.session.durationMinutes,
    platform: context.session.platform,
    meetingLink: context.session.meetingLink,
    intention: context.intention,
    timezone: context.timezone,
  })

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: context.toEmail,
        subject: buildSubject(context.kind, context.session.title),
        html: buildHtml(context),
        attachments: [
          {
            filename: `neurodiver-body-doubling-${context.sessionId}.ics`,
            content: Buffer.from(icsContent, 'utf8').toString('base64'),
          },
        ],
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      logger.error('Resend API error', { status: response.status, body })
      return 'failed'
    }

    return 'sent'
  } catch (error) {
    logger.error('Failed to send session email', error)
    return 'failed'
  }
}
