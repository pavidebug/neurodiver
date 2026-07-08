import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { AppSidebar, navItems } from '@/components/layout/app-sidebar'
import { SkipLink } from '@/components/layout/skip-link'
import { NeuroDiverLogo } from '@/components/brand/neurodiver-logo'
import { useAuth } from '@/context/auth-context'
import { isAdminUser } from '@/utils/admin'
import { cn } from '@/lib/utils'

const hiddenNavRoutes = [
  '/work-check-in',
  '/work-reflection',
  '/check-in',
  '/reflection',
  '/brain-status',
  '/login',
  '/onboarding',
]

function MobileNavItem({
  to,
  label,
  icon: Icon,
}: {
  to: string
  label: string
  icon: typeof navItems[number]['icon']
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'flex min-h-14 min-w-[4.25rem] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-1.5 text-[11px] font-medium transition-colors',
          isActive
            ? 'bg-green-muted text-green'
            : 'text-text-muted hover:text-text',
        )
      }
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}

export function AppLayout() {
  const location = useLocation()
  const { user } = useAuth()
  const showAdmin = isAdminUser(user)
  const showNav = !hiddenNavRoutes.includes(location.pathname)
  const isHome = location.pathname === '/home'

  return (
    <div className="workspace-shell min-h-dvh lg:flex">
      <SkipLink />

      {showNav && <AppSidebar />}

      <div className="flex min-h-dvh flex-1 flex-col">
        {showNav && (
          <header className="flex items-center justify-between border-b border-border/60 bg-surface-solid/70 px-5 py-4 backdrop-blur-sm lg:hidden">
            <NeuroDiverLogo size="sm" />
          </header>
        )}

        <main
          className={cn(
            'workspace-main flex-1',
            showNav ? 'px-5 pt-5 pb-28 lg:px-12 lg:py-8 lg:pb-8' : 'px-5 py-8',
            isHome && 'lg:flex lg:flex-col lg:overflow-y-auto lg:py-10',
          )}
          id="main-content"
          tabIndex={-1}
        >
          <Outlet />
        </main>

        {showNav && (
          <nav
            aria-label="Main navigation"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border/80 bg-surface-solid/95 backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
              {navItems.map((item) => (
                <MobileNavItem key={item.to} {...item} />
              ))}
              {showAdmin ? (
                <MobileNavItem to="/admin" label="Admin" icon={Shield} />
              ) : null}
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
