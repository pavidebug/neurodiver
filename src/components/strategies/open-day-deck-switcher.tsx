import {
  OPEN_DAY_DECK_VERSIONS,
  type OpenDayDeckVersion,
} from '@/lib/open-day'
import { cn } from '@/lib/utils'

interface OpenDayDeckSwitcherProps {
  version: OpenDayDeckVersion
  onChange: (version: OpenDayDeckVersion) => void
}

export function OpenDayDeckSwitcher({
  version,
  onChange,
}: OpenDayDeckSwitcherProps) {
  return (
    <section
      className="mb-5 flex flex-col gap-3 rounded-2xl border border-green/15 bg-surface-solid px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
      aria-labelledby="open-day-deck-label"
    >
      <div>
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-green">
          Open Day
        </p>
        <p id="open-day-deck-label" className="mt-0.5 text-sm font-medium text-text">
          Strategy Deck test version
        </p>
      </div>

      <div
        className="grid grid-cols-3 gap-1 rounded-xl bg-cream-dark p-1"
        role="group"
        aria-label="Choose a Strategy Deck version"
      >
        {OPEN_DAY_DECK_VERSIONS.map((deckVersion) => {
          const selected = version === deckVersion

          return (
            <button
              key={deckVersion}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(deckVersion)}
              className={cn(
                'min-h-10 rounded-lg px-3 text-sm font-semibold transition-colors',
                selected
                  ? 'bg-green text-white shadow-sm'
                  : 'text-text-muted hover:bg-surface-solid hover:text-text',
              )}
            >
              V{deckVersion}
            </button>
          )
        })}
      </div>
    </section>
  )
}
