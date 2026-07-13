import { Link } from 'react-router-dom'
import { ArrowRight, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { typeBodyMuted, typeSectionTitle } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

interface BodyDoubleShortcutProps {
  className?: string
}

export function BodyDoubleShortcut({ className }: BodyDoubleShortcutProps) {
  return (
    <article
      className={cn(
        'rounded-[1.25rem] border border-border/60 bg-surface-solid px-5 py-4 shadow-[var(--shadow-premium)]',
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-muted text-green">
          <Users className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className={typeSectionTitle}>Focus Together</h3>
          <p className={cn(typeBodyMuted, 'mt-1')}>
            A quiet co-working session can help when you need company without conversation.
          </p>
          <Button asChild variant="outline" className="mt-3 rounded-full">
            <Link to="/body-double">
              View sessions
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
