export type ConfigurablePageKey = 'today' | 'strategies' | 'bodyDouble'
export type FeatureTabKey = ConfigurablePageKey | 'profile' | 'onboarding'

export interface FeaturePageConfig {
  enabled: boolean
  sections: Record<string, boolean>
}

export type FeatureConfig = Record<FeatureTabKey, FeaturePageConfig>

export const DEFAULT_FEATURE_CONFIG: FeatureConfig = {
  today: {
    enabled: true,
    sections: {
      welcome: true,
      checkIn: true,
      recommendations: true,
      continueCard: true,
      weeklyReset: true,
      encouragement: true,
    },
  },
  strategies: {
    enabled: true,
    sections: {
      header: true,
      situations: true,
      search: true,
      categories: true,
      saved: true,
    },
  },
  bodyDouble: {
    enabled: true,
    sections: {
      virtualSessions: true,
      physicalSessions: true,
      focusIntro: true,
      communityIntro: true,
      emailUpdates: true,
    },
  },
  profile: {
    enabled: true,
    sections: {
      stats: true,
      checkInPrompt: true,
      support: true,
      preferences: true,
      community: true,
    },
  },
  onboarding: {
    enabled: true,
    sections: {
      'preferred-name': true,
      'reason-for-joining': true,
      experiences: true,
      'energy-drainers': true,
      'support-style': true,
    },
  },
}
