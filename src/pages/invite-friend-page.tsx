import { useCallback, useMemo, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { ArrowLeft, Lock, Share2, Sparkles } from 'lucide-react'
import { InviteTemplateCard } from '@/components/invite/invite-template-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/context/auth-context'
import {
  buildShareText,
  buildWhatsAppUrl,
  GENERAL_INVITE_MESSAGE,
  INVITE_TEMPLATES,
  NEURODIVER_SHARE_URL,
} from '@/lib/invite-templates'
import { logShareEvent } from '@/lib/share-events'
import type { ShareTemplateId, ShareType } from '@/types/share-events'

export function InviteFriendPage() {
  const { user, isGuest, loading } = useAuth()
  const [copiedId, setCopiedId] = useState<ShareTemplateId | null>(null)

  const webShareSupported = useMemo(
    () => typeof navigator !== 'undefined' && typeof navigator.share === 'function',
    [],
  )

  const track = useCallback(
    (shareType: ShareType, templateId: ShareTemplateId) => {
      if (!user || isGuest) return
      logShareEvent({
        userId: user.uid,
        shareType,
        templateId,
        sourceScreen: 'profile',
        isGuest: false,
      })
    },
    [isGuest, user],
  )

  const getTemplateMessage = useCallback((templateId: ShareTemplateId): string => {
    if (templateId === 'general') return GENERAL_INVITE_MESSAGE
    return INVITE_TEMPLATES.find((template) => template.id === templateId)?.message ?? ''
  }, [])

  const handleCopy = useCallback(
    async (templateId: ShareTemplateId) => {
      const text = buildShareText(getTemplateMessage(templateId))
      try {
        await navigator.clipboard.writeText(text)
        setCopiedId(templateId)
        window.setTimeout(() => setCopiedId(null), 2000)
        track('copy', templateId)
      } catch {
        // Clipboard unavailable
      }
    },
    [getTemplateMessage, track],
  )

  const handleWhatsApp = useCallback(
    (templateId: ShareTemplateId) => {
      const text = buildShareText(getTemplateMessage(templateId))
      window.open(buildWhatsAppUrl(text), '_blank', 'noopener,noreferrer')
      track('whatsapp', templateId)
    },
    [getTemplateMessage, track],
  )

  const handleWebShare = useCallback(
    async (templateId: ShareTemplateId) => {
      if (!webShareSupported) return
      const message = getTemplateMessage(templateId)
      try {
        await navigator.share({
          title: 'NeuroDiver',
          text: message,
          url: NEURODIVER_SHARE_URL,
        })
        track('web_share', templateId)
      } catch {
        // User cancelled or share failed
      }
    },
    [getTemplateMessage, track, webShareSupported],
  )

  const handleGeneralShare = useCallback(async () => {
    if (webShareSupported) {
      try {
        await navigator.share({
          title: 'NeuroDiver',
          text: GENERAL_INVITE_MESSAGE,
          url: NEURODIVER_SHARE_URL,
        })
        track('web_share', 'general')
        return
      } catch {
        // Fall through to copy
      }
    }

    try {
      await navigator.clipboard.writeText(buildShareText(GENERAL_INVITE_MESSAGE))
      setCopiedId('general')
      window.setTimeout(() => setCopiedId(null), 2000)
      track('copy', 'general')
    } catch {
      // Clipboard unavailable
    }
  }, [track, webShareSupported])

  if (loading) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <p className="text-sm text-text-muted">Loading…</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  if (isGuest) {
    return (
      <div className="page-enter space-y-6 pb-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-xl"
            asChild
          >
            <Link to="/profile" aria-label="Back to profile">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="font-display text-xl font-semibold text-text">Invite a user</h1>
        </div>

        <Card className="border-orange/20 bg-orange/5">
          <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange/15">
              <Lock className="h-7 w-7 text-orange" aria-hidden="true" />
            </div>
            <div className="space-y-2">
              <p className="font-medium text-text">Sign in to invite users</p>
              <p className="text-sm leading-relaxed text-text-muted">
                Create a free account to share NeuroDiver with people you care about.
              </p>
            </div>
            <Button asChild className="w-full sm:w-auto">
              <Link to="/?email=1">Create an account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="page-enter space-y-8 pb-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl"
          asChild
        >
          <Link to="/profile" aria-label="Back to profile">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="font-display text-xl font-semibold text-text">Invite a user</h1>
      </div>

      <header className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-green" aria-hidden="true" />
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text">
            Invite someone to NeuroDiver
          </h2>
        </div>
        <p className="text-base leading-relaxed text-text-muted">
          Know someone who could use a softer way to understand their brain and get
          through the day?
        </p>
      </header>

      <section aria-labelledby="templates-heading" className="space-y-4">
        <h3 id="templates-heading" className="sr-only">
          Message templates
        </h3>
        {INVITE_TEMPLATES.map((template) => (
          <InviteTemplateCard
            key={template.id}
            template={template}
            copied={copiedId === template.id}
            webShareSupported={webShareSupported}
            onCopy={(id) => void handleCopy(id)}
            onWhatsApp={handleWhatsApp}
            onWebShare={(id) => void handleWebShare(id)}
          />
        ))}
      </section>

      <div className="sticky bottom-4 rounded-3xl bg-surface-solid/95 p-4 shadow-lg ring-1 ring-border backdrop-blur-sm">
        <Button type="button" size="lg" className="w-full gap-2" onClick={() => void handleGeneralShare()}>
          <Share2 className="h-5 w-5" aria-hidden="true" />
          {copiedId === 'general' ? 'Link copied!' : 'Share NeuroDiver'}
        </Button>
        <p className="mt-3 text-center text-xs text-text-muted">
          Messages never include your personal details — just a warm invite and link.
        </p>
      </div>
    </div>
  )
}
