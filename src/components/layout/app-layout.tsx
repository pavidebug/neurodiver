import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Shield } from 'lucide-react'
import { AppSidebar, navItems } from '@/components/layout/app-sidebar'
import { SkipLink } from '@/components/layout/skip-link'
import { NeuroDiverLogo } from '@/components/brand/neurodiver-logo'
import {
  contentWidth,
  contentWidthWide,
  mobileNavIcon,
  mobileNavLabel,
  pagePadding,
  pagePaddingBottomNav,
  touchTarget,
} from '@/design-system/tokens'
import { useAuth } from '@/context/auth-context'
import { useFeatureConfig } from '@/context/feature-config-context'
import { isAdminUser } from '@/utils/admin'
import { cn } from '@/lib/utils'

const hiddenNavRoutes = [
  '/work-check-in',
  '/today-reflection',
  '/weekly-reflection',
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
  icon: typeof navItems[number]['icon'] | typeof Shield
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          touchTarget,
          'flex min-w-[3.25rem] flex-col items-center justify-center gap-0.5 rounded-2xl border border-transparent px-1.5 py-1.5 transition-all duration-200 active:scale-[0.96]',
          mobileNavLabel,
          isActive
            ? 'bg-[#E8F0EB]/80 font-semibold text-[#2F5D50] ring-1 ring-green/20'
            : 'text-[#6B6B63] hover:text-[#1F2A24]',
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              mobileNavIcon,
              'shrink-0 transition-transform duration-200',
              isActive && 'scale-105 text-[#2F5D50]',
            )}
            aria-hidden="true"
          />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  )
}

export function AppLayout() {
  const location = useLocation()
  const { user } = useAuth()
  const { isPageEnabled } = useFeatureConfig()
  const showAdmin = isAdminUser(user)
  const showNav = !hiddenNavRoutes.includes(location.pathname)
  const isHome = location.pathname === '/home'
  const isBodyDouble = location.pathname === '/body-double'
  const isWorkCheckIn = location.pathname === '/work-check-in'
  const isTodayReflection = location.pathname === '/today-reflection'
  const showSidebar = showNav || isWorkCheckIn || isTodayReflection
  const showMobileHeader = showNav
  const mobileNavItems = navItems.filter(
    (item) => !item.featureKey || isPageEnabled(item.featureKey),
  )

  return (
    <div
      className={cn(
        'workspace-shell min-h-dvh lg:flex lg:min-h-dvh lg:items-stretch',
        isBodyDouble && 'bg-[#F9F7F2] lg:bg-cream',
      )}
    >
      <SkipLink />

      {showSidebar && <AppSidebar />}

      <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
        {showMobileHeader && (
          <header className="border-b border-green/10 bg-gradient-to-r from-surface-solid/90 via-surface-solid/85 to-green-muted/70 shadow-sm backdrop-blur-md lg:hidden">
            <div className={cn(contentWidth, pagePadding, 'py-4')}>
              <NeuroDiverLogo size="sm" />
            </div>
          </header>
        )}

        <main
          className={cn(
            'workspace-main relative min-w-0 flex-1 overflow-hidden',
            pagePadding,
            showNav && cn('pt-4', pagePaddingBottomNav),
            !showNav && 'py-8',
            isWorkCheckIn && !showNav && 'pt-4 pb-6 lg:py-8',
            isTodayReflection && !showNav && 'pt-4 pb-6 lg:py-8',
            isHome && 'bg-[#FDFCF9] lg:flex lg:flex-col lg:overflow-y-auto lg:bg-transparent lg:py-10',
            isBodyDouble && 'bg-[#F9F7F2] lg:bg-transparent lg:py-10',
          )}
          id="main-content"
          tabIndex={-1}
        >
          <div
            className={cn(
              'workspace-content relative z-[1] min-w-0',
              isBodyDouble ? contentWidthWide : contentWidth,
              isWorkCheckIn && 'sm:max-w-[860px]',
              isTodayReflection && 'sm:max-w-[860px]',
            )}
          >
            <Outlet />
          </div>
        </main>

        {showNav && (
          <nav
            aria-label="Main navigation"
            className="fixed inset-x-4 bottom-[max(0.75rem,env(safe-area-inset-bottom))] z-50 lg:hidden"
          >
            <div className="mx-auto flex min-h-[4.5rem] max-h-20 w-full items-stretch justify-around gap-0.5 rounded-[1.75rem] border border-white/80 bg-gradient-to-r from-white/95 via-white/95 to-green-muted/90 px-2.5 py-2.5 shadow-[0_8px_32px_rgba(47,93,80,0.14)] backdrop-blur-md">
              {mobileNavItems.map((item) => (
                <MobileNavItem key={`${item.to}-${item.label}`} {...item} />
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
