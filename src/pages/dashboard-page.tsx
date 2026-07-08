import { Link } from 'react-router-dom'
import { Activity, BarChart3, Layers, Users } from 'lucide-react'
import { CheckInHeroCard } from '@/components/dashboard/check-in-hero-card'
import { EncouragementBanner } from '@/components/dashboard/encouragement-banner'
import { ToolGridCard } from '@/components/dashboard/tool-grid-card'
import { useStrategies } from '@/context/strategy-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { useAuth } from '@/context/auth-context'
import { getBrainStatusFromWorkCheckIn } from '@/lib/strategy-analytics'
import { getDisplayName } from '@/lib/onboarding'
import { cn } from '@/lib/utils'

const tools = [
  {
    to: '/weekly-insights',
    title: 'Weekly Insights',
    description: 'Your calm weekly report after five check-ins.',
    icon: BarChart3,
    iconClassName: 'bg-green-muted text-green',
  },
  {
    to: '/energy-patterns',
    title: 'Energy Patterns',
    description: 'See how your work energy shifts over time.',
    icon: Activity,
    iconClassName: 'bg-yellow/70 text-text',
  },
  {
    to: '/strategies',
    title: 'Strategy Navigator',
    description: 'Swipeable cards with neurodivergent-friendly strategies.',
    icon: Layers,
    iconClassName: 'bg-orange/15 text-orange',
  },
  {
    to: '/body-double',
    title: 'Body Doubling',
    description: 'Browse, book, and join accountability sessions.',
    icon: Users,
    iconClassName: 'bg-lavender/60 text-lavender-deep',
  },
] as const

export function DashboardPage() {
  const { user } = useAuth()
  const { hasCheckedInToday, todayCheckIn, profile, loading } = useWorkEnergy()
  const { getRecommended, loading: strategiesLoading } = useStrategies()

  const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)
  const greetingName = getDisplayName(profile, user?.displayName ?? user?.email)
  const recommendedStrategies =
    brainStatus && hasCheckedInToday ? getRecommended(brainStatus, 3) : []
  const showRecommendations =
    !loading && hasCheckedInToday && recommendedStrategies.length > 0

  return (
    <div
      className={cn(
        'page-enter flex w-full flex-col space-y-8 pb-4',
        'lg:min-h-[calc(100dvh-5rem)] lg:justify-between lg:space-y-0 lg:gap-8',
      )}
    >
      <header className="relative shrink-0 px-1 pt-1 sm:px-2 lg:px-0 lg:pt-0">
        <div className="space-y-2 pb-2 pt-2 sm:space-y-3 lg:space-y-4 lg:pb-0 lg:pt-2">
          <p className="text-sm font-medium text-text-muted lg:text-base">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <h1 className="font-display text-3xl font-semibold tracking-tight text-text sm:text-4xl lg:text-5xl lg:leading-[1.15] xl:text-[3.25rem]">
            Good {getGreeting()}, {greetingName} ✨
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-text-muted lg:max-w-2xl lg:text-lg">
            Your calm workspace for check-ins, strategies, and body doubling sessions.
          </p>
        </div>
      </header>

      <p className="-mt-4 shrink-0 text-sm text-text-muted lg:hidden">
        Hi, {greetingName} — you&apos;re doing enough 🌿
      </p>

      <div
        className={cn(
          'grid gap-6 lg:min-h-0 lg:flex-1 lg:grid-cols-12 lg:gap-10',
          showRecommendations ? 'lg:flex-none' : '',
        )}
      >
        <div className="lg:col-span-5 lg:flex lg:min-h-[min(520px,calc(100dvh-22rem))] lg:flex-col">
          <CheckInHeroCard
            loading={loading}
            hasCheckedInToday={hasCheckedInToday}
            brainStatus={brainStatus}
            energyTank={todayCheckIn?.energyTank ?? null}
            className="lg:h-full lg:min-h-[min(520px,calc(100dvh-22rem))]"
          />
        </div>

        <section
          aria-labelledby="actions-heading"
          className="flex flex-col lg:col-span-7 lg:min-h-[min(520px,calc(100dvh-22rem))]"
        >
          <h2
            id="actions-heading"
            className="font-display mb-4 shrink-0 text-xl font-semibold text-text sm:text-2xl lg:mb-6 lg:text-3xl"
          >
            Your tools
          </h2>
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-rows-2 lg:gap-5">
            {tools.map((tool) => (
              <ToolGridCard key={tool.to} {...tool} large />
            ))}
          </div>
        </section>
      </div>

      {showRecommendations && (
        <section aria-labelledby="recommended-heading" className="shrink-0 space-y-4 lg:pt-2">
          <h2
            id="recommended-heading"
            className="font-display text-xl font-semibold text-text lg:text-2xl"
          >
            Recommended for today
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {(strategiesLoading ? [] : recommendedStrategies).map((strategy) => (
              <Link
                key={strategy.id}
                to="/strategies"
                className="rounded-3xl border border-border/80 bg-surface-solid p-4 shadow-sm transition-colors hover:border-green/20 hover:bg-cream/50 lg:p-5"
              >
                <p className="line-clamp-2 text-sm leading-relaxed text-text lg:text-base">
                  &ldquo;{strategy.situation}&rdquo;
                </p>
                <p className="mt-2 text-xs text-text-muted">{strategy.category}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="shrink-0 lg:pt-0">
        <EncouragementBanner large />
      </div>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
