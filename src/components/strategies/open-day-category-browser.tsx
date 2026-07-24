import { BriefcaseBusiness, HeartPulse, UsersRound } from 'lucide-react'
import type { StrategyCategory } from '@/types/strategy'

const OPEN_DAY_CATEGORIES: Array<{
  category: StrategyCategory
  label: string
  description: string
  icon: typeof BriefcaseBusiness
  iconClass: string
  iconBackground: string
}> = [
  {
    category: 'Executive Function',
    label: 'Work',
    description: 'Starting, focusing, planning and workplace situations',
    icon: BriefcaseBusiness,
    iconClass: 'text-green',
    iconBackground: 'bg-green-muted',
  },
  {
    category: 'Social & Communication',
    label: 'Social',
    description: 'Communication, relationships and social overwhelm',
    icon: UsersRound,
    iconClass: 'text-lavender-deep',
    iconBackground: 'bg-lavender/35',
  },
  {
    category: 'Energy & Burnout',
    label: 'Wellness',
    description: 'Energy, sensory needs, recovery and daily care',
    icon: HeartPulse,
    iconClass: 'text-orange',
    iconBackground: 'bg-yellow/45',
  },
]

interface OpenDayCategoryBrowserProps {
  onSelect: (category: StrategyCategory, label: string) => void
}

export function OpenDayCategoryBrowser({
  onSelect,
}: OpenDayCategoryBrowserProps) {
  return (
    <section className="rounded-[1.75rem] border border-border bg-surface-solid p-5 shadow-sm sm:p-6">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-green">
          Browse by category
        </p>
        <h2 className="mt-1 font-display text-2xl font-semibold text-text">
          Where do you need support?
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {OPEN_DAY_CATEGORIES.map((item) => {
          const Icon = item.icon

          return (
            <button
              key={item.category}
              type="button"
              onClick={() => onSelect(item.category, item.label)}
              className="group rounded-2xl border border-border bg-cream/55 p-4 text-left transition-all hover:-translate-y-0.5 hover:border-green/30 hover:bg-green-muted/25 hover:shadow-sm"
            >
              <span
                className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.iconBackground}`}
              >
                <Icon className={`h-6 w-6 ${item.iconClass}`} aria-hidden="true" />
              </span>
              <span className="mt-3 block font-semibold text-text">{item.label}</span>
              <span className="mt-1 block text-sm leading-relaxed text-text-muted">
                {item.description}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
