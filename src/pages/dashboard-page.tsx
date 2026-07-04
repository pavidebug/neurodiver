import { Link } from 'react-router-dom'
import { Activity, ArrowRight, Layers, Users } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { WORK_CHECK_IN_QUESTION_COUNT } from '@/data/work-check-in-questions'
import { useWorkEnergy } from '@/context/work-energy-context'

export function DashboardPage() {
  const { hasCheckedInToday, loading } = useWorkEnergy()

  const actions = [
    {
      to: '/energy-patterns',
      title: 'Energy Patterns',
      description: 'See how your work energy shifts over time.',
      icon: Activity,
      accent: 'bg-green-muted text-green',
    },
    {
      to: '/strategies',
      title: 'Strategy Navigator',
      description: 'Swipeable cards with neurodivergent-friendly strategies.',
      icon: Layers,
      accent: 'bg-yellow/60 text-text',
    },
    {
      to: '/body-double',
      title: 'Body Doubling',
      description: 'Browse, book, and join accountability sessions.',
      icon: Users,
      accent: 'bg-orange/10 text-orange',
    },
  ]

  return (
    <div className="page-enter space-y-8">
      <header>
        <p className="mb-1 text-sm font-medium text-text-muted">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight text-text">
          Good {getGreeting()}, friend
        </h1>
      </header>

      {loading ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-text-muted">Loading your check-in status…</p>
          </CardContent>
        </Card>
      ) : hasCheckedInToday ? (
        <Card className="border-green/20 bg-green-muted/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Work check-in complete</CardTitle>
            <CardDescription>
              Thanks for checking in today. Your responses stay private to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild variant="ghost" className="px-0">
              <Link to="/work-reflection">
                View Daily Work Reflection
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-yellow bg-yellow/20">
          <CardHeader>
            <CardTitle className="text-lg">Ready for your work check-in?</CardTitle>
            <CardDescription>
              {WORK_CHECK_IN_QUESTION_COUNT} quick questions · under 2 minutes · private to you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link to="/work-check-in">Start Work Energy Check-in</Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="actions-heading">
        <h2
          id="actions-heading"
          className="font-display mb-4 text-xl font-semibold text-text"
        >
          Your tools
        </h2>
        <div className="space-y-4">
          {actions.map(({ to, title, description, icon: Icon, accent }) => (
            <Link key={to} to={to} className="block">
              <Card className="group cursor-pointer transition-all duration-200 hover:border-green/30 hover:shadow-md active:scale-[0.99]">
                <CardContent className="flex items-center gap-4 p-5">
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
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
