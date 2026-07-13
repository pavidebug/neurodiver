import { useCallback, useState } from 'react'
import { ArrowLeft, ArrowRight, NotebookPen, Shield } from 'lucide-react'
import {
  WeeklyResetChip,
  WeeklyResetSelectCard,
} from '@/components/weekly-reset/weekly-reset-controls'
import { WeeklyResetProgress } from '@/components/weekly-reset/weekly-reset-progress'
import {
  WeeklyResetQuestion,
  WeeklyResetStepShell,
} from '@/components/weekly-reset/weekly-reset-step-shell'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  ENERGY_DRAIN_OPTIONS,
  ENERGY_GIVER_OPTIONS,
  getChipLabels,
  getNextWeekIntentionLabel,
  getWeeklySummaryLabel,
  NEXT_WEEK_INTENTION_OPTIONS,
  NEXT_WEEK_INTENTION_REMINDERS,
  SUPPORT_NEED_OPTIONS,
  WEEKLY_RESET_NOTE_MAX,
  WEEKLY_SUMMARY_OPTIONS,
  type WeeklyResetChipOption,
} from '@/data/weekly-reset-options'
import {
  isWeeklyResetComplete,
  type NextWeekIntentionId,
  type WeeklyReflection,
  type WeeklyReflectionInput,
  type WeeklyResetChipId,
  type WeeklySummaryId,
} from '@/types/weekly-reflection'

type ResetStep =
  | 'intro'
  | 'summary'
  | 'givers'
  | 'drains'
  | 'support'
  | 'intention'
  | 'note'
  | 'complete'

const QUESTION_STEPS: ResetStep[] = [
  'summary',
  'givers',
  'drains',
  'support',
  'intention',
  'note',
]

function getProgressIndex(step: ResetStep): number {
  const index = QUESTION_STEPS.indexOf(step)
  return index === -1 ? 0 : index
}

function toggleChip(
  current: WeeklyResetChipId[],
  id: WeeklyResetChipId,
): WeeklyResetChipId[] {
  return current.includes(id) ? current.filter((item) => item !== id) : [...current, id]
}

interface GuidedWeeklyResetFlowProps {
  saving: boolean
  error: string | null
  completedReflection: WeeklyReflection | null
  onSubmit: (input: WeeklyReflectionInput) => Promise<WeeklyReflection>
  onExit: () => void
}

