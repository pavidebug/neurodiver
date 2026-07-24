import { Outlet } from 'react-router-dom'
import { SkipLink } from '@/components/layout/skip-link'
import { contentWidthWide, pagePadding } from '@/design-system/tokens'
import { cn } from '@/lib/utils'

export function AppLayout() {
  return (
    <div className="workspace-shell min-h-dvh bg-[#FDFCF9]">
      <SkipLink />

      <main
        className={cn(
          'workspace-main relative min-h-dvh min-w-0 overflow-hidden py-5 sm:py-8 lg:overflow-y-auto lg:bg-transparent',
          pagePadding,
        )}
        id="main-content"
        tabIndex={-1}
      >
        <div
          className={cn(
            'workspace-content relative z-[1] min-w-0 max-w-[1120px]',
            contentWidthWide,
          )}
        >
          <Outlet />
        </div>
      </main>
    </div>
  )
}
