import { NavLink } from 'react-router-dom'
import { Heart, Home, Layers, Shield, User, Users } from 'lucide-react'
import { NeuroDiverLogo } from '@/components/brand/neurodiver-logo'
import { useAuth } from '@/context/auth-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { useFeatureConfig } from '@/context/feature-config-context'
import { getDisplayName } from '@/lib/onboarding'
import { isAdminUser } from '@/utils/admin'
import { sidebarWidth, touchTarget } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/home', label: 'Today', icon: Home, featureKey: 'today' },
  { to: '/strategies', label: 'Strategies', icon: Layers, featureKey: 'strategies' },
  { to: '/body-double', label: 'Body Double', icon: Users, featureKey: 'bodyDouble' },
  { to: '/profile', label: 'Profile', icon: User, featureKey: null },
] as const

export function AppSidebar() {
  const { user } = useAuth()
  const { profile } = useWorkEnergy()
  const { isPageEnabled } = useFeatureConfig()
  const displayName = getDisplayName(profile, user?.displayName ?? user?.email)
  const initials = displayName.slice(0, 1).toUpperCase()
  const showAdmin = isAdminUser(user)

  return (
    <aside
      aria-label="Main navigation"
      className={cn(
        'hidden lg:sticky lg:top-0 lg:flex lg:h-dvh lg:min-h-dvh lg:shrink-0 lg:flex-col lg:self-start lg:border-r lg:border-green/10 lg:bg-gradient-to-b lg:from-surface-solid lg:via-surface-solid lg:to-green-muted/35 lg:px-4 lg:py-6 lg:shadow-[8px_0_32px_rgba(45,90,61,0.04)]',
        sidebarWidth,
      )}
    >
      <NeuroDiverLogo className="mb-8 shrink-0 px-1" />

      <nav className="flex flex-col gap-1">
        {navItems.filter((item) => !item.featureKey || isPageEnabled(item.featureKey)).map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'relative flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-all duration-200',
                touchTarget,
                isActive
                  ? 'bg-gradient-to-r from-green-muted to-sage-light/60 text-green shadow-sm ring-1 ring-green/10'
                  : 'text-text-muted hover:bg-cream-dark/80 hover:text-text',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {label}
                {isActive ? (
                  <span
                    className="absolute left-1.5 h-1.5 w-1.5 rounded-full bg-green"
                    aria-hidden="true"
                  />
                ) : null}
              </>
            )}
          </NavLink>
        ))}
        {showAdmin ? (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-2xl px-4 py-2.5 text-sm font-medium transition-colors duration-200',
                touchTarget,
                isActive
                  ? 'bg-gradient-to-r from-green-muted to-sage-light/60 text-green shadow-sm ring-1 ring-green/10'
                  : 'text-text-muted hover:bg-cream-dark/80 hover:text-text',
              )
            }
          >
            <Shield className="h-5 w-5 shrink-0" aria-hidden="true" />
            Admin
          </NavLink>
        ) : null}
      </nav>

      <div className="mt-auto space-y-3 pt-6">
        <div className="rounded-2xl border border-green/10 bg-gradient-to-br from-cream/90 to-green-muted/60 p-3.5 shadow-sm">
          <div className="flex gap-3">
            <Heart className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-text-muted">
              Small steps today, big shifts tomorrow.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl px-2 py-2">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              alt=""
              className="h-10 w-10 rounded-full object-cover ring-2 ring-green-muted"
            />
          ) : (
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full bg-green text-sm font-semibold text-white"
              aria-hidden="true"
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-text">Hi, {displayName}</p>
            <p className="truncate text-xs text-text-muted">You&apos;re doing enough 🌿</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export { navItems }
