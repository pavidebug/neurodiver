import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

interface PreferenceRowProps {
  icon: LucideIcon
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  className?: string
}

export function PreferenceRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
  className,
}: PreferenceRowProps) {
  return (
    <Card
      className={cn(
        'card-premium rounded-[1.25rem] border border-green/10 p-4 shadow-[0_2px_16px_rgba(31,42,36,0.05)]',
        className,
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-muted/80">
          <Icon className="h-5 w-5 text-green" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text">{label}</p>
          <p className="text-xs text-text-muted">{description}</p>
        </div>
        <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={label} />
      </div>
    </Card>
  )
}
