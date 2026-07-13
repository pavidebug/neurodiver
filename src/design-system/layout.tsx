import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import {
  cardGap,
  contentWidth,
  contentWidthFull,
  contentWidthWide,
  dashboardGrid,
  featureGrid,
  formWidth,
  sectionGap,
  strategyTileGrid,
  typeSectionTitle,
} from '@/design-system/tokens'

type ContentSize = 'default' | 'wide' | 'full' | 'form'

const contentSizeClass: Record<ContentSize, string> = {
  default: contentWidth,
  wide: contentWidthWide,
  full: contentWidthFull,
  form: formWidth,
}

interface PageContainerProps {
  children: ReactNode
  className?: string
  size?: ContentSize
}

/** Centers page content with responsive max-widths. */
export function PageContainer({
  children,
  className,
  size = 'default',
}: PageContainerProps) {
  return (
    <div className={cn('page-enter w-full', contentSizeClass[size], className)}>
      {children}
    </div>
  )
}

interface SectionProps {
  children: ReactNode
  className?: string
  title?: string
  icon?: ReactNode
  as?: 'section' | 'div'
}

/** Vertical section with optional title and consistent spacing. */
export function Section({
  children,
  className,
  title,
  icon,
  as: Tag = 'section',
}: SectionProps) {
  return (
    <Tag className={cn(sectionGap, className)}>
      {title ? (
        <h2 className={cn(typeSectionTitle, 'flex items-center gap-2')}>
          {icon}
          {title}
        </h2>
      ) : null}
      {children}
    </Tag>
  )
}

interface StackProps {
  children: ReactNode
  className?: string
  gap?: 'card' | 'section'
}

export function Stack({ children, className, gap = 'section' }: StackProps) {
  return (
    <div className={cn(gap === 'section' ? sectionGap : cn('flex flex-col', cardGap), className)}>
      {children}
    </div>
  )
}

interface FormShellProps {
  children: ReactNode
  className?: string
}

/** Centered form column for check-in, reset, and profile flows. */
export function FormShell({ children, className }: FormShellProps) {
  return <div className={cn(formWidth, 'w-full', className)}>{children}</div>
}

interface StrategyTileGridProps {
  children: ReactNode
  className?: string
}

export function StrategyTileGrid({ children, className }: StrategyTileGridProps) {
  return <div className={cn(strategyTileGrid, className)}>{children}</div>
}

interface FeatureGridProps {
  children: ReactNode
  className?: string
}

export function FeatureGrid({ children, className }: FeatureGridProps) {
  return <div className={cn(featureGrid, className)}>{children}</div>
}

interface DashboardGridProps {
  children: ReactNode
  className?: string
}

export function DashboardGrid({ children, className }: DashboardGridProps) {
  return <div className={cn(dashboardGrid, className)}>{children}</div>
}
