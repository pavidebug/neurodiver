import { useEffect, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Share2,
  Sparkles,
  Timer,
  UserPlus,
  Users,
  Video,
} from 'lucide-react'
import { BodyDoubleEmailCapture } from '@/components/body-doubling/body-double-email-capture'
import { PhysicalSessionsComingSoon } from '@/components/body-doubling/physical-sessions-coming-soon'
import { BodyDoublingLearnMoreModal } from '@/components/body-doubling/body-doubling-learn-more-modal'
import { PrivacyNotice } from '@/components/privacy/privacy-notice'
import { SESSION_CARD_LUCIDE_ICONS } from '@/data/strategy-lucide-icons'
import {
  formatSessionDate,
  formatSessionDuration,
  formatSessionTime,
  getRemainingSeats,
} from '@/lib/focus-session-format'
import type { FocusSession, SessionBooking } from '@/types/body-doubling'
import { cn } from '@/lib/utils'
import { useFeatureConfig } from '@/context/feature-config-context'

/** Pilot community analytics — sign-ups are live; others until aggregate analytics ship */
const COMMUNITY_ANALYTICS = {
  sessionsDone: 10,
  gotThingsDonePercent: 90,
}

type IntroTab = 'about' | 'analytics'
type SessionsView = 'virtual' | 'physical'
type ButtonLayout = 'stack' | 'row'

interface BodyDoublingHomeProps {
  sessions: FocusSession[]
  bookingsBySessionId: Record<string, SessionBooking>
  loading: boolean
  error: string | null
  isSignedIn: boolean
  userId: string | null
  defaultEmail?: string | null
  isGuest: boolean
  onReserve: (session: FocusSession) => void
  onJoin: (session: FocusSession, booking: SessionBooking) => void
  onInviteFriend: () => void
}

const FEATURED_TAGS = ['Quiet', 'Deep Work', 'Focused']

const UPCOMING_TAG_SETS = [
  ['Wind-down', 'Reflect', 'Reset'],
  ['Reset', 'Plan', 'Focus'],
  ['Gentle', 'Steady', 'Together'],
]

