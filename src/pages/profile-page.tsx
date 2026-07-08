import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  LogOut,
  Moon,
  Share2,
  Shield,
  Sun,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { PreferenceRow } from '@/components/ui/preference-row'
import { useWorkEnergy } from '@/context/work-energy-context'
import { useAuth } from '@/context/auth-context'
import { useTheme } from '@/context/theme-context'
import { getDisplayName } from '@/lib/onboarding'
import { isAdminUser } from '@/utils/admin'

const ROLE_LABELS = {
  employee: 'Employee',
  employer_admin: 'Employer admin',
  super_admin: 'Super admin',
} as const

export function ProfilePage() {
  const { hasCheckedInToday, checkIns, profile, loading } = useWorkEnergy()
  const { user, isGuest, signOut } = useAuth()
  const { resolvedTheme, toggleDarkMode } = useTheme()
  const [signingOut, setSigningOut] = useState(false)

  const displayName = getDisplayName(profile, user?.displayName ?? user?.email)
  const initials = displayName.slice(0, 1).toUpperCase()
  const showAdmin = isAdminUser(user)

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  const totalCheckIns = checkIns.length
  const isDark = resolvedTheme === 'dark'

  return (
    <div className="page-enter space-y-8">
      <header className="text-center">
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt=""
            className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
          />
        ) : (
          <div
            className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green text-2xl font-bold text-white"
            aria-hidden="true"
          >
            {initials}
          </div>
        )}
        <h1 className="font-display text-2xl font-semibold text-text">
          {displayName}
        </h1>
        <p className="mt-1 text-text-muted">
          {user?.email ?? "You're doing great by showing up."}
        </p>
        {!loading && (
          <p className="mt-2 text-sm text-text-muted">
            {ROLE_LABELS[profile.role]}
            {profile.organisationId ? ' · Organisation linked' : ''}
          </p>
        )}
      </header>

      <Button
        variant="ghost"
        className="w-full text-text-muted"
        disabled={signingOut}
        onClick={handleSignOut}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {signingOut ? 'Signing out…' : 'Sign out'}
      </Button>

      <div className="grid grid-cols-2 gap-3">
        <Card className="text-center">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green">{totalCheckIns}</p>
            <p className="text-xs text-text-muted">Work check-ins</p>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <p className="text-2xl font-bold text-green">
              {hasCheckedInToday ? 'Done' : '—'}
            </p>
            <p className="text-xs text-text-muted">Today</p>
          </CardContent>
        </Card>
      </div>

      {!loading && !hasCheckedInToday && (
        <Card className="bg-yellow/20">
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="font-medium text-text">Haven&apos;t checked in yet</p>
              <p className="text-sm text-text-muted">
                Take 2 minutes to log your work energy
              </p>
            </div>
            <Button asChild size="icon">
              <Link to="/work-check-in" aria-label="Start work check-in">
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <section aria-labelledby="settings-heading">
        <h2
          id="settings-heading"
          className="font-display mb-4 text-xl font-semibold text-text"
        >
          Preferences
        </h2>
        <div className="space-y-3">
          <PreferenceRow
            icon={isDark ? Moon : Sun}
            label="Calm dark mode"
            description="Easier on the eyes in low-light environments"
            checked={isDark}
            onCheckedChange={() => toggleDarkMode()}
          />
          <PreferenceRow
            icon={Bell}
            label="Daily check-in reminders"
            description={`Daily reminder at ${profile.reminderTime} (coming soon)`}
            checked={false}
            onCheckedChange={() => {}}
          />
          <Card className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-muted">
                <Shield className="h-5 w-5 text-green" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-text">Privacy</p>
                <p className="text-sm text-text-muted">
                  Work check-ins are private to you. Employers only see
                  aggregated patterns.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {!isGuest && (
        <section aria-labelledby="invite-heading">
          <h2
            id="invite-heading"
            className="font-display mb-4 text-xl font-semibold text-text"
          >
            Community
          </h2>
          <div className="space-y-3">
            {showAdmin ? (
              <Card className="border-green/20 bg-green-muted/30 transition-colors hover:bg-green-muted/45">
                <CardContent className="p-0">
                  <Link
                    to="/admin"
                    className="flex items-center justify-between gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-text">Admin dashboard</p>
                      <p className="text-sm text-text-muted">
                        Manage NeuroDiver settings and content
                      </p>
                    </div>
                    <Shield className="h-5 w-5 shrink-0 text-green" aria-hidden="true" />
                  </Link>
                </CardContent>
              </Card>
            ) : null}
            <Card className="border-green/20 bg-green-muted/30 transition-colors hover:bg-green-muted/45">
              <CardContent className="p-0">
                <Link
                  to="/profile/invite-friend"
                  className="flex items-center justify-between gap-4 p-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-text">Invite a friend</p>
                    <p className="text-sm text-text-muted">
                      Share NeuroDiver with someone who might find it helpful
                    </p>
                  </div>
                  <Share2 className="h-5 w-5 shrink-0 text-green" aria-hidden="true" />
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
