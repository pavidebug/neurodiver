import { Link, Outlet, useLocation } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { AdminSidebar, adminNavItems } from '@/components/admin/AdminSidebar'
import { AdminDashboardProvider } from '@/context/admin-dashboard-context'
import { useAuth } from '@/context/auth-context'

const sectionTitles: Record<string, string> = {
  '/admin': 'Overview',
  '/admin/users': 'Users',
  '/admin/strategies': 'Strategies',
  '/admin/feedback': 'Feedback',
  '/admin/modules': 'Page visibility',
  '/admin/body-double': 'Body Double sessions',
}

function getSectionTitle(pathname: string): string {
  if (sectionTitles[pathname]) return sectionTitles[pathname]

  const match = adminNavItems.find((item) => pathname.startsWith(item.to) && item.to !== '/admin')
  return match?.label ?? 'Admin'
}

export function AdminLayout() {
  const location = useLocation()
  const { user } = useAuth()
  const sectionTitle = getSectionTitle(location.pathname)

  return (
    <div className="workspace-shell min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-[1440px]">
        <AdminSidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-green/10 bg-gradient-to-r from-surface-solid/95 via-surface-solid/90 to-green-muted/70 px-6 py-4 shadow-sm backdrop-blur-md lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-text-muted">
                  Product Analytics
                </p>
                <h1 className="font-display text-2xl font-semibold tracking-tight text-text">
                  {sectionTitle}
                </h1>
              </div>

              <div className="flex items-center gap-4">
                <p className="hidden text-sm text-text-muted sm:block">
                  {user?.email}
                </p>
                <Link
                  to="/home"
                  className="inline-flex items-center gap-2 rounded-2xl border border-border bg-surface px-3 py-2 text-sm font-medium text-text transition-colors hover:bg-cream-dark/80"
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                  Back to app
                </Link>
              </div>
            </div>
          </header>

          <main className="workspace-main relative flex-1 overflow-hidden px-6 py-6 lg:px-8 lg:py-8">
            <div className="workspace-content relative z-[1]">
              <AdminDashboardProvider>
                <Outlet />
              </AdminDashboardProvider>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
