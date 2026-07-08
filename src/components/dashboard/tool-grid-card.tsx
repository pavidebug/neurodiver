import { Link } from 'react-router-dom'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToolGridCardProps {
  to: string
  title: string
  description: string
  icon: LucideIcon
  iconClassName: string
  large?: boolean
}

export function ToolGridCard({
  to,
  title,
  description,
  icon: Icon,
  iconClassName,
  large = false,
}: ToolGridCardProps) {
  return (
    <Link
      to={to}
      className={cn(
        'group flex h-full rounded-3xl border border-border/80 bg-surface-solid shadow-sm transition-all duration-200 hover:border-green/25 hover:shadow-md active:scale-[0.99]',
        large ? 'min-h-[120px] p-5 lg:min-h-0 lg:p-7' : 'p-5',
      )}
    >
      <div className="flex h-full w-full items-start gap-4 lg:items-center lg:gap-5">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-2xl',
            large ? 'h-12 w-12 lg:h-16 lg:w-16' : 'h-12 w-12',
            iconClassName,
          )}
        >
          <Icon className={cn(large ? 'h-6 w-6 lg:h-8 lg:w-8' : 'h-6 w-6')} aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              'font-display font-semibold text-text',
              large ? 'text-lg lg:text-xl' : 'text-lg',
            )}
          >
            {title}
          </h3>
          <p
            className={cn(
              'mt-1 leading-relaxed text-text-muted',
              large ? 'text-sm lg:text-base' : 'text-sm',
            )}
          >
            {description}
          </p>
        </div>
        <ArrowRight
          className={cn(
            'shrink-0 text-text-muted/60 transition-transform group-hover:translate-x-0.5 group-hover:text-green',
            large ? 'mt-1 h-5 w-5 lg:mt-0 lg:h-6 lg:w-6' : 'mt-1 h-5 w-5',
          )}
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}
