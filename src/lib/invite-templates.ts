import type { ShareTemplateId } from '@/types/share-events'

export const NEURODIVER_SHARE_URL =
  typeof window !== 'undefined' ? window.location.origin : 'https://neurodiver.app'

export interface InviteTemplate {
  id: ShareTemplateId
  label: string
  message: string
}

export const INVITE_TEMPLATES: InviteTemplate[] = [
  {
    id: 'soft_invite',
    label: 'Soft invite',
    message:
      'Hey, I found this app called NeuroDiver. It’s a gentle productivity tool for people whose brains don’t work well with rigid systems. Thought you might like it 🌿',
  },
  {
    id: 'body_doubling',
    label: 'Body doubling invite',
    message:
      'Hey, I’m trying a focus session on NeuroDiver. It’s like quiet body doubling, no pressure, camera optional. Want to join me?',
  },
  {
    id: 'check_in',
    label: 'Check-in invite',
    message:
      'Hey, I’ve been using NeuroDiver to do quick daily check-ins and get strategies based on my energy. Thought this might be helpful for you too.',
  },
]

export const GENERAL_INVITE_MESSAGE =
  'Check out NeuroDiver — a gentle way to understand your brain and get through the day. 🌿'

export function buildShareText(message: string, includeUrl = true): string {
  if (!includeUrl) return message
  return `${message}\n\n${NEURODIVER_SHARE_URL}`
}

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}
