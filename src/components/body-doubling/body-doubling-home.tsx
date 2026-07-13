import { useState, type ReactNode } from 'react'
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Laptop,
  MapPin,
  Share2,
  Sparkles,
  Timer,
  UserPlus,
  Users,
  Video,
} from 'lucide-react'
import { NeuroDiverLogo } from '@/components/brand/neurodiver-logo'
import { CommunityIllustration, HeroIllustration } from '@/components/illustrations'
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
  onReserve,
  onJoin,
  onInviteFriend,
}: BodyDoublingHomeProps) {
  const [learnMoreOpen, setLearnMoreOpen] = useState(false)
  const [sessionsView, setSessionsView] = useState<SessionsView>('virtual')

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
        <MobilePageHeader />
        <BodyDoublingIntroSection
          totalSignUps={totalSignUps}
          onLearnMore={() => setLearnMoreOpen(true)}
        />

        <section className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1 space-y-2.5 pt-1">
            <h1 className="font-display text-[1.75rem] font-semibold leading-tight tracking-tight text-[#1F2A24]">
              Focus Together <span aria-hidden="true">✨</span>
            </h1>
            <p className="text-[0.9375rem] leading-relaxed text-[#6B6B63]">
              Sometimes getting started is easier when someone else is there.
              <br />
              Join a quiet focus session with others.
            </p>
          </div>
          <HeroIllustration className="h-[5.5rem] w-[6.5rem] shrink-0" />
        </section>

        <SessionAlerts error={error} isSignedIn={isSignedIn} />

        <SessionsTabPanel
          activeView={sessionsView}
          onViewChange={setSessionsView}
          panelId="sessions-panel-mobile"
        >
          {sessionsView === 'virtual' ? (
            sessions.length === 0 ? (
              <EmptySessionsState />
            ) : (
              <>
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
              </>
            )
          ) : (
            <PhysicalSessionsComingSoon variant="tab" />
          )}
        </SessionsTabPanel>
      </div>

      {/* Desktop */}
      <div className="hidden w-full space-y-10 pb-8 lg:block lg:space-y-12">
        <BodyDoublingDesktopIntroBanner
          totalSignUps={totalSignUps}
          onLearnMore={() => setLearnMoreOpen(true)}
        />

        <section className="flex items-start justify-between gap-10 lg:gap-12">
          <div className="min-w-0 flex-1 space-y-4">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-[#1F2A24] xl:text-[2.75rem]">
              Focus Together <span aria-hidden="true">✨</span>
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-[#6B6B63] lg:text-lg">
              Sometimes getting started is easier when someone else is there. Join a quiet focus
              session with others.
            </p>
          </div>
          <HeroIllustration className="h-32 w-36 shrink-0 xl:h-36 xl:w-40" />
        </section>

        <SessionAlerts error={error} isSignedIn={isSignedIn} variant="desktop" />

        <SessionsTabPanel
          activeView={sessionsView}
          onViewChange={setSessionsView}
          panelId="sessions-panel-desktop"
        >
          {sessionsView === 'virtual' ? (
            sessions.length === 0 ? (
              <EmptySessionsState variant="desktop" />
            ) : (
              <>
                {featured ? (
                  <FeaturedSessionCard
                    session={featured}
                    booking={bookingsBySessionId[featured.id]}
                    isSignedIn={isSignedIn}
                    onReserve={() => onReserve(featured)}
                    onJoin={(booking) => onJoin(featured, booking)}
                    onInviteFriend={onInviteFriend}
                    buttonLayout="row"
                    showIllustration
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
              </>
            )
          ) : (
            <PhysicalSessionsComingSoon variant="tab" />
          )}
        </SessionsTabPanel>

        <PrivacyNotice variant="check-in" />
      </div>
    </>
  )
}

function SessionsTabPanel({
  activeView,
  onViewChange,
  panelId,
  children,
}: {
  activeView: SessionsView
  onViewChange: (view: SessionsView) => void
  panelId: string
  children: ReactNode
}) {
  return (
    <section className="space-y-5 lg:space-y-6">
      <div
        role="tablist"
        aria-label="Session types"
        className="flex gap-2 rounded-2xl bg-white/60 p-1 shadow-sm ring-1 ring-border/40 lg:inline-flex lg:gap-1"
      >
        <SessionsTabButton
          active={activeView === 'virtual'}
          onClick={() => onViewChange('virtual')}
          icon={Video}
          tabId="sessions-virtual-tab"
        >
          Upcoming Sessions
        </SessionsTabButton>
        <SessionsTabButton
          active={activeView === 'physical'}
          onClick={() => onViewChange('physical')}
          icon={MapPin}
          tabId="sessions-physical-tab"
        >
          Physical Sessions
        </SessionsTabButton>
      </div>

      <div
        role="tabpanel"
        id={panelId}
        aria-labelledby={activeView === 'virtual' ? 'sessions-virtual-tab' : 'sessions-physical-tab'}
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
        'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all lg:flex-none lg:px-5',
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

function MobilePageHeader() {
  return (
    <header className="-mx-1 py-1">
      <NeuroDiverLogo size="sm" />
    </header>
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
  showIllustration = false,
}: {
  session: FocusSession
  booking?: SessionBooking
  isSignedIn: boolean
  onReserve: () => void
  onJoin: (booking: SessionBooking) => void
  onInviteFriend: () => void
  buttonLayout: ButtonLayout
  showIllustration?: boolean
}) {
  const seatsLeft = getRemainingSeats(session)
  const isFull = seatsLeft <= 0 && !booking

  return (
    <article className="overflow-hidden rounded-[1.75rem] bg-[#E8F0EB] shadow-[0_8px_32px_rgba(47,93,80,0.08)]">
      <div className={cn('p-5', showIllustration && 'lg:flex lg:items-center lg:gap-10 lg:p-8 xl:gap-12')}>
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

        {showIllustration ? (
          <div className="mx-auto mt-4 flex h-28 w-40 shrink-0 items-center justify-center rounded-[1.25rem] bg-white/50 lg:mx-0 lg:mt-0 lg:h-36 lg:w-52 lg:self-center">
            <Laptop className="h-14 w-14 text-green opacity-80 lg:h-16 lg:w-16" strokeWidth={1.5} aria-hidden="true" />
          </div>
        ) : null}
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
    <section className="overflow-hidden rounded-[1.5rem] border border-[#2F5D50]/15 bg-[#F4E7BE]/55 shadow-[0_4px_20px_rgba(47,93,80,0.05)] lg:rounded-[1.75rem]">
      <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-[#2F5D50]/10">
        <div className="flex gap-5 p-5 lg:p-7">
          <CommunityIllustration className="h-14 w-14 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#1F2A24]">What is Body Doubling?</p>
            <p className="mt-2 text-sm leading-relaxed text-[#6B6B63]">
              Body doubling means working alongside someone in a quiet shared space to make it easier
              to start and stay focused.
            </p>
            <button
              type="button"
              onClick={onLearnMore}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2F5D50] transition-opacity hover:opacity-80"
            >
              Learn more
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        <div className="flex flex-col justify-center p-5 lg:p-7 lg:pl-8">
          <p className="text-sm font-medium text-[#1F2A24]">Community</p>
          <div className="mt-3 flex items-center gap-2">
            {['A', 'B', 'C'].map((initial, index) => (
              <span
                key={initial}
                className={cn(
                  'flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-semibold text-white shadow-sm',
                  index === 0 && 'bg-[#7A6B96]',
                  index === 1 && 'bg-[#D39A45]',
                  index === 2 && 'bg-[#2F5D50]',
                )}
                aria-hidden="true"
              >
                {initial}
              </span>
            ))}
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-[#2F5D50]">
              +{extraCount}
            </span>
          </div>
          <p className="mt-2 text-sm text-[#6B6B63]">Join a growing group of focused minds.</p>
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
    <section className="overflow-hidden rounded-[1.5rem] bg-[#F4E7BE]/55 p-5 shadow-[0_4px_20px_rgba(47,93,80,0.05)]">
      <div
        role="tablist"
        aria-label="Body doubling information"
        className="flex gap-1 rounded-2xl bg-white/50 p-1"
      >
        <IntroTabButton active={activeTab === 'about'} onClick={() => setActiveTab('about')}>
          What is Body Doubling?
        </IntroTabButton>
        <IntroTabButton active={activeTab === 'analytics'} onClick={() => setActiveTab('analytics')}>
          Community
        </IntroTabButton>
      </div>

      <div className="mt-4" role="tabpanel">
        {activeTab === 'about' ? (
          <div className="flex gap-4">
            <CommunityIllustration className="h-14 w-14 shrink-0" />
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
    <div className="min-w-0 flex-1">
      <p className="text-sm leading-relaxed text-[#6B6B63]">
        Body doubling means working alongside someone in a quiet shared space to make it easier to
        start and stay focused.
      </p>
      <button
        type="button"
        onClick={onLearnMore}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#2F5D50] transition-opacity hover:opacity-80"
      >
        Learn more
        <ChevronRight className="h-4 w-4" aria-hidden="true" />
      </button>
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
    <div className="rounded-2xl bg-white/60 px-2 py-3">
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
