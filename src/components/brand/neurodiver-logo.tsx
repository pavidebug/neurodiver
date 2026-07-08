import { cn } from '@/lib/utils'

interface NeuroDiverLogoProps {
  className?: string
  showText?: boolean
  size?: 'sm' | 'md'
}

export function NeuroDiverLogo({
  className,
  showText = true,
  size = 'md',
}: NeuroDiverLogoProps) {
  const heightClass = size === 'sm' ? 'h-8' : 'h-10'

  if (!showText) {
    return (
      <div className={cn('flex shrink-0 items-center', className)}>
        <img
          src="/neurodiver-icon.png"
          alt="NeuroDiver"
          className={cn('rounded-xl object-contain', size === 'sm' ? 'h-9 w-9' : 'h-10 w-10')}
        />
      </div>
    )
  }

  return (
    <div className={cn('flex shrink-0 items-center', className)}>
      <img
        src="/neurodiver-logo.png"
        alt="NeuroDiver"
        className={cn('w-auto max-w-full object-contain', heightClass)}
      />
    </div>
  )
}
