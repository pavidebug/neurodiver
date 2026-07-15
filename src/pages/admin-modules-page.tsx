import { useEffect, useState } from 'react'
import { Eye, EyeOff, LayoutPanelTop } from 'lucide-react'
import { Switch } from '@/components/ui/switch'
import { useFeatureConfig } from '@/context/feature-config-context'
import { saveFeatureConfig } from '@/lib/feature-config'
import { cn } from '@/lib/utils'
import { ONBOARDING_QUESTIONS } from '@/data/onboarding-questions'
import type { FeatureConfig, FeatureTabKey } from '@/types/feature-config'

const TABS: Array<{ key: FeatureTabKey; label: string; description: string }> = [
  { key: 'today', label: 'Today', description: 'The user homepage and daily dashboard.' },
  { key: 'strategies', label: 'Strategies', description: 'Strategy search, categories and saved items.' },
  { key: 'bodyDouble', label: 'Body Double', description: 'Virtual and physical focus sessions.' },
  { key: 'onboarding', label: 'Onboarding', description: 'First-time sign-up questions and profile setup.' },
  { key: 'profile', label: 'Profile', description: 'Account, preferences and community links.' },
]

const ONBOARDING_SECTION_LABELS = Object.fromEntries(
  ONBOARDING_QUESTIONS.map((question) => [
    question.id,
    {
      label: question.title,
      description: question.required
        ? 'Required when this question is enabled.'
        : 'Optional onboarding question.',
    },
  ]),
)

const SECTION_LABELS: Record<FeatureTabKey, Record<string, { label: string; description: string }>> = {
  today: {
    welcome: { label: 'Welcome header', description: 'Greeting and today’s introductory message.' },
    checkIn: { label: 'Today check-in', description: 'Check-in status and primary check-in action.' },
    recommendations: { label: 'Recommendations', description: 'Suggested actions and strategies for right now.' },
    continueCard: { label: 'Continue card', description: 'The next saved or recently used item.' },
    weeklyReset: { label: 'Weekly reset', description: 'Weekly review card and unlock progress.' },
    encouragement: { label: 'Encouragement', description: 'The supportive message at the bottom.' },
  },
  strategies: {
    header: { label: 'Page introduction', description: 'Strategy Navigator title and guidance.' },
    situations: { label: 'I’m struggling with', description: 'Situation shortcut cards.' },
    search: { label: 'Search', description: 'Strategy keyword search box.' },
    categories: { label: 'Browse by category', description: 'Category browsing carousel.' },
    saved: { label: 'Saved strategies', description: 'The saved-strategy section.' },
  },
  bodyDouble: {
    virtualSessions: { label: 'Virtual sessions', description: 'Available online focus sessions.' },
    physicalSessions: { label: 'Physical sessions', description: 'Coming-soon in-person session cards.' },
    focusIntro: { label: 'Focus Together introduction', description: 'The large explanatory hero card.' },
    communityIntro: { label: 'Body Double explanation', description: 'What it is and community information.' },
    emailUpdates: { label: 'Email updates', description: 'Body Double email-interest form.' },
  },
  profile: {
    stats: { label: 'Profile statistics', description: 'Check-in totals and streak information.' },
    checkInPrompt: { label: 'Check-in prompt', description: 'Reminder shown before today’s check-in.' },
    support: { label: 'Support', description: 'Contact and help links.' },
    preferences: { label: 'Preferences', description: 'Theme, reminders and privacy.' },
    community: { label: 'Admin shortcut', description: 'Developer Dashboard link for the admin account.' },
  },
  onboarding: ONBOARDING_SECTION_LABELS,
}

export function AdminModulesPage() {
  const { config, loading } = useFeatureConfig()
  const [activeTab, setActiveTab] = useState<FeatureTabKey>('today')
  const [draft, setDraft] = useState<FeatureConfig>(config)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!saving) setDraft(config)
  }, [config, saving])

  async function persist(next: FeatureConfig) {
    setDraft(next)
    setSaving(true)
    setMessage(null)
    try {
      await saveFeatureConfig(next)
      setMessage('Visibility updated. User screens will refresh automatically.')
    } catch {
      setDraft(config)
      setMessage('Could not save this change. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  function togglePage(enabled: boolean) {
    void persist({ ...draft, [activeTab]: { ...draft[activeTab], enabled } })
  }

  function toggleSection(section: string, enabled: boolean) {
    void persist({
      ...draft,
      [activeTab]: {
        ...draft[activeTab],
        sections: { ...draft[activeTab].sections, [section]: enabled },
      },
    })
  }

  if (loading) return <p className="text-sm text-text-muted">Loading module controls…</p>

  const tab = TABS.find((item) => item.key === activeTab) ?? TABS[0]
  const isProfile = activeTab === 'profile'

  return (
    <div className="page-enter space-y-6">
      <div className="rounded-3xl border border-green/10 bg-gradient-to-br from-green-muted/70 via-surface-solid to-lavender-muted/40 p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green text-white">
            <LayoutPanelTop className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-2xl font-semibold text-text">Choose what users can see</h2>
            <p className="mt-1 max-w-3xl text-sm leading-relaxed text-text-muted">
              Turn complete pages or individual sections on and off as you release the product in phases.
              Changes are stored in Firebase and appear for users automatically.
            </p>
          </div>
        </div>
      </div>

      <div role="tablist" aria-label="User screens" className="flex gap-2 overflow-x-auto pb-1">
        {TABS.map((item) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={activeTab === item.key}
            onClick={() => { setActiveTab(item.key); setMessage(null) }}
            className={cn(
              'shrink-0 rounded-2xl px-5 py-3 text-sm font-semibold transition',
              activeTab === item.key
                ? 'bg-green text-white shadow-sm'
                : 'border border-border bg-surface text-text-muted hover:bg-cream',
            )}
          >
            {item.label}
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-3xl border border-border bg-surface-solid">
        <div className="flex items-center justify-between gap-4 border-b border-border bg-cream/50 px-5 py-5 sm:px-6">
          <div>
            <h3 className="font-display text-xl font-semibold text-text">{tab.label}</h3>
            <p className="mt-1 text-sm text-text-muted">{tab.description}</p>
          </div>
          {isProfile ? (
            <span className="rounded-full bg-green-muted px-3 py-1.5 text-xs font-semibold text-green">Always available</span>
          ) : (
            <div className="flex items-center gap-3">
              {draft[activeTab].enabled ? <Eye className="h-5 w-5 text-green" /> : <EyeOff className="h-5 w-5 text-text-muted" />}
              <Switch
                checked={draft[activeTab].enabled}
                disabled={saving}
                onCheckedChange={togglePage}
                aria-label={`Show ${tab.label} page`}
              />
            </div>
          )}
        </div>

        <div className="divide-y divide-border/70">
          {Object.entries(SECTION_LABELS[activeTab]).map(([key, section]) => (
            <div key={key} className="flex items-center justify-between gap-5 px-5 py-4 sm:px-6">
              <div>
                <p className="font-medium text-text">{section.label}</p>
                <p className="mt-0.5 text-sm text-text-muted">{section.description}</p>
              </div>
              <Switch
                checked={draft[activeTab].sections[key] !== false}
                disabled={saving || (!isProfile && !draft[activeTab].enabled)}
                onCheckedChange={(checked) => toggleSection(key, checked)}
                aria-label={`Show ${section.label}`}
              />
            </div>
          ))}
        </div>
      </section>

      {message ? <p className="rounded-2xl bg-green-muted/60 px-4 py-3 text-sm text-green" role="status">{message}</p> : null}
    </div>
  )
}