export function BodyDoublingHome({
  sessions,
  bookingsBySessionId,
  loading,
  error,
  isSignedIn,
  userId,
  defaultEmail,
  isGuest,
  onReserve,
  onJoin,
  onInviteFriend,
}: BodyDoublingHomeProps) {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const [sessionsView, setSessionsView] = useState<SessionsView>('virtual')
  const { isSectionEnabled } = useFeatureConfig()
  const showVirtual = isSectionEnabled('bodyDouble', 'virtualSessions')
  const showPhysical = isSectionEnabled('bodyDouble', 'physicalSessions')
  const showFocusIntro = isSectionEnabled('bodyDouble', 'focusIntro')
  const showCommunityIntro = isSectionEnabled('bodyDouble', 'communityIntro')
  const showEmailUpdates = isSectionEnabled('bodyDouble', 'emailUpdates')

  useEffect(() => {
    if (sessionsView === 'virtual' && !showVirtual && showPhysical) setSessionsView('physical')
    if (sessionsView === 'physical' && !showPhysical && showVirtual) setSessionsView('virtual')
  }, [sessionsView, showPhysical, showVirtual])

  const visibleSessionsView: SessionsView = !showVirtual && showPhysical ? 'physical' : sessionsView

  if (loading) {
    return (
      <div className="flex min-h-[40dvh] items-center justify-center">
        <p className="text-sm text-[#6B6B63]">Loading sessions…</p>
      </div>
    )
  }

  const featured = sessions[0] ?? null
  const upcoming = sessions.slice(1)
  const totalSignUps = sessions.reduce((sum, session) => sum + session.bookedCount, 0)

  return (
    <>
      <BodyDoublingLearnMoreModal
        open={learnMoreOpen}
        onClose={() => setLearnMoreOpen(false)}
      />
      {/* Mobile */}
      <div className="body-double-premium space-y-7 pb-6 lg:hidden">
        {showFocusIntro ? <FocusTogetherHero /> : null}

        {showVirtual ? <SessionAlerts error={error} isSignedIn={isSignedIn} /> : null}

        {showVirtual || showPhysical ? <SessionsTabPanel
          activeView={visibleSessionsView}
          onViewChange={setSessionsView}
          panelId="sessions-panel-mobile"
          showVirtual={showVirtual}
          showPhysical={showPhysical}
        >
          {visibleSessionsView === 'virtual' ? (
            sessions.length === 0 ? (
              <EmptySessionsState />
            ) : (
              <ScheduleCardGroup>
                {featured ? (
                  <FeaturedSessionCard
                    session={featured}
                    booking={bookingsBySessionId[featured.id]}
                    isSignedIn={isSignedIn}
                    onReserve={() => onReserve(featured)}
                    onJoin={(booking) => onJoin(featured, booking)}
                    onInviteFriend={onInviteFriend}
                    buttonLayout="stack"
                  />
                ) : null}

                {upcoming.length > 0 ? (
                  <UpcomingSessionsSection
                    sessions={upcoming}
                    bookingsBySessionId={bookingsBySessionId}
                    isSignedIn={isSignedIn}
                    onReserve={onReserve}
                    onJoin={onJoin}
                    onInviteFriend={onInviteFriend}
                    buttonLayout="stack"
                    headingId="upcoming-heading-mobile"
                    hideHeading
                  />
                ) : null}
              </ScheduleCardGroup>
            )
          ) : (
            <PhysicalSessionsComingSoon variant="tab" />
          )}
        </SessionsTabPanel> : null}

        {showCommunityIntro ? <BodyDoublingIntroSection
          totalSignUps={totalSignUps}
          onLearnMore={() => setLearnMoreOpen(true)}
        /> : null}

        {showEmailUpdates ? <BodyDoubleEmailCapture
          userId={userId}
          defaultEmail={defaultEmail}
          isGuest={isGuest}
          instanceId="mobile"
        /> : null}
      </div>

      {/* Desktop */}
      <div className="hidden w-full space-y-10 pb-8 lg:block lg:space-y-12">
        {showFocusIntro ? <FocusTogetherHero desktop /> : null}

        {showVirtual ? <SessionAlerts error={error} isSignedIn={isSignedIn} variant="desktop" /> : null}

        {showVirtual || showPhysical ? <SessionsTabPanel
          activeView={visibleSessionsView}
          onViewChange={setSessionsView}
          panelId="sessions-panel-desktop"
          showVirtual={showVirtual}
          showPhysical={showPhysical}
        >
          {visibleSessionsView === 'virtual' ? (
            sessions.length === 0 ? (
              <EmptySessionsState variant="desktop" />
            ) : (
              <ScheduleCardGroup>
                {featured ? (
                  <FeaturedSessionCard
                    session={featured}
                    booking={bookingsBySessionId[featured.id]}
                    isSignedIn={isSignedIn}
                    onReserve={() => onReserve(featured)}
                    onJoin={(booking) => onJoin(featured, booking)}
                    onInviteFriend={onInviteFriend}
                    buttonLayout="row"
                  />
                ) : null}

                {upcoming.length > 0 ? (
                  <UpcomingSessionsSection
                    sessions={upcoming}
                    bookingsBySessionId={bookingsBySessionId}
                    isSignedIn={isSignedIn}
                    onReserve={onReserve}
                    onJoin={onJoin}
                    onInviteFriend={onInviteFriend}
                    buttonLayout="row"
                    headingId="upcoming-heading-desktop"
                    hideHeading
                  />
                ) : null}
              </ScheduleCardGroup>
            )
          ) : (
            <PhysicalSessionsComingSoon variant="tab" />
          )}
        </SessionsTabPanel> : null}

        {showCommunityIntro ? <BodyDoublingDesktopIntroBanner
          totalSignUps={totalSignUps}
          onLearnMore={() => setLearnMoreOpen(true)}
        /> : null}

        {showEmailUpdates ? <BodyDoubleEmailCapture
          userId={userId}
          defaultEmail={defaultEmail}
          isGuest={isGuest}
          instanceId="desktop"
        /> : null}

        <PrivacyNotice variant="check-in" />
      </div>
    </>
  )
}

