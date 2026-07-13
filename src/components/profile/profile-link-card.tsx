import { Link } from 'react-router-dom'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReactNode } from 'react'

interface ProfileLinkCardProps {
  href?: string
  to?: string
  icon: LucideIcon
  title: string
  description: string
  badge?: ReactNode
  external?: boolean
  className?: string
}

export function ProfileLinkCard({
  href,
  to,
  icon: Icon,
  title,
  description,
  badge,
  external,
  className,
}: ProfileLinkCardProps) {
  const content = (
    <>
      {badge}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-muted/80 text-green">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-text">{title}</p>
          <p className="text-xs leading-relaxed text-text-muted">{description}</p>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-text-muted" aria-hidden="true" />
    </>
  )

  const baseClass = cn(
    'card-premium flex items-center gap-3 rounded-[1.25rem] bg-surface-solid p-4 shadow-[0_2px_16px_rgba(31,42,36,0.05)] transition-colors hover:bg-cream/50',
    badge && 'relative',
    className,
  )

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        className={cn(baseClass, 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange')}
      >
        {content}
      </a>
    )
  }

  if (to) {
    return (
      <Link
        to={to}
        className={cn(baseClass, 'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange')}
      >
        {content}
      </Link>
    )
  }

  return <div className={baseClass}>{content}</div>
}
