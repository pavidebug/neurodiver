import {
  LayoutDashboard,
  CalendarDays,
  Layers,
  MessageSquare,
  SlidersHorizontal,
  Users,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { NeuroDiverLogo } from '@/components/brand/neurodiver-logo'
import { cn } from '@/lib/utils'

const adminNavItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users, end: false },
  { to: '/admin/strategies', label: 'Strategies', icon: Layers, end: false },
  { to: '/admin/feedback', label: 'Feedback', icon: MessageSquare, end: false },
  { to: '/admin/modules', label: 'Page visibility', icon: SlidersHorizontal, end: false },
  { to: '/admin/body-double', label: 'Body Double sessions', icon: CalendarDays, end: false },
] as const

export function AdminSidebar() {
  return (
    <aside
      aria-label="Admin navigation"
      className="sticky top-0 flex h-dvh min-h-dvh w-[15.5rem] shrink-0 self-start flex-col overflow-y-auto border-r border-border/80 bg-surface-solid px-4 py-6"
    >
      <div className="mb-8 px-2">
        <NeuroDiverLogo size="sm" />
        <p className="mt-3 text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
          Product analytics
        </p>
      </div>

      <nav className="flex flex-col gap-1">
        {adminNavItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex min-h-10 items-center gap-3 rounded-2xl px-3 py-2 text-sm font-medium transition-colors duration-200',
                isActive
                  ? 'bg-green-muted text-green shadow-sm'
                  : 'text-text-muted hover:bg-cream-dark/80 hover:text-text',
              )
            }
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-2xl border border-border/70 bg-lavender-muted/50 p-4">
        <p className="text-xs leading-relaxed text-text-muted">
          Pilot dashboard — calm, simple, easy to scan.
        </p>
      </div>
    </aside>
  )
}

export { adminNavItems }
