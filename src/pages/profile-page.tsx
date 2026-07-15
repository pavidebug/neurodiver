import { useState } from 'react'
import { Code2, MessageCircle, Moon, Shield, Sun, Users } from 'lucide-react'
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
import { useFeatureConfig } from '@/context/feature-config-context'
import { buildSupportWhatsAppUrl } from '@/constants/contact'
import { BUILD_INFO } from '@/constants/build-info'
import { getDisplayName } from '@/lib/onboarding'
import { isAdminUser } from '@/utils/admin'

export function ProfilePage() {
  const { hasCheckedInToday, checkIns, profile, loading } = useWorkEnergy()
  const { user, signOut } = useAuth()
  const { resolvedTheme, toggleDarkMode } = useTheme()
  const { isSectionEnabled } = useFeatureConfig()
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

      {isSectionEnabled('profile', 'stats') ? <ProfileStatCards totalCheckIns={checkIns.length} hasCheckedInToday={hasCheckedInToday} /> : null}

      {isSectionEnabled('profile', 'checkInPrompt') && !loading && !hasCheckedInToday ? <ProfileCheckInBanner /> : null}

      {isSectionEnabled('profile', 'support') ? <section aria-labelledby="support-heading" className="slide-up space-y-3">
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
        {user ? (
          <ProfileLinkCard
            to="/profile/invite-friend"
            icon={Users}
            title="Invite a user"
            description="Share NeuroDiver with someone who might find it helpful"
          />
        ) : null}
      </section> : null}

      {isSectionEnabled('profile', 'preferences') ? <section aria-labelledby="settings-heading" className="slide-up space-y-3">
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
          <ProfileLinkCard
            icon={Shield}
            title="Privacy"
            description="Work check-ins are private to you. Employers only see aggregated patterns."
          />
          <PrivacyNotice compact className="rounded-[1.25rem]" />
        </div>
      </section> : null}

      {user && showDeveloperShortcut && isSectionEnabled('profile', 'community') ? (
        <section aria-labelledby="admin-tools-heading" className="slide-up space-y-3">
          <h2 id="admin-tools-heading" className="font-display text-lg font-semibold text-text lg:text-xl">
            Admin tools
          </h2>
          <ProfileLinkCard
            to="/admin"
            icon={Code2}
            title="Developer Dashboard"
            description="Manage sessions, strategies, analytics and platform settings."
          />
        </section>
      ) : null}

      <footer className="slide-up border-t border-border/60 py-5 text-center">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-text-muted">
          NeuroDiver · Pilot · v{BUILD_INFO.version}
        </p>
      </footer>
    </Stack>
  )
}
