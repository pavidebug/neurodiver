import { Link } from 'react-router-dom'
import { Activity, ArrowRight, BarChart3, Layers, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WORK_CHECK_IN_QUESTION_COUNT } from '@/data/work-check-in-questions'
import { useStrategies } from '@/context/strategy-context'
import { useWorkEnergy } from '@/context/work-energy-context'
import { getStatusColor, getStatusLabel } from '@/lib/data'
import { getBrainStatusFromWorkCheckIn } from '@/lib/strategy-analytics'
import { getEnergySummary } from '@/lib/work-check-in-labels'

export function DashboardPage() {
  const { hasCheckedInToday, todayCheckIn, loading } = useWorkEnergy()
  const { getRecommended, loading: strategiesLoading } = useStrategies()

  const brainStatus = getBrainStatusFromWorkCheckIn(todayCheckIn)
  const recommendedStrategies =
    brainStatus && hasCheckedInToday ? getRecommended(brainStatus, 3) : []

  const actions = [
    {
      to: '/weekly-insights',
      title: 'Weekly Insights',
      description: 'Your calm weekly report after five check-ins.',
      icon: BarChart3,
      accent: 'bg-green-muted text-green',
    },
    {
      to: '/energy-patterns',
      title: 'Energy Patterns',
      description: 'See how your work energy shifts over time.',
      icon: Activity,
      accent: 'bg-yellow/60 text-text',
    },
    {
      to: '/strategies',
      title: 'Strategy Navigator',
      description: 'Swipeable cards with neurodivergent-friendly strategies.',
      icon: Layers,
      accent: 'bg-orange/10 text-orange',
    },
    {
      to: '/body-double',
      title: 'Body Doubling',
      description: 'Browse, book, and join accountability sessions.',
      icon: Users,
      accent: 'bg-yellow/60 text-text',
    },
  ]

  return (
    <div className="page-enter mx-auto w-full space-y-8 lg:max-w-6xl lg:space-y-10">
      <header className="lg:border-b lg:border-border lg:pb-8">
        <p className="mb-1 text-sm font-medium text-text-muted">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text lg:text-4xl">
          Good {getGreeting()}, friend
        </h1>
        <p className="mt-2 hidden text-base text-text-muted lg:block">
          Your calm workspace for check-ins, strategies, and body doubling sessions.
        </p>
      </header>

      <div className="space-y-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-8 lg:space-y-0">
        <div className="space-y-4 lg:col-span-5 lg:sticky lg:top-8">
          {loading ? (
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-text-muted">Loading your check-in status…</p>
              </CardContent>
            </Card>
          ) : hasCheckedInToday && todayCheckIn ? (
            <>
              <Card className="border-green/20 bg-green-muted/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Today&apos;s check-in complete</CardTitle>
                  <CardDescription>
                    Thanks for checking in. Your responses stay private to you.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {brainStatus && (
                    <div className="rounded-2xl border border-border bg-surface-solid p-4">
                      <p className="text-sm font-medium text-text-muted">Brain Status</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span
                          className={`h-3 w-3 shrink-0 rounded-full ${getStatusColor(brainStatus)}`}
                          aria-hidden="true"
                        />
                        <p className="font-display text-xl font-semibold text-text">
                          {getStatusLabel(brainStatus)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-text-muted">
                        {getEnergySummary(todayCheckIn.energyTank)}
                      </p>
                    </div>
                  )}
                  <Button asChild variant="ghost" className="px-0">
                    <Link to="/work-reflection">
                      View Daily Work Reflection
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {(strategiesLoading || recommendedStrategies.length > 0) && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Recommended strategies</CardTitle>
                    <CardDescription>
                      Picked for how your energy feels today.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {strategiesLoading ? (
                      <p className="text-sm text-text-muted">Loading strategies…</p>
                    ) : (
                      recommendedStrategies.map((strategy) => (
                        <Link
                          key={strategy.id}
                          to="/strategies"
                          className="block rounded-xl border border-border bg-cream/50 px-4 py-3 transition-colors hover:border-green/20 hover:bg-yellow/15"
                        >
                          <p className="line-clamp-2 text-sm leading-relaxed text-text">
                            &ldquo;{strategy.situation}&rdquo;
                          </p>
                          <p className="mt-1 text-xs text-text-muted">{strategy.category}</p>
                        </Link>
                      ))
                    )}
                    {!strategiesLoading && recommendedStrategies.length > 0 && (
                      <Button asChild variant="outline" className="w-full">
                        <Link to="/strategies">Browse Strategy Navigator</Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </>
          ) : (
            <Card className="border-yellow bg-yellow/20 lg:h-full">
              <CardHeader>
                <CardTitle className="text-lg">Your daily check-in is ready</CardTitle>
                <CardDescription>
                  {WORK_CHECK_IN_QUESTION_COUNT} quick questions · under 2 minutes · private
                  to you
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full lg:w-auto lg:min-w-52" size="lg">
                  <Link to="/work-check-in">Start Today&apos;s Check-In</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <section aria-labelledby="actions-heading" className="lg:col-span-7">
          <h2
            id="actions-heading"
            className="font-display mb-4 text-xl font-semibold text-text lg:mb-6 lg:text-2xl"
          >
            Your tools
          </h2>
          <div className="space-y-4 md:grid md:grid-cols-2 md:gap-4 md:space-y-0 lg:grid-cols-1 lg:gap-4 xl:grid-cols-2">
            {actions.map(({ to, title, description, icon: Icon, accent }) => (
              <Link key={to} to={to} className="block h-full">
                <Card className="group h-full cursor-pointer transition-all duration-200 hover:border-green/30 hover:shadow-md active:scale-[0.99] lg:hover:shadow-lg">
                  <CardContent className="flex h-full items-center gap-4 p-5 lg:p-6">
                    <div
                      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${accent}`}
                    >
                      <Icon className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="font-display text-lg font-semibold text-text">
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed text-text-muted">
                        {description}
                      </p>
                    </div>
                    <ArrowRight
                      className="h-5 w-5 shrink-0 text-text-muted transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
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
