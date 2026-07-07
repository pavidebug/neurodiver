export function AuthLoadingScreen() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream">
      <div className="text-center">
        <div
          className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-green-muted border-t-green"
          aria-hidden="true"
        />
        <p className="text-sm text-text-muted">Loading your session…</p>
      </div>
    </div>
  )
}