export function GuidedWeeklyResetFlow({
  saving,
  error,
  completedReflection,
  onSubmit,
  onExit,
}: GuidedWeeklyResetFlowProps) {
  const [step, setStep] = useState<ResetStep>(completedReflection ? 'complete' : 'intro')
  const [weeklySummary, setWeeklySummary] = useState<WeeklySummaryId | null>(
    completedReflection?.weeklySummary ?? null,
  )
  const [energyGivers, setEnergyGivers] = useState<WeeklyResetChipId[]>(
    completedReflection?.energyGivers ?? [],
  )
  const [energyDrains, setEnergyDrains] = useState<WeeklyResetChipId[]>(
    completedReflection?.energyDrains ?? [],
  )
  const [supportNeeds, setSupportNeeds] = useState<WeeklyResetChipId[]>(
    completedReflection?.supportNeeds ?? [],
  )
  const [nextWeekIntention, setNextWeekIntention] = useState<NextWeekIntentionId | null>(
    completedReflection?.nextWeekIntention ?? null,
  )
  const [futureYouNote, setFutureYouNote] = useState(completedReflection?.futureYouNote ?? '')
  const [energyGiversOther, setEnergyGiversOther] = useState(
    completedReflection?.energyGiversOther ?? '',
  )
  const [energyDrainsOther, setEnergyDrainsOther] = useState(
    completedReflection?.energyDrainsOther ?? '',
  )
  const [supportNeedsOther, setSupportNeedsOther] = useState(
    completedReflection?.supportNeedsOther ?? '',
  )
  const [savedReflection, setSavedReflection] = useState<WeeklyReflection | null>(
    completedReflection,
  )

  const goToStep = useCallback((next: ResetStep) => setStep(next), [])

  const goBack = useCallback(() => {
    const index = QUESTION_STEPS.indexOf(step)
    if (step === 'intro') {
      onExit()
      return
    }
    if (step === 'complete') {
      onExit()
      return
    }
    if (index <= 0) {
      goToStep('intro')
      return
    }
    goToStep(QUESTION_STEPS[index - 1]!)
  }, [goToStep, onExit, step])

  const canContinue = useCallback((): boolean => {
    switch (step) {
      case 'summary':
        return weeklySummary !== null
      case 'givers':
        return energyGivers.length > 0
      case 'drains':
        return energyDrains.length > 0
      case 'support':
        return supportNeeds.length > 0
      case 'intention':
        return nextWeekIntention !== null
      default:
        return true
    }
  }, [
    energyDrains.length,
    energyGivers.length,
    nextWeekIntention,
    step,
    supportNeeds.length,
    weeklySummary,
  ])

  const goNext = useCallback(() => {
    const index = QUESTION_STEPS.indexOf(step)
    if (index === -1 || index >= QUESTION_STEPS.length - 1) return
    goToStep(QUESTION_STEPS[index + 1]!)
  }, [goToStep, step])

  const buildInput = useCallback((): WeeklyReflectionInput | null => {
    const input: Partial<WeeklyReflectionInput> = {
      weeklySummary: weeklySummary ?? undefined,
      energyGivers,
      energyDrains,
      supportNeeds,
      nextWeekIntention: nextWeekIntention ?? undefined,
      futureYouNote,
      energyGiversOther,
      energyDrainsOther,
      supportNeedsOther,
    }
    return isWeeklyResetComplete(input) ? input : null
  }, [
    energyDrains,
    energyDrainsOther,
    energyGivers,
    energyGiversOther,
    futureYouNote,
    nextWeekIntention,
    supportNeeds,
    supportNeedsOther,
    weeklySummary,
  ])

  const handleFinish = useCallback(async () => {
    const input = buildInput()
    if (!input) return
    try {
      const reflection = await onSubmit(input)
      setSavedReflection(reflection)
      goToStep('complete')
    } catch {
      // error surfaced by parent
    }
  }, [buildInput, goToStep, onSubmit])

  const showProgress = QUESTION_STEPS.includes(step)
  const reflection = savedReflection ?? completedReflection

  return (
    <div className="flex min-h-[calc(100dvh-2rem)] flex-col lg:mx-auto lg:max-w-xl">
      <header className="flex shrink-0 items-center justify-between gap-3 pb-4">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="shrink-0 rounded-xl"
          aria-label={step === 'intro' || step === 'complete' ? 'Back to home' : 'Previous step'}
          onClick={goBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {showProgress ? (
          <WeeklyResetProgress activeIndex={getProgressIndex(step)} />
        ) : (
          <div className="h-2 w-24" aria-hidden="true" />
        )}

        {step === 'note' ? (
          <button
            type="button"
            onClick={() => void handleFinish()}
            disabled={saving}
            className="shrink-0 px-2 py-1 text-sm font-medium text-text-muted transition-colors hover:text-text"
          >
            Skip
          </button>
        ) : (
          <div className="w-12 shrink-0" aria-hidden="true" />
        )}
      </header>

      <div className="flex flex-1 flex-col overflow-hidden rounded-[2rem] border border-lavender/20 bg-gradient-to-b from-white/95 via-lavender-muted/20 to-cream/90 px-6 py-8 shadow-[0_12px_48px_rgba(122,107,150,0.08)] sm:px-8 sm:py-10">
        {step === 'intro' ? (
          <WeeklyResetStepShell stepKey="intro">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-lavender-muted text-lavender-deep">
              <NotebookPen className="h-8 w-8" aria-hidden="true" />
            </div>
            <div className="space-y-3 text-center">
              <h1 className="font-display text-3xl font-semibold text-text sm:text-4xl">
                This Week With Your Brain
              </h1>
              <p className="text-base leading-relaxed text-text-muted">
                A few minutes to notice what gave you energy, what felt heavy, and one gentle
                intention for next week — no streaks, no scores.
              </p>
            </div>
            <div className="flex items-start gap-3 rounded-2xl border border-green/15 bg-green-muted/35 px-4 py-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-green" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-text-muted">
                Your individual responses stay private. If your organization uses NeuroDiver, only
                anonymous, aggregated trends are shared.
              </p>
            </div>
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                size="lg"
                className="rounded-full bg-lavender-deep px-8 text-white hover:bg-lavender-deep/90"
                onClick={() => goToStep('summary')}
              >
                Begin Weekly Reset
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </WeeklyResetStepShell>
        ) : null}

        {step === 'summary' ? (
          <WeeklyResetStepShell stepKey="summary">
            <WeeklyResetQuestion>
              When you think about this week, which statement feels most true?
            </WeeklyResetQuestion>
            <div className="space-y-3">
              {WEEKLY_SUMMARY_OPTIONS.map((option) => (
                <WeeklyResetSelectCard
                  key={option.id}
                  label={option.label}
                  icon={option.icon}
                  selected={weeklySummary === option.id}
                  onSelect={() => setWeeklySummary(option.id)}
                />
              ))}
            </div>
          </WeeklyResetStepShell>
        ) : null}

        {step === 'givers' ? (
          <ChipStep
            stepKey="givers"
            question="What gave you energy this week?"
            options={ENERGY_GIVER_OPTIONS}
            selected={energyGivers}
            onToggle={(id) => setEnergyGivers((current) => toggleChip(current, id))}
            otherValue={energyGiversOther}
            onOtherChange={setEnergyGiversOther}
            showOther={energyGivers.includes('something-else')}
          />
        ) : null}

        {step === 'drains' ? (
          <ChipStep
            stepKey="drains"
            question="What drained your energy the most?"
            options={ENERGY_DRAIN_OPTIONS}
            selected={energyDrains}
            onToggle={(id) => setEnergyDrains((current) => toggleChip(current, id))}
            otherValue={energyDrainsOther}
            onOtherChange={setEnergyDrainsOther}
            showOther={energyDrains.includes('something-else')}
          />
        ) : null}

        {step === 'support' ? (
          <ChipStep
            stepKey="support"
            question="Which of these would have made this week easier?"
            options={SUPPORT_NEED_OPTIONS}
            selected={supportNeeds}
            onToggle={(id) => setSupportNeeds((current) => toggleChip(current, id))}
            otherValue={supportNeedsOther}
            onOtherChange={setSupportNeedsOther}
            showOther={supportNeeds.includes('something-else')}
          />
        ) : null}

        {step === 'intention' ? (
          <WeeklyResetStepShell stepKey="intention">
            <WeeklyResetQuestion>
              What&apos;s one small thing you&apos;d like to try next week?
            </WeeklyResetQuestion>
            <div className="space-y-3">
              {NEXT_WEEK_INTENTION_OPTIONS.map((option) => (
                <WeeklyResetSelectCard
                  key={option.id}
                  label={option.label}
                  icon={option.icon}
                  selected={nextWeekIntention === option.id}
                  onSelect={() => setNextWeekIntention(option.id)}
                />
              ))}
            </div>
          </WeeklyResetStepShell>
        ) : null}

        {step === 'note' ? (
          <WeeklyResetStepShell stepKey="note">
            <WeeklyResetQuestion>
              What&apos;s one thing you&apos;d like Future You to remember next week?
            </WeeklyResetQuestion>
            <p className="text-center text-sm text-text-muted">Optional — a line or two is enough.</p>
            <div className="rounded-[1.5rem] border border-lavender/25 bg-white/70 p-5 shadow-inner">
              <Textarea
                id="future-you-note"
                value={futureYouNote}
                onChange={(event) => setFutureYouNote(event.target.value)}
                placeholder="I noticed that..."
                maxLength={WEEKLY_RESET_NOTE_MAX}
                className="min-h-36 resize-none border-none bg-transparent text-base shadow-none focus-visible:ring-0"
              />
              <p className="mt-2 text-right text-xs text-text-muted">
                {futureYouNote.length}/{WEEKLY_RESET_NOTE_MAX}
              </p>
            </div>
          </WeeklyResetStepShell>
        ) : null}

        {step === 'complete' && reflection ? (
          <WeeklyResetStepShell stepKey="complete">
            <div className="space-y-3 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-muted text-green">
                <NotebookPen className="h-8 w-8" aria-hidden="true" />
              </div>
              <h1 className="font-display text-3xl font-semibold text-text">This Week With Your Brain</h1>
              <p className="text-base leading-relaxed text-text-muted">
                Here&apos;s what we noticed — no grades, just patterns worth carrying forward.
              </p>
            </div>

            <div className="space-y-3">
              <SummaryCard label="What gave you energy" value={formatChipSummary(reflection.energyGivers, ENERGY_GIVER_OPTIONS, reflection.energyGiversOther)} />
              <SummaryCard label="What drained you" value={formatChipSummary(reflection.energyDrains, ENERGY_DRAIN_OPTIONS, reflection.energyDrainsOther)} />
              <SummaryCard label="Support that helps" value={formatChipSummary(reflection.supportNeeds, SUPPORT_NEED_OPTIONS, reflection.supportNeedsOther)} />
              <SummaryCard label="Pattern noticed" value={getWeeklySummaryLabel(reflection.weeklySummary)} />
              <SummaryCard
                label="One gentle suggestion for next week"
                value={getNextWeekIntentionLabel(reflection.nextWeekIntention)}
              />
              <div className="rounded-[1.25rem] border border-lavender/25 bg-lavender-muted/35 px-5 py-4">
                <p className="text-sm font-medium text-lavender-deep">A gentle reminder</p>
                <p className="mt-2 text-base leading-relaxed text-text">
                  {NEXT_WEEK_INTENTION_REMINDERS[reflection.nextWeekIntention]}
                </p>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button type="button" size="lg" className="rounded-full px-10" onClick={onExit}>
                Back Home
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </WeeklyResetStepShell>
        ) : null}

        {error ? (
          <p className="mt-4 rounded-xl bg-orange/10 px-4 py-3 text-sm text-orange" role="alert">
            {error}
          </p>
        ) : null}
      </div>

      {step !== 'intro' && step !== 'complete' ? (
        <div className="mt-5 flex justify-center">
          {step === 'note' ? (
            <Button
              type="button"
              size="lg"
              className="w-full rounded-full bg-lavender-deep text-white hover:bg-lavender-deep/90 sm:w-auto sm:px-10"
              disabled={saving || !buildInput()}
              onClick={() => void handleFinish()}
            >
              {saving ? 'Saving…' : 'Finish'}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              className="w-full rounded-full bg-lavender-deep text-white hover:bg-lavender-deep/90 sm:w-auto sm:px-10"
              disabled={!canContinue()}
              onClick={goNext}
            >
              Next
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      ) : null}
    </div>
  )
}

function ChipStep({
  stepKey,
  question,
  options,
  selected,
  onToggle,
  otherValue,
  onOtherChange,
  showOther,
}: {
  stepKey: string
  question: string
  options: Array<{ id: WeeklyResetChipId; label: string }>
  selected: WeeklyResetChipId[]
  onToggle: (id: WeeklyResetChipId) => void
  otherValue: string
  onOtherChange: (value: string) => void
  showOther: boolean
}) {
  return (
    <WeeklyResetStepShell stepKey={stepKey}>
      <WeeklyResetQuestion>{question}</WeeklyResetQuestion>
      <p className="text-center text-sm text-text-muted">Choose all that apply.</p>
      <div className="flex flex-wrap justify-center gap-2.5">
        {options.map((option) => (
          <WeeklyResetChip
            key={option.id}
            label={option.label}
            selected={selected.includes(option.id)}
            onToggle={() => onToggle(option.id)}
          />
        ))}
      </div>
      {showOther ? (
        <Textarea
          value={otherValue}
          onChange={(event) => onOtherChange(event.target.value)}
          placeholder="Tell us a little more…"
          className="min-h-20 resize-none rounded-2xl border-lavender/25 bg-white/80"
        />
      ) : null}
    </WeeklyResetStepShell>
  )
}

function formatChipSummary(
  ids: WeeklyResetChipId[],
  options: WeeklyResetChipOption[],
  other?: string | null,
): string {
  const labels = getChipLabels(ids, options)
  if (other?.trim()) labels.push(other.trim())
  return labels.length > 0 ? labels.join(', ') : 'Noted for this week'
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-border/50 bg-white/75 px-5 py-4">
      <p className="text-xs font-medium uppercase tracking-wide text-text-muted">{label}</p>
      <p className="mt-1.5 text-base leading-relaxed text-text">{value}</p>
    </div>
  )
}
