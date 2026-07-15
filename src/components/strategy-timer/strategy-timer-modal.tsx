import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Clock3, Pause, Play, Plus, Square, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { StrategyTimerComplete } from '@/components/strategy-timer/strategy-timer-complete'
import type { StrategyTimerReflection, PersistedStrategyTimer } from '@/hooks/use-strategy-timer'
import type { Strategy } from '@/types/strategy'

interface StrategyTimerModalProps {
  strategy: Strategy
  timer: PersistedStrategyTimer
  remainingMs: number
  complete: boolean
  returnFocusTo: HTMLElement | null
  onPause: () => void
  onResume: () => void
  onAddMinute: () => void
  onFinishEarly: () => void
  onCancel: () => void
  onReflection: (reflection: StrategyTimerReflection) => void
}

function formatRemaining(remainingMs: number): string {
  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}

export function StrategyTimerModal({
  strategy,
  timer,
  remainingMs,
  complete,
  returnFocusTo,
  onPause,
  onResume,
  onAddMinute,
  onFinishEarly,
  onCancel,
  onReflection,
}: StrategyTimerModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      if (complete) onReflection('skip')
      else onCancel()
    }
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      window.requestAnimationFrame(() => returnFocusTo?.focus())
    }
  }, [complete, onCancel, onReflection, returnFocusTo])

  const close = () => {
    if (complete) onReflection('skip')
    else onCancel()
  }

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-text/35 backdrop-blur-sm"
        aria-label="Close timer"
        onClick={close}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="strategy-timer-title"
        className="popup-enter relative z-10 w-full max-w-lg rounded-[2rem] border border-green/10 bg-gradient-to-br from-surface-solid via-surface-solid to-green-muted/35 p-5 shadow-2xl sm:p-7"
      >
        <Button
          ref={closeButtonRef}
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 z-10 rounded-xl"
          aria-label="Close timer"
          onClick={close}
        >
          <X className="h-5 w-5" />
        </Button>

        {complete ? (
          <StrategyTimerComplete onSelect={onReflection} />
        ) : (
          <div className="space-y-6 pt-2">
            <header className="pr-12">
              <div className="flex items-center gap-2 text-green">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
                <p className="text-xs font-semibold uppercase tracking-[0.1em]">Gentle timer</p>
              </div>
              <h2 id="strategy-timer-title" className="mt-3 font-display text-2xl font-semibold text-text">
                {strategy.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                {strategy.tryThis[0] ?? strategy.gentleReminder}
              </p>
            </header>

            <div className="rounded-[1.5rem] bg-white/75 px-5 py-7 text-center ring-1 ring-green/10">
              <p className="text-sm font-medium text-text-muted">
                {timer.paused ? 'Paused — take the time you need' : 'Time remaining'}
              </p>
              <p className="mt-2 font-mono text-6xl font-semibold tabular-nums tracking-tight text-text" aria-live="off">
                {formatRemaining(remainingMs)}
              </p>
              <p className="sr-only" aria-live="polite">
                {timer.paused ? 'Timer paused' : 'Timer running'}
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {timer.paused ? (
                <Button type="button" onClick={onResume} aria-label="Resume timer">
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Resume
                </Button>
              ) : (
                <Button type="button" onClick={onPause} aria-label="Pause timer">
                  <Pause className="h-4 w-4" aria-hidden="true" />
                  Pause
                </Button>
              )}
              <Button type="button" variant="outline" onClick={onAddMinute} aria-label="Add one minute">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add 1 minute
              </Button>
              <Button type="button" variant="ghost" className="sm:col-span-2" onClick={onFinishEarly}>
                <Square className="h-4 w-4" aria-hidden="true" />
                Finish early
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body,
  )
}
