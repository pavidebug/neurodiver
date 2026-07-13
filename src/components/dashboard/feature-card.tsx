import { Link } from 'react-router-dom'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  to: string
  icon: LucideIcon
  title: string
  description: string
  cta: string
  iconClassName?: string
  className?: string
  delay?: number
}

export function FeatureCard({
  to,
  icon: Icon,
  title,
  description,
  cta,
  iconClassName,
  className,
  delay = 0,
}: FeatureCardProps) {
  return (
    <article
      className={cn(
        'card-premium slide-up flex flex-col gap-3 rounded-[1.5rem] bg-surface-solid p-5 shadow-[0_4px_24px_rgba(31,42,36,0.06)] lg:p-6',
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-green-muted text-green',
            iconClassName,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <h3 className="font-display text-lg font-semibold text-text lg:text-xl">{title}</h3>
      </div>

      <p className="text-sm leading-relaxed text-text-muted">{description}</p>

      <Button
        asChild
        variant="outline"
        className="mt-auto w-full rounded-full border-green/30 hover:bg-green-muted/50"
      >
        <Link to={to}>
          {cta}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </article>
  )
}
