import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ProfileHeaderProps {
  displayName: string
  email: string | null | undefined
  photoURL: string | null | undefined
  initials: string
  signingOut: boolean
  onSignOut: () => void
}

export function ProfileHeader({
  displayName,
  email,
  photoURL,
  initials,
  signingOut,
  onSignOut,
}: ProfileHeaderProps) {
  return (
    <article className="card-premium slide-up rounded-[1.25rem] bg-surface-solid px-4 py-4 shadow-[0_2px_16px_rgba(31,42,36,0.06)] lg:rounded-[1.5rem] lg:px-6 lg:py-5">
      <ProfileIdentity
        displayName={displayName}
        email={email}
        photoURL={photoURL}
        initials={initials}
        signingOut={signingOut}
        onSignOut={onSignOut}
        centered
        className="lg:items-center lg:text-center"
      />
    </article>
  )
}

function ProfileIdentity({
  displayName,
  email,
  photoURL,
  initials,
  signingOut,
  onSignOut,
  centered = false,
  className,
}: ProfileHeaderProps & { centered?: boolean; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-2.5', centered && 'items-center text-center', className)}>
      {photoURL ? (
        <img
          src={photoURL}
          alt=""
          className="h-14 w-14 rounded-full object-cover ring-2 ring-green-muted/60"
        />
      ) : (
        <div
          className="flex h-14 w-14 items-center justify-center rounded-full bg-lavender-deep text-lg font-semibold text-white ring-2 ring-green-muted/60"
          aria-hidden="true"
        >
          {initials}
        </div>
      )}

      <div className="space-y-0.5">
        <h1 className="font-display text-xl font-semibold text-text">{displayName}</h1>
        <p className="text-sm text-text-muted">{email ?? "You're doing great by showing up."}</p>
      </div>

      <Button
        variant="ghost"
        className="h-8 gap-1.5 px-2 text-sm text-text-muted hover:text-text"
        disabled={signingOut}
        onClick={onSignOut}
      >
        <LogOut className="h-4 w-4" aria-hidden="true" />
        {signingOut ? 'Signing out…' : 'Sign out'}
      </Button>
    </div>
  )
}
