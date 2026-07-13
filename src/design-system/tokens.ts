/**
 * NeuroDiver responsive design tokens.
 * Breakpoints align with Tailwind: sm (640), md (768), lg (1024), xl (1280).
 */

export const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  laptop: 1024,
  desktop: 1280,
} as const

export const SPACING = {
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
} as const

export const CONTENT_MAX = {
  tablet: 720,
  laptop: 1040,
  desktop: 1280,
  form: 860,
} as const

/** Main content column — mobile full width, tablet 720, laptop 1040, desktop 1280 */
export const contentWidth =
  'mx-auto w-full max-w-none sm:max-w-[720px] lg:max-w-[1040px] xl:max-w-[1280px]'

export const contentWidthWide =
  'mx-auto w-full max-w-none lg:max-w-[1040px] xl:max-w-[1280px]'

export const contentWidthFull = 'mx-auto w-full max-w-none'

export const formWidth =
  'mx-auto w-full max-w-none sm:max-w-[720px] lg:max-w-[860px]'

/** Page shell padding: mobile 20px, tablet 32px, laptop/desktop 40–48px */
export const pagePadding = 'px-5 sm:px-8 lg:px-10 xl:px-12'

export const pagePaddingBottomNav = 'pb-[calc(5rem+env(safe-area-inset-bottom))] lg:pb-8'

export const sectionGap = 'space-y-8 xl:space-y-12'

export const cardGap = 'gap-4 sm:gap-5 lg:gap-6'

/** Typography — serif for major headings only */
export const typePageTitle =
  'font-display text-[2rem] font-semibold leading-tight tracking-tight text-text sm:text-[2.5rem] xl:text-5xl'

export const typeSectionTitle =
  'font-display text-[1.375rem] font-semibold leading-tight tracking-tight text-text sm:text-[1.625rem] xl:text-[1.875rem]'

export const typeCardTitle =
  'text-lg font-medium leading-snug text-text sm:text-xl xl:text-[1.375rem]'

export const typeBody =
  'text-[0.9375rem] leading-relaxed text-text sm:text-base lg:text-[1.0625rem]'

export const typeBodyMuted =
  'text-[0.9375rem] leading-relaxed text-text-muted sm:text-base lg:text-[1.0625rem]'

export const typeHelper =
  'text-[0.8125rem] leading-relaxed text-text-muted lg:text-sm'

export const typeLabel =
  'text-sm font-medium text-text'

/** Cards */
export const surfaceCard =
  'rounded-[1.25rem] border border-border bg-surface shadow-[var(--shadow-premium)] transition-shadow duration-200 xl:rounded-3xl'

export const surfaceCardPadding = 'p-5 sm:p-6 xl:p-8'

export const surfaceCardInteractive =
  'card-premium rounded-[1.25rem] border border-border bg-surface shadow-[var(--shadow-premium)] transition-all duration-200 xl:rounded-3xl'

/** Buttons — pill shape, touch-friendly */
export const buttonPrimary =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 py-4 text-[0.9375rem] font-semibold transition-all duration-200 ease-out active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:pointer-events-none disabled:opacity-50 lg:min-h-12 lg:px-7 lg:text-base'

/** Chips */
export const chipBase =
  'inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2.5 text-sm font-medium transition-colors duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange lg:min-h-10 lg:px-4 lg:text-[0.9375rem]'

export const chipSelected = 'bg-green text-white shadow-sm'

export const chipDefault =
  'bg-surface-solid text-text ring-1 ring-border hover:bg-yellow/30'

/** Forms */
export const inputBase =
  'flex h-[3.25rem] w-full rounded-2xl border border-border bg-surface-solid px-4 text-[0.9375rem] text-text transition-colors placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-50 lg:h-14 lg:text-base'

export const textareaBase =
  'flex min-h-[7.5rem] w-full resize-none rounded-2xl border border-border bg-surface-solid px-4 py-3 text-[0.9375rem] text-text transition-colors placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange disabled:cursor-not-allowed disabled:opacity-50 lg:min-h-[8.75rem] lg:text-base'

/** Strategy situation tiles */
export const strategyTileGrid =
  'grid grid-cols-3 justify-items-center gap-x-0 gap-y-2 sm:grid-cols-4 sm:gap-x-0 sm:gap-y-2 md:grid-cols-5 md:gap-y-2.5 lg:grid-cols-6 lg:gap-x-0 lg:gap-y-2.5 xl:grid-cols-6 2xl:grid-cols-7'

export const strategyTileSize =
  'aspect-square w-[4rem] sm:w-[4.25rem] lg:w-[4.5rem] xl:w-[4.75rem]'

export const strategyTileIcon =
  'h-5 w-5 shrink-0 lg:h-[1.375rem] lg:w-[1.375rem]'

export const strategyTileLabel =
  'line-clamp-2 text-center text-[0.6875rem] leading-snug font-medium text-text sm:text-[0.6875rem] lg:text-xs'

export const strategyTileHover =
  'transition-all duration-200 ease-out group-hover:scale-[1.02] group-hover:-translate-y-0.5 group-hover:shadow-[0_8px_24px_rgba(47,93,80,0.08)] group-active:scale-[0.98]'

/** Feature & dashboard grids */
export const featureGrid =
  'grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6 xl:grid-cols-2'

export const dashboardGrid =
  'grid grid-cols-1 gap-4 sm:gap-5 lg:grid-cols-2 lg:gap-6'

/** Navigation */
export const sidebarWidth = 'lg:w-60 xl:w-64 2xl:w-72'

export const mobileNavIcon = 'h-6 w-6'

export const mobileNavLabel = 'text-[11px] font-medium leading-none'

export const touchTarget = 'min-h-11 min-w-11'
