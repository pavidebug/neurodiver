import type { LucideIcon } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'

interface PreferenceRowProps {
  icon: LucideIcon
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function PreferenceRow({
  icon: Icon,
  label,
  description,
  checked,
  onCheckedChange,
}: PreferenceRowProps) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-muted">
          <Icon className="h-5 w-5 text-green" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-text">{label}</p>
          <p className="text-sm text-text-muted">{description}</p>
        </div>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          aria-label={label}
        />
      </div>
    </Card>
  )
}
