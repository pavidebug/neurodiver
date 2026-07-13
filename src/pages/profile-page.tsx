import { useState } from 'react'
import { Bell, Code2, Heart, MessageCircle, Moon, Shield, Sun, Users } from 'lucide-react'
import { BuildInfoFooter } from '@/components/layout/build-info-footer'
import { PrivacyNotice } from '@/components/privacy/privacy-notice'
import { ProfileCheckInBanner } from '@/components/profile/profile-check-in-banner'
import { ProfileHeader } from '@/components/profile/profile-header'
import { ProfileLinkCard } from '@/components/profile/profile-link-card'
import { ProfileStatCards } from '@/components/profile/profile-stat-cards'
import { PreferenceRow } from '@/components/ui/preference-row'
import { Stack } from '@/design-system/layout'
import { useWorkEnergy } from '@/context/work-energy-context'
import { useAuth } from '@/context/auth-context'
import { useTheme } from '@/context/theme-context'
import { buildSupportWhatsAppUrl } from '@/constants/contact'
import { getDisplayName } from '@/lib/onboarding'
import { isAdminUser } from '@/utils/admin'
import { cn } from '@/lib/utils'

export function ProfilePage() {
  const { hasCheckedInToday, checkIns, profile, loading } = useWorkEnergy()
  const { user, signOut } = useAuth()
  const { resolvedTheme, toggleDarkMode } = useTheme()
  const [signingOut, setSigningOut] = useState(false)

  const displayName = getDisplayName(profile, user?.displayName ?? user?.email)
  const initials = displayName.slice(0, 1).toUpperCase()
  const showDeveloperShortcut = isAdminUser(user)
  const isDark = resolvedTheme === 'dark'

  async function handleSignOut() {
    setSigningOut(true)
    try {
      await signOut()
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <Stack className="pb-6">
      <ProfileHeader
        displayName={displayName}
        email={user?.email}
        photoURL={user?.photoURL}
        initials={initials}
        signingOut={signingOut}
        onSignOut={handleSignOut}
      />

      <ProfileStatCards totalCheckIns={checkIns.length} hasCheckedInToday={hasCheckedInToday} />

      {!loading && !hasCheckedInToday ? <ProfileCheckInBanner /> : null}

      <section aria-labelledby="insights-link-heading" className="slide-up space-y-3">
        <h2 id="insights-link-heading" className="font-display text-lg font-semibold text-text lg:text-xl">
          Your patterns
        </h2>
        <ProfileLinkCard
          to="/insights"
          icon={Heart}
          title="What NeuroDiver has learned about you"
          description="Simple, text-first insights from your check-ins and saved strategies"
        />
      </section>

      <section aria-labelledby="support-heading" className="slide-up space-y-3">
        <h2 id="support-heading" className="font-display text-lg font-semibold text-text lg:text-xl">
          Support
        </h2>
        <ProfileLinkCard
          href={buildSupportWhatsAppUrl()}
          external
          icon={MessageCircle}
          title="Contact us"
          description="Reach the NeuroDiver team on WhatsApp"
        />
      </section>

      <section aria-labelledby="settings-heading" className="slide-up space-y-3">
        <h2 id="settings-heading" className="font-display text-lg font-semibold text-text lg:text-xl">
          Preferences
        </h2>
        <div className="space-y-2.5">
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
          <ProfileLinkCard
            icon={Shield}
            title="Privacy"
            description="Work check-ins are private to you. Employers only see aggregated patterns."
          />
          <PrivacyNotice compact className="rounded-[1.25rem]" />
        </div>
      </section>

      <section aria-labelledby="about-heading" className="slide-up space-y-3">
        <h2 id="about-heading" className="font-display text-lg font-semibold text-text lg:text-xl">
          About
        </h2>
        <BuildInfoFooter showDivider={false} className="rounded-[1.25rem] border border-border/60 bg-surface-solid px-5 py-6" />
      </section>

      {user ? (
        <section aria-labelledby="community-heading" className="slide-up space-y-3">
          <h2 id="community-heading" className="font-display text-lg font-semibold text-text lg:text-xl">
            Community
          </h2>
          <div
            className={cn(
              'grid gap-2.5',
              showDeveloperShortcut ? 'lg:grid-cols-2' : 'grid-cols-1',
            )}
          >
            {showDeveloperShortcut ? (
              <ProfileLinkCard
                to="/admin"
                icon={Code2}
                title="Developer Dashboard"
                description="Manage sessions, strategies, analytics and platform settings."
                badge={
                  <span className="absolute right-4 top-4 rounded-full bg-green-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green">
                    Developer
                  </span>
                }
                className="pr-4 pt-10"
              />
            ) : null}
            <ProfileLinkCard
              to="/profile/invite-friend"
              icon={Users}
              title="Invite a user"
              description="Share NeuroDiver with someone who might find it helpful"
            />
          </div>
        </section>
      ) : null}

      <article className="slide-up hidden items-center gap-3 rounded-[1.25rem] border border-green/15 bg-green-muted/20 px-5 py-4 lg:flex">
        <Heart className="h-4 w-4 shrink-0 text-green" aria-hidden="true" />
        <p className="text-sm text-text-muted">
          Thank you for being part of NeuroDiver. You&apos;re building a better tomorrow.
        </p>
      </article>
    </Stack>
  )
}