function ScheduleCardGroup({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-4 rounded-[1.75rem] border border-[#2F5D50]/15 bg-[#F9F7F2]/70 p-3 ring-1 ring-white/60 sm:p-4 lg:space-y-5 lg:p-5">
      {children}
    </div>
  )
}

function FocusTogetherHero({ desktop = false }: { desktop?: boolean }) {
  return (
    <section
      className={cn(
        'relative overflow-hidden rounded-[2rem] border border-[#2F5D50]/10 bg-gradient-to-br from-[#EAF3EF] via-[#F9FBF8] to-[#F4E7BE]/65 shadow-[0_18px_46px_rgba(47,93,80,0.1)]',
        desktop ? 'px-9 py-9 xl:px-11 xl:py-10' : 'px-5 py-6',
      )}
    >
      <div className="pointer-events-none absolute -right-14 -top-20 h-52 w-52 rounded-full bg-[#D9CBE8]/35 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 left-1/3 h-44 w-44 rounded-full bg-[#F4D88E]/25 blur-3xl" />
      <div className="relative flex items-start gap-4">
        <span className={cn('flex shrink-0 items-center justify-center rounded-2xl bg-[#2F5D50] text-white shadow-[0_10px_24px_rgba(47,93,80,0.25)]', desktop ? 'h-16 w-16' : 'h-12 w-12')}>
          <Users className={desktop ? 'h-8 w-8' : 'h-6 w-6'} aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#2F5D50]">Quiet company, shared momentum</p>
          <h1 className={cn('mt-2 font-display font-semibold leading-tight tracking-tight text-[#1F2A24]', desktop ? 'text-4xl xl:text-[2.75rem]' : 'text-[1.75rem]')}>
            Focus Together <span aria-hidden="true">✨</span>
          </h1>
          <p className={cn('mt-3 max-w-2xl leading-relaxed text-[#6B6B63]', desktop ? 'text-lg' : 'text-[0.9375rem]')}>
            Sometimes getting started is easier when someone else is there. Join a calm session,
            choose one task, and work alongside people who understand.
          </p>
        </div>
      </div>
    </section>
  )
}

function SessionsTabPanel({
  activeView,
  onViewChange,
  panelId,
  showVirtual,
  showPhysical,
  children,
}: {
  activeView: SessionsView
  onViewChange: (view: SessionsView) => void
  panelId: string
  showVirtual: boolean
  showPhysical: boolean
  children: ReactNode
}) {
  const virtualTabId = `${panelId}-virtual-tab`
  const physicalTabId = `${panelId}-physical-tab`

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#2F5D50]/10 bg-white/45 shadow-[0_12px_34px_rgba(47,93,80,0.07)]">
      <div className="border-b border-[#2F5D50]/10 bg-[#F9F7F2]/75 p-4 sm:p-5 lg:flex lg:items-center lg:justify-between lg:gap-5">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#2F5D50] text-white">
            <Calendar className="h-5 w-5" aria-hidden="true" />
          </span>
          <h2 className="font-display text-xl font-semibold text-[#1F2A24]">Session schedule</h2>
        </div>

        {showVirtual && showPhysical ? <div
          role="tablist"
          aria-label="Session schedule type"
          className="mt-4 flex gap-1 rounded-2xl bg-white/80 p-1 ring-1 ring-border/50 lg:mt-0"
        >
          <SessionsTabButton
            active={activeView === 'virtual'}
            onClick={() => onViewChange('virtual')}
            icon={Video}
            tabId={virtualTabId}
          >
            Upcoming
          </SessionsTabButton>
          <SessionsTabButton
            active={activeView === 'physical'}
            onClick={() => onViewChange('physical')}
            icon={MapPin}
            tabId={physicalTabId}
          >
            Physical
          </SessionsTabButton>
        </div> : null}
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={showVirtual && showPhysical ? (activeView === 'virtual' ? virtualTabId : physicalTabId) : undefined}
        className="min-h-56 p-4 sm:p-5 lg:p-6"
      >
        {children}
      </div>
    </section>
  )
}

function SessionsTabButton({
  active,
  onClick,
  icon: Icon,
  tabId,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: typeof Video
  tabId: string
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      id={tabId}
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all lg:min-w-32',
        active
          ? 'bg-white text-[#1F2A24] shadow-sm'
          : 'text-[#6B6B63] hover:text-[#1F2A24]',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {children}
    </button>
  )
}

