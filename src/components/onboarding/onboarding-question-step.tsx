import type { OnboardingQuestionConfig } from '@/data/onboarding-questions'
import { ONBOARDING_OPTION_SETS } from '@/data/onboarding-options'
import { OnboardingChoiceList } from '@/components/onboarding/onboarding-choice-list'
import { OnboardingMultiChoice } from '@/components/onboarding/onboarding-multi-choice'
import { OnboardingStepShell } from '@/components/onboarding/onboarding-step-shell'
import { Input } from '@/components/ui/input'
import type { OnboardingAnswers } from '@/types/onboarding'

interface OnboardingQuestionStepProps {
  question: OnboardingQuestionConfig
  answers: OnboardingAnswers
  onChange: (answers: OnboardingAnswers) => void
}

export function OnboardingQuestionStep({
  question,
  answers,
  onChange,
}: OnboardingQuestionStepProps) {
  return (
    <OnboardingStepShell title={question.title} helper={question.helper}>
      <QuestionInput question={question} answers={answers} onChange={onChange} />
    </OnboardingStepShell>
  )
}

function QuestionInput({
  question,
  answers,
  onChange,
}: OnboardingQuestionStepProps) {
  switch (question.id) {
    case 'preferred-name':
      return (
        <Input
          value={answers.displayName}
          onChange={(event) =>
            onChange({ ...answers, displayName: event.target.value })
          }
          placeholder={question.placeholder ?? 'Preferred name'}
          autoFocus
          className="min-h-12 rounded-2xl text-base"
        />
      )

    case 'reason-for-joining':
      return (
        <OnboardingChoiceList
          options={ONBOARDING_OPTION_SETS['brought-here']}
          value={answers.whatBroughtYouHere}
          onChange={(value) => onChange({ ...answers, whatBroughtYouHere: value })}
        />
      )

    case 'nd-status':
      return (
        <OnboardingChoiceList
          options={ONBOARDING_OPTION_SETS['nd-status']}
          value={answers.ndStatus}
          onChange={(value) => onChange({ ...answers, ndStatus: value })}
        />
      )

    case 'experiences':
      return (
        <OnboardingMultiChoice
          options={ONBOARDING_OPTION_SETS.experiences}
          values={answers.familiarExperiences}
          limit={question.selectionLimit ?? 5}
          onChange={(values) => onChange({ ...answers, familiarExperiences: values })}
        />
      )

    case 'work-environment':
      return (
        <OnboardingChoiceList
          options={ONBOARDING_OPTION_SETS['work-environment']}
          value={answers.workLocation}
          onChange={(value) => onChange({ ...answers, workLocation: value })}
        />
      )

    case 'job-role':
      return (
        <OnboardingChoiceList
          options={ONBOARDING_OPTION_SETS['job-role']}
          value={answers.profession}
          onChange={(value) => onChange({ ...answers, profession: value })}
        />
      )

    case 'energy-drainers':
      return (
        <OnboardingMultiChoice
          options={ONBOARDING_OPTION_SETS['energy-drainers']}
          values={answers.energyDrains}
          limit={question.selectionLimit ?? 3}
          onChange={(values) => onChange({ ...answers, energyDrains: values })}
        />
      )

    case 'peak-energy':
      return (
        <OnboardingChoiceList
          options={ONBOARDING_OPTION_SETS['peak-energy']}
          value={answers.peakEnergyTime}
          onChange={(value) => onChange({ ...answers, peakEnergyTime: value })}
        />
      )

    case 'support-style':
      return (
        <OnboardingChoiceList
          options={ONBOARDING_OPTION_SETS['support-style']}
          value={answers.supportStyle}
          onChange={(value) => onChange({ ...answers, supportStyle: value })}
        />
      )

    case 'information-preference':
      return (
        <OnboardingChoiceList
          options={ONBOARDING_OPTION_SETS['information-preference']}
          value={answers.informationPreference}
          onChange={(value) => onChange({ ...answers, informationPreference: value })}
        />
      )

    case 'goals':
      return (
        <OnboardingMultiChoice
          options={ONBOARDING_OPTION_SETS.goals}
          values={answers.successGoals}
          limit={question.selectionLimit ?? 3}
          onChange={(values) => onChange({ ...answers, successGoals: values })}
        />
      )

    case 'about-you':
      return (
        <div className="space-y-6">
          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-text">Age range</legend>
            <div className="flex flex-wrap gap-2">
              {ONBOARDING_OPTION_SETS['age-range'].map((option) => (
                <ChoiceChip
                  key={option.value}
                  label={option.label}
                  selected={answers.ageRange === option.value}
                  onClick={() =>
                    onChange({
                      ...answers,
                      ageRange: answers.ageRange === option.value ? null : option.value,
                    })
                  }
                />
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-text">Gender</legend>
            <div className="flex flex-wrap gap-2">
              {ONBOARDING_OPTION_SETS.gender.map((option) => (
                <ChoiceChip
                  key={option.value}
                  label={option.label}
                  selected={answers.gender === option.value}
                  onClick={() =>
                    onChange({
                      ...answers,
                      gender: answers.gender === option.value ? null : option.value,
                    })
                  }
                />
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label htmlFor="onboarding-country" className="text-sm font-medium text-text">
              Country
            </label>
            <Input
              id="onboarding-country"
              value={answers.country}
              onChange={(event) =>
                onChange({ ...answers, country: event.target.value })
              }
              placeholder="Optional"
              className="min-h-12 rounded-2xl text-base"
            />
          </div>
        </div>
      )

    default:
      return null
  }
}

function ChoiceChip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`min-h-11 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
        selected
          ? 'border-green/30 bg-green-muted/60 text-text'
          : 'border-border/70 bg-white/90 text-text hover:border-green/20 hover:bg-cream/60'
      }`}
    >
      {label}
    </button>
  )
}
