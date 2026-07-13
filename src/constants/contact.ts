/** E.164 digits only, e.g. 60123456789 for Malaysia. Set VITE_SUPPORT_WHATSAPP in .env.local */
export const SUPPORT_WHATSAPP_NUMBER =
  (import.meta.env.VITE_SUPPORT_WHATSAPP as string | undefined)?.replace(/\D/g, '') ?? ''

export const SUPPORT_WHATSAPP_DEFAULT_MESSAGE =
  'Hi NeuroDiver team, I have a question about the app.'

export function buildSupportWhatsAppUrl(
  message = SUPPORT_WHATSAPP_DEFAULT_MESSAGE,
): string {
  const encoded = encodeURIComponent(message)
  if (SUPPORT_WHATSAPP_NUMBER) {
    return `https://wa.me/${SUPPORT_WHATSAPP_NUMBER}?text=${encoded}`
  }
  return `https://wa.me/?text=${encoded}`
}