function SessionAlerts({
  error,
  isSignedIn,
  variant = 'mobile',
}: {
  error: string | null
  isSignedIn: boolean
  variant?: 'mobile' | 'desktop'
}) {
  const isDesktop = variant === 'desktop'

  return (
    <>
      {error ? (
        <p
          className={cn(
            'rounded-2xl px-4 py-3 text-sm',
            isDesktop ? 'bg-orange/10 text-orange' : 'bg-[#D39A45]/10 text-[#C17F3A]',
          )}
          role="alert"
        >
          {error}
        </p>
      ) : null}

      {!isSignedIn ? (
        <p
          className={cn(
            'rounded-2xl px-4 py-3 text-sm',
            isDesktop ? 'bg-yellow/20 text-text-muted' : 'bg-[#F4E7BE]/60 text-[#6B6B63]',
          )}
        >
          Sign in to reserve a spot in a focus session.
        </p>
      ) : null}
    </>
  )
}

function EmptySessionsState({ variant = 'mobile' }: { variant?: 'mobile' | 'desktop' }) {
  const isDesktop = variant === 'desktop'

  return (
    <div
      className={cn(
        'rounded-3xl px-5 py-12 text-center',
        isDesktop
          ? 'border border-border bg-surface-solid'
          : 'bg-white shadow-[0_8px_32px_rgba(47,93,80,0.06)]',
      )}
    >
      <p className={cn('text-base', isDesktop ? 'text-text-muted' : 'text-[#6B6B63]')}>
        No upcoming sessions right now. Check back soon.
      </p>
    </div>
  )
}

function FeaturedSessionCard({
  session,
  booking,
  isSignedIn,
  onReserve,
  onJoin,
  onInviteFriend,
  buttonLayout,
}: {
  session: FocusSession
  booking?: SessionBooking
  isSignedIn: boolean
  onReserve: () => void
  onJoin: (booking: SessionBooking) => void
  onInviteFriend: () => void
  buttonLayout: ButtonLayout
}) {
  const seatsLeft = getRemainingSeats(session)
  const isFull = seatsLeft <= 0 && !booking

  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-[#2F5D50]/10 bg-gradient-to-br from-[#E8F0EB] via-[#F7FAF8] to-[#F4E7BE]/45 shadow-[0_14px_38px_rgba(47,93,80,0.1)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-[#7A6B96]/10 blur-3xl" />
      <div className="relative p-5 lg:p-8">
        <div className="min-w-0 flex-1">
          <span className="inline-block rounded-full bg-white/70 px-3 py-1 text-[0.6875rem] font-semibold tracking-[0.12em] text-[#2F5D50] uppercase">
            Next session
          </span>

          <h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-[#1F2A24] lg:text-3xl">
            {session.title} <span aria-hidden="true">🌿</span>
          </h2>

          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-4 text-sm lg:grid-cols-4 lg:max-w-none">
            <SessionDetail icon={Calendar} label={formatSessionDate(session.startsAt)} />
            <SessionDetail icon={Clock} label={formatSessionTime(session.startsAt)} />
            <SessionDetail icon={Timer} label={formatSessionDuration(session.durationMinutes)} />
            <SessionDetail
              icon={Users}
              label={`${session.bookedCount} ${session.bookedCount === 1 ? 'participant' : 'participants'}`}
            />
            <SessionDetail icon={Video} label={session.platform} className="col-span-2 lg:col-span-1" />
          </div>

          <div className="mt-5 flex flex-wrap gap-2.5">
            {FEATURED_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-white/60 px-3 py-1 text-xs font-medium text-[#2F5D50]"
              >
                {tag}
              </span>
            ))}
          </div>

          <SessionActionButtons
            className="mt-6"
            layout={buttonLayout}
            variant="featured"
            label={booking ? "You're in!" : isFull ? 'Session full' : 'Reserve My Spot'}
            isSignedIn={isSignedIn}
            isFull={isFull}
            booking={booking}
            onReserve={onReserve}
            onJoin={onJoin}
            onInviteFriend={onInviteFriend}
          />
        </div>
      </div>
    </article>
  )
}

