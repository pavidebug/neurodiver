import { getBuildVersionLabel } from '@/constants/build-info'
import { cn } from '@/lib/utils'

interface BuildInfoFooterProps {
  className?: string
  showDivider?: boolean
}

export function BuildInfoFooter({ className, showDivider = true }: BuildInfoFooterProps) {
  return (
    <footer
      aria-label="Build information"
      className={cn(
        'px-4 py-8 text-center lg:py-10',
        showDivider && 'border-t border-border/50',
        className,
      )}
    >
      <p className="text-[0.8125rem] leading-relaxed text-[#6B6B63]">
        {getBuildVersionLabel()}
      </p>
      <p className="mt-3 text-xs leading-relaxed text-[#6B6B63]/90">
        You&apos;re helping shape what&apos;s next.
        <br />
        Thank you for building with us.
      </p>
    </footer>
  )
}
