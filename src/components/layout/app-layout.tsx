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

function NavItem({
  to,
  label,
  icon: Icon,
  layout,
}: {
  to: string
  label: string
  icon: typeof Home
  layout: 'mobile' | 'desktop'
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          'font-medium transition-colors duration-200',
          layout === 'mobile' &&
            'flex min-h-14 min-w-[4.5rem] flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-xs',
          layout === 'desktop' &&
            'flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm',
          isActive
            ? 'bg-green-muted text-green'
            : 'text-text-muted hover:bg-yellow/40 hover:text-text',
        )
      }
    >
      <Icon className={cn('shrink-0', layout === 'mobile' ? 'h-5 w-5' : 'h-5 w-5')} aria-hidden="true" />
      <span>{label}</span>
    </NavLink>
  )
}

export function AppLayout() {
  const location = useLocation()
  const showNav = !hiddenNavRoutes.includes(location.pathname)

  return (
    <div className="min-h-dvh bg-cream lg:flex">
      <SkipLink />

      {showNav && (
        <aside
          aria-label="Main navigation"
          className="hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:w-64 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-cream lg:px-4 lg:py-8"
        >
          <p className="font-display mb-8 px-3 text-xl font-semibold tracking-tight text-text">
            NeuroDiver
          </p>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavItem key={item.to} {...item} layout="desktop" />
            ))}
          </nav>
        </aside>
      )}

      <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-1 flex-col lg:max-w-none">
        <main
          className={cn(
            'flex-1 px-5 pt-6 lg:px-8 lg:pt-8',
            showNav ? 'pb-28 lg:pb-8' : 'pb-8',
          )}
          id="main-content"
          tabIndex={-1}
        >
          <Outlet />
        </main>

        {showNav && (
          <nav
            aria-label="Main navigation"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-cream/95 backdrop-blur-md lg:hidden"
          >
            <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2">
              {navItems.map((item) => (
                <NavItem key={item.to} {...item} layout="mobile" />
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}