function UpcomingSessionsSection({
  sessions,
  bookingsBySessionId,
  isSignedIn,
  onReserve,
  onJoin,
  onInviteFriend,
  buttonLayout,
  headingId,
  showViewAll = false,
  hideHeading = false,
}: {
  sessions: FocusSession[]
  bookingsBySessionId: Record<string, SessionBooking>
  isSignedIn: boolean
  onReserve: (session: FocusSession) => void
  onJoin: (session: FocusSession, booking: SessionBooking) => void
  onInviteFriend: () => void
  buttonLayout: ButtonLayout
  headingId: string
  showViewAll?: boolean
  hideHeading?: boolean
}) {
  return (
    <section aria-labelledby={hideHeading ? undefined : headingId} className="space-y-5 lg:space-y-6">
      {!hideHeading ? (
        <div className="flex items-center justify-between gap-3">
          <h2
            id={headingId}
            className="flex items-center gap-2 text-base font-medium text-[#1F2A24] lg:text-lg"
          >
            <Calendar className="h-4 w-4 text-[#D39A45]" aria-hidden="true" />
            Upcoming Sessions
          </h2>
          {showViewAll ? (
            <button
              type="button"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#2F5D50] transition-opacity hover:opacity-80"
            >
              View all
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          ) : null}
        </div>
      ) : null}

      <div
        className={cn(
          'space-y-4',
          buttonLayout === 'row' && 'lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0 xl:gap-8',
        )}
      >
        {sessions.map((session, index) => (
          <UpcomingSessionCard
            key={session.id}
            session={session}
            index={index}
            booking={bookingsBySessionId[session.id]}
            isSignedIn={isSignedIn}
            onReserve={() => onReserve(session)}
            onJoin={(booking) => onJoin(session, booking)}
            onInviteFriend={onInviteFriend}
            buttonLayout={buttonLayout}
          />
        ))}
      </div>
    </section>
  )
}

