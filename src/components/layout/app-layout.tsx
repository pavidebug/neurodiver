import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Home, Layers, Users, User } from 'lucide-react'
import { SkipLink } from '@/components/layout/skip-link'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/home', label: 'Home', icon: Home },
  { to: '/strategies', label: 'Strategies', icon: Layers },
  { to: '/body-double', label: 'Body Double', icon: Users },
  { to: '/profile', label: 'Profile', icon: User },
]

const hiddenNavRoutes = [
  '/work-check-in',
  '/work-reflection',
  '/check-in',
  '/reflection',
  '/brain-status',
  '/login',
]

export function AppLayout() {
  const location = useLocation()
  const showNav = !hiddenNavRoutes.includes(location.pathname)

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col bg-cream">
      <SkipLink />

      <main
        className={cn(
          'flex-1 px-5 pt-6',
          showNav ? 'pb-28' : 'pb-8',
        )}
        id="main-content"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      {showNav && (
        <nav
          aria-label="Main navigation"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-cream/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    'flex min-h-14 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs font-medium transition-colors duration-200',
                    isActive
                      ? 'bg-green-muted text-green'
                      : 'text-text-muted hover:bg-yellow/40 hover:text-text',
                  )
                }
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </div>
  )
}
