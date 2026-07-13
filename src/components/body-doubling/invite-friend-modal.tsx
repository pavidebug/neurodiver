import { createPortal } from 'react-dom'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Check, Copy, MessageCircle, Share2, X } from 'lucide-react'
import { useAuth } from '@/context/auth-context'
import {
  buildShareText,
  buildWhatsAppUrl,
  INVITE_TEMPLATES,
  NEURODIVER_SHARE_URL,
} from '@/lib/invite-templates'
import { logShareEvent } from '@/lib/share-events'
import { cn } from '@/lib/utils'
import type { ShareTemplateId, ShareType } from '@/types/share-events'

const TEMPLATE_ID: ShareTemplateId = 'body_doubling'

interface InviteFriendModalProps {
  open: boolean
  onClose: () => void
}

export function InviteFriendModal({ open, onClose }: InviteFriendModalProps) {
  const { user, isGuest } = useAuth()
  const [copied, setCopied] = useState(false)

  const template = INVITE_TEMPLATES.find((item) => item.id === TEMPLATE_ID)
  const shareText = useMemo(
    () => buildShareText(template?.message ?? ''),
    [template?.message],
  )

  const webShareSupported = useMemo(
    () => typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    [],
  )

  const track = useCallback(
    (shareType: ShareType) => {
      if (!user || isGuest) return
      logShareEvent({
        userId: user.uid,
        shareType,
        templateId: TEMPLATE_ID,
        sourceScreen: 'body_double',
        isGuest: false,
      })
    },
    [isGuest, user],
  )

  useEffect(() => {
    if (!open) {
      setCopied(false)
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(shareText)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
      track('copy')
    } catch {
      // Clipboard unavailable
    }
  }, [shareText, track])

  const handleWhatsApp = useCallback(() => {
    window.open(buildWhatsAppUrl(shareText), '_blank', 'noopener,noreferrer')
    track('whatsapp')
  }, [shareText, track])

  const handleWebShare = useCallback(async () => {
    if (!webShareSupported || !template) return

    try {
      await navigator.share({
        title: 'NeuroDiver',
        text: template.message,
        url: NEURODIVER_SHARE_URL,
      })
      track('web_share')
      onClose()
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return
      void handleCopy()
    }
  }, [handleCopy, onClose, template, track, webShareSupported])

  if (!open || !template) return null

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-[#1F2A24]/30 backdrop-blur-[2px]"
        aria-label="Close invite"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="invite-friend-modal-title"
        className={cn(
          'popup-enter relative z-10 w-full max-w-[390px] max-h-[min(90dvh,640px)] overflow-y-auto rounded-[1.5rem]',
          'bg-white shadow-[0_12px_40px_rgba(47,93,80,0.15)]',
        )}
      >
        <div className="flex items-start justify-between gap-3 px-5 pt-5">
          <h2
            id="invite-friend-modal-title"
            className="font-display text-xl font-semibold text-[#1F2A24]"
          >
            Invite a friend
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[#6B6B63] transition-colors hover:bg-[#F9F7F2]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4 px-5 py-4">
          <p className="text-sm leading-relaxed text-[#6B6B63]">
            Share a ready-made message — edit it if you like before sending.
          </p>
          <p className="rounded-2xl bg-[#F9F7F2] px-4 py-3 text-sm leading-relaxed text-[#1F2A24]">
            &ldquo;{template.message}&rdquo;
          </p>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => void handleCopy()}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#E8E4DA] bg-white px-4 text-sm font-medium text-[#1F2A24] transition-colors hover:bg-[#F9F7F2] active:scale-[0.98]"
            >
              {copied ? (
                <Check className="h-4 w-4 text-[#2F5D50]" aria-hidden="true" />
              ) : (
                <Copy className="h-4 w-4" aria-hidden="true" />
              )}
              {copied ? 'Copied!' : 'Copy message'}
            </button>

            <button
              type="button"
              onClick={handleWhatsApp}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-4 text-sm font-medium text-white transition-all hover:bg-[#20bd5a] active:scale-[0.98]"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Send on WhatsApp
            </button>

            {webShareSupported ? (
              <button
                type="button"
                onClick={() => void handleWebShare()}
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#2F5D50] px-4 text-sm font-medium text-white transition-all hover:bg-[#3a6d5f] active:scale-[0.98]"
              >
                <Share2 className="h-4 w-4" aria-hidden="true" />
                Share
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