function UpcomingSessionCard({
  session,
  index,
  booking,
  isSignedIn,
  onReserve,
  onJoin,
  onInviteFriend,
  buttonLayout,
}: {
  session: FocusSession
  index: number
  booking?: SessionBooking
  isSignedIn: boolean
  onReserve: () => void
  onJoin: (booking: SessionBooking) => void
  onInviteFriend: () => void
  buttonLayout: ButtonLayout
}) {
  const seatsLeft = getRemainingSeats(session)
  const isFull = seatsLeft <= 0 && !booking
  const tags = UPCOMING_TAG_SETS[index % UPCOMING_TAG_SETS.length]
  const label = booking ? "You're in!" : isFull ? 'Full' : 'Reserve'

  return (
    <article className="rounded-[1.5rem] bg-white p-5 shadow-[0_6px_24px_rgba(47,93,80,0.06)] lg:p-6">
      <div className="flex gap-3">
        <SessionCardIcon index={index} />

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-semibold leading-snug text-[#1F2A24]">
            {session.title}
          </h3>
          <p className="mt-1 text-sm text-[#6B6B63]">
            {formatSessionDate(session.startsAt)} · {formatSessionTime(session.startsAt)} ·{' '}
            {formatSessionDuration(session.durationMinutes)}
          </p>
          <p className="mt-0.5 text-xs text-[#6B6B63]">
            {session.bookedCount} joined · {session.platform}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#F9F7F2] px-2.5 py-0.5 text-[10px] font-medium text-[#6B6B63]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <SessionActionButtons
        className="mt-3"
        layout={buttonLayout}
        variant="upcoming"
        label={label}
        isSignedIn={isSignedIn}
        isFull={isFull}
        booking={booking}
        onReserve={onReserve}
        onJoin={onJoin}
        onInviteFriend={onInviteFriend}
      />
    </article>
  )
}

function SessionActionButtons({
  className,
  layout,
  variant,
  label,
  isSignedIn,
  isFull,
  booking,
  onReserve,
  onJoin,
  onInviteFriend,
}: {
  className?: string
  layout: ButtonLayout
  variant: 'featured' | 'upcoming'
  label: string
  isSignedIn: boolean
  isFull: boolean
  booking?: SessionBooking
  onReserve: () => void
  onJoin: (booking: SessionBooking) => void
  onInviteFriend: () => void
}) {
  const isFeatured = variant === 'featured'
  const disabled = !isSignedIn || (isFull && !booking)

  const reserveButton = isFeatured ? (
    <button
      type="button"
      disabled={disabled}
      onClick={() => (booking ? onJoin(booking) : onReserve())}
      className={cn(
        'flex items-center justify-between gap-3 rounded-2xl bg-[#2F5D50] px-5 py-4 text-left text-white shadow-[0_6px_20px_rgba(47,93,80,0.25)] transition-all',
        'hover:bg-[#3a6d5f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50',
        layout === 'row' && 'flex-1',
        layout === 'stack' && 'w-full',
      )}
    >
      <span className="font-medium">{label}</span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
        <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </span>
    </button>
  ) : (
    <button
      type="button"
      disabled={disabled}
      onClick={() => (booking ? onJoin(booking) : onReserve())}
      className={cn(
        'rounded-2xl px-4 py-3 text-sm font-medium transition-all active:scale-[0.98]',
        booking ? 'bg-[#2F5D50] text-white' : 'bg-[#F4E7BE] text-[#1F2A24] hover:bg-[#ebdfad]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        layout === 'row' && 'flex-1',
        layout === 'stack' && 'w-full',
      )}
    >
      {label}
    </button>
  )

  const inviteButton = (
    <button
      type="button"
      onClick={onInviteFriend}
      className={cn(
        'flex items-center justify-center gap-2 rounded-2xl border border-[#2F5D50]/20 text-sm font-medium text-[#2F5D50] transition-all active:scale-[0.98]',
        isFeatured
          ? 'bg-white/60 px-5 py-3 hover:bg-white/80'
          : 'bg-[#F9F7F2] px-4 py-2.5 hover:bg-white',
        layout === 'row' && 'flex-1',
        layout === 'stack' && 'w-full',
      )}
    >
      <Share2 className="h-4 w-4" aria-hidden="true" />
      Invite a friend
    </button>
  )

  return (
    <div className={cn(layout === 'stack' ? 'space-y-2' : 'flex gap-2', className)}>
      {reserveButton}
      {inviteButton}
    </div>
  )
}

function BodyDoublingDesktopIntroBanner({
  totalSignUps,
  onLearnMore,
}: {
  totalSignUps: number
  onLearnMore: () => void
}) {
  const extraCount = Math.max(totalSignUps, 23)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-[#2F5D50]/15 bg-gradient-to-br from-[#EEF5F1] via-white to-[#F3EDF8] p-6 shadow-[0_14px_38px_rgba(47,93,80,0.08)] lg:p-8">
      <div className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#D9CBE8]/30 blur-3xl" />
      <div className="relative grid gap-7 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
        <div>
          <div className="flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#2F5D50] text-white shadow-[0_8px_20px_rgba(47,93,80,0.2)]">
              <Users className="h-7 w-7" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#2F5D50]">Gentle shared focus</p>
              <h2 className="mt-1 font-display text-2xl font-semibold text-[#1F2A24]">What is Body Doubling?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#6B6B63] lg:text-base">
                Work quietly alongside someone else. Their presence adds just enough structure to
                help you begin, stay with the task, and feel less alone while doing it.
              </p>
            </div>
          </div>

          <BodyDoublingPrinciples className="mt-6" />

          <button
            type="button"
            onClick={onLearnMore}
            className="mt-5 inline-flex items-center gap-2 rounded-full border border-[#2F5D50]/15 bg-white/75 px-4 py-2.5 text-sm font-semibold text-[#2F5D50] transition hover:bg-white"
          >
            Learn how it works
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="flex flex-col justify-between rounded-[1.5rem] border border-white/80 bg-white/65 p-5 ring-1 ring-[#2F5D50]/8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#7A6B96]">You’re in good company</p>
            <p className="mt-2 font-display text-xl font-semibold text-[#1F2A24]">Quiet support, shared momentum.</p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <CommunityStat icon={UserPlus} value={`+${extraCount}`} label="people focusing" />
            <CommunityStat icon={Sparkles} value={`${COMMUNITY_ANALYTICS.gotThingsDonePercent}%`} label="felt productive" />
          </div>
        </div>
      </div>
    </section>
  )
}

function BodyDoublingIntroSection({
  totalSignUps,
  onLearnMore,
}: {
  totalSignUps: number
  onLearnMore: () => void
}) {
  const [activeTab, setActiveTab] = useState<IntroTab>('about')

  return (
    <section className="relative overflow-hidden rounded-[1.75rem] border border-[#2F5D50]/15 bg-gradient-to-br from-[#EEF5F1] via-white to-[#F3EDF8] p-5 shadow-[0_12px_32px_rgba(47,93,80,0.08)]">
      <div className="mb-5 flex items-start gap-3.5">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2F5D50] text-white">
          <Users className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2F5D50]">Gentle shared focus</p>
          <h2 className="mt-1 font-display text-xl font-semibold text-[#1F2A24]">What is Body Doubling?</h2>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Body doubling information"
        className="flex gap-1 rounded-2xl bg-white/65 p-1 ring-1 ring-[#2F5D50]/8"
      >
        <IntroTabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')}>
          How it works
        </IntroTabButton>
        <IntroTabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
          Community
        </IntroTabButton>
      </div>

      <div className="mt-4" role="tabpanel">
        {activeTab === 'about' ? (
          <div>
            <BodyDoublingAboutContent onLearnMore={onLearnMore} />
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 text-center">
            <CommunityStat
              icon={CheckCircle2}
              value={String(COMMUNITY_ANALYTICS.sessionsDone)}
              label="Sessions done"
            />
            <CommunityStat icon={UserPlus} value={String(totalSignUps)} label="Sign ups" />
            <CommunityStat
              icon={Sparkles}
              value={`${COMMUNITY_ANALYTICS.gotThingsDonePercent}%`}
              label="People say they got things done"
            />
          </div>
        )}
      </div>
    </section>
  )
}

function IntroTabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'flex-1 rounded-xl px-2 py-2.5 text-xs font-medium leading-tight transition-all sm:text-sm',
        active
          ? 'bg-white text-[#1F2A24] shadow-sm'
          : 'text-[#6B6B63] hover:text-[#1F2A24]',
      )}
    >
      {children}
    </button>
  )
}

function BodyDoublingAboutContent({ onLearnMore }: { onLearnMore: () => void }) {
  return (
    <div>
      <p className="text-sm leading-relaxed text-[#6B6B63]">
        Work quietly alongside someone else. Their presence adds just enough structure to make
        starting and staying focused feel easier.
      </p>
      <BodyDoublingPrinciples className="mt-4" />
      <button
        type="button"
        onClick={onLearnMore}
        className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-[#2F5D50]/15 bg-white/75 px-4 py-2 text-sm font-semibold text-[#2F5D50] transition hover:bg-white"
      >
        Learn how it works
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  )
}

function BodyDoublingPrinciples({ className }: { className?: string }) {
  const principles = [
    ['1', 'Show up'],
    ['2', 'Choose one task'],
    ['3', 'Work quietly'],
  ]

  return (
    <div className={cn('grid grid-cols-3 gap-2.5', className)}>
      {principles.map(([number, label]) => (
        <div key={number} className="rounded-2xl border border-[#2F5D50]/10 bg-white/65 px-2 py-3 text-center">
          <span className="mx-auto flex h-7 w-7 items-center justify-center rounded-full bg-[#E8F0EB] text-xs font-bold text-[#2F5D50]">
            {number}
          </span>
          <p className="mt-2 text-[11px] font-semibold leading-tight text-[#1F2A24] sm:text-xs">{label}</p>
        </div>
      ))}
    </div>
  )
}

function CommunityStat({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users
  value: string
  label: string
}) {
  return (
    <div className="rounded-2xl border border-[#2F5D50]/8 bg-white/70 px-2 py-3">
      <Icon className="mx-auto mb-1 h-4 w-4 text-[#2F5D50]" aria-hidden="true" />
      <p className="font-display text-lg font-semibold text-[#1F2A24]">{value}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-[#6B6B63]">{label}</p>
    </div>
  )
}

function SessionCardIcon({ index }: { index: number }) {
  const Icon = SESSION_CARD_LUCIDE_ICONS[index % SESSION_CARD_LUCIDE_ICONS.length]
  const palettes = [
    { bg: 'bg-lavender-muted', icon: 'text-lavender-deep' },
    { bg: 'bg-yellow/45', icon: 'text-orange' },
    { bg: 'bg-green-muted', icon: 'text-green' },
  ]
  const palette = palettes[index % palettes.length]

  return (
    <span
      className={cn(
        'flex h-14 w-14 shrink-0 items-center justify-center rounded-[0.875rem]',
        palette.bg,
      )}
    >
      <Icon className={cn('h-7 w-7', palette.icon)} strokeWidth={1.75} aria-hidden="true" />
    </span>
  )
}

function SessionDetail({
  icon: Icon,
  label,
  className,
}: {
  icon: typeof Calendar
  label: string
  className?: string
}) {
  return (
    <span className={cn('flex items-center gap-2 text-[#1F2A24]', className)}>
      <Icon className="h-4 w-4 shrink-0 text-[#2F5D50]" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </span>
  )
}
