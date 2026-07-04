import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Quote, Sparkles } from 'lucide-react'
import { EnergySnapshot } from '@/components/reflection/energy-snapshot'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type {
  DailyReflectionContent,
  EnergySnapshotItem,
  StatusPresentation,
} from '@/lib/reflection'

export interface ReflectionLayoutProps {
  eyebrow?: string
  status: StatusPresentation
  brainStatusTitle: string
  summary: string
  energySnapshot: EnergySnapshotItem[]
  recommendation: DailyReflectionContent['recommendation']
  quote: string
  intention: string
  onIntentionChange: (value: string) => void
  onContinue: () => void | Promise<void>
  continueLabel?: string
  savingIntention?: boolean
  intentionSaved?: boolean
}

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
}

const reducedFadeUp = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
}

export function ReflectionLayout({
  eyebrow = 'Daily Reflection',
  status,
  brainStatusTitle,
  summary,
  energySnapshot,
  recommendation,
  quote,
  intention,
  onIntentionChange,
  onContinue,
  continueLabel = 'Continue to Dashboard',
  savingIntention = false,
  intentionSaved = false,
}: ReflectionLayoutProps) {
  const prefersReducedMotion = useReducedMotion()
  const itemVariant = prefersReducedMotion ? reducedFadeUp : fadeUp

  return (
    <motion.div
      className="mx-auto flex min-h-[80dvh] max-w-md flex-col gap-10 py-2 pb-8"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Hero — Brain Status */}
      <motion.header variants={itemVariant} className="space-y-5 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-text-muted">
          {eyebrow}
        </p>

        <div
          className={cn(
            'relative overflow-hidden rounded-3xl px-8 py-12 ring-1',
            status.bgClass,
            status.ringClass,
          )}
        >
          <Sparkles
            className="absolute right-6 top-6 h-5 w-5 text-green/30"
            aria-hidden="true"
          />
          <div className="flex flex-col items-center gap-4">
            <span className="text-5xl leading-none" aria-hidden="true">
              {status.emoji}
            </span>
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-widest text-text-muted">
                Brain Status
              </p>
              <h1
                className={cn(
                  'font-display text-4xl font-semibold tracking-tight',
                  status.accentClass,
                )}
              >
                {status.label}
              </h1>
              <p className="text-base leading-relaxed text-text-muted">
                {brainStatusTitle}
              </p>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Personalized Summary */}
      <motion.section variants={itemVariant} className="space-y-3 px-1">
        <h2 className="font-display text-xl font-semibold text-text">
          Your summary
        </h2>
        <p className="text-lg leading-relaxed text-text">{summary}</p>
      </motion.section>

      {/* Energy Snapshot */}
      <motion.section variants={itemVariant} className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-text">
          Energy snapshot
        </h2>
        <EnergySnapshot items={energySnapshot} />
      </motion.section>

      {/* Today's Recommendation */}
      <motion.section variants={itemVariant} aria-labelledby="recommendation-heading">
        <h2 id="recommendation-heading" className="sr-only">
          Today&apos;s recommendation
        </h2>
        <Card className="overflow-hidden border-green/20 bg-surface-solid shadow-sm">
          <CardContent className="space-y-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-green">
              Today&apos;s recommendation
            </p>
            <h3 className="font-display text-2xl font-semibold leading-snug text-text">
              {recommendation.title}
            </h3>
            <p className="text-base leading-relaxed text-text-muted">
              {recommendation.description}
            </p>
            <Link
              to={recommendation.href}
              className="inline-flex items-center gap-1 text-sm font-semibold text-green underline-offset-4 hover:underline"
            >
              Explore this
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </CardContent>
        </Card>
      </motion.section>

      {/* Daily Quote */}
      <motion.blockquote
        variants={itemVariant}
        className="rounded-2xl bg-yellow/30 px-6 py-5"
      >
        <div className="flex gap-3">
          <Quote
            className="mt-1 h-5 w-5 shrink-0 text-orange"
            aria-hidden="true"
          />
          <p className="text-base italic leading-relaxed text-text">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </motion.blockquote>

      {/* Daily Intention */}
      <motion.section variants={itemVariant} className="space-y-3">
        <div className="space-y-1">
          <label
            htmlFor="daily-intention"
            className="font-display text-xl font-semibold text-text"
          >
            Daily intention
          </label>
          <p className="text-base text-text-muted">
            What is one thing you&apos;d like to accomplish today?
          </p>
        </div>
        <Textarea
          id="daily-intention"
          name="daily-intention"
          placeholder="One small, meaningful goal…"
          value={intention}
          onChange={(event) => onIntentionChange(event.target.value)}
          aria-describedby="intention-status"
        />
        <p id="intention-status" className="text-sm text-text-muted">
          {savingIntention
            ? 'Saving…'
            : intentionSaved
              ? 'Saved'
              : 'Optional — take a moment to set your focus'}
        </p>
      </motion.section>

      {/* Continue */}
      <motion.div variants={itemVariant} className="mt-auto pt-2">
        <Button
          size="lg"
          className="w-full"
          disabled={savingIntention}
          onClick={() => void onContinue()}
        >
          {continueLabel}
          <ArrowRight className="h-5 w-5" aria-hidden="true" />
        </Button>
      </motion.div>
    </motion.div>
  )
}
