import { Check, Copy, MessageCircle, Share2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { InviteTemplate } from '@/lib/invite-templates'
import type { ShareTemplateId } from '@/types/share-events'

interface InviteTemplateCardProps {
  template: InviteTemplate
  copied: boolean
  webShareSupported: boolean
  onCopy: (templateId: ShareTemplateId) => void
  onWhatsApp: (templateId: ShareTemplateId) => void
  onWebShare: (templateId: ShareTemplateId) => void
}

export function InviteTemplateCard({
  template,
  copied,
  webShareSupported,
  onCopy,
  onWhatsApp,
  onWebShare,
}: InviteTemplateCardProps) {
  return (
    <Card className="border-green/15 bg-green-muted/25">
      <CardContent className="space-y-4 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-green">
          {template.label}
        </p>
        <p className="text-sm leading-relaxed text-text">&ldquo;{template.message}&rdquo;</p>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="default"
            className="min-h-11 flex-1 px-4 text-sm sm:flex-none"
            onClick={() => onCopy(template.id)}
          >
            {copied ? (
              <Check className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="default"
            className="min-h-11 flex-1 px-4 text-sm sm:flex-none"
            onClick={() => onWhatsApp(template.id)}
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            WhatsApp
          </Button>
          {webShareSupported && (
            <Button
              type="button"
              variant="ghost"
              size="default"
              className="min-h-11 flex-1 px-4 text-sm sm:flex-none"
              onClick={() => onWebShare(template.id)}
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Share
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
