const BEST_WHEN_TO_BRAIN_STATUS = {
  'Running Low': 'running-low',
  Steady: 'steady',
  'High Energy': 'high-energy',
  'Recovery Needed': 'recovery-needed',
}

/** Add Firestore query fields derived from catalog entries */
export function normalizeStrategyForFirestore(entry, index) {
  const recommendedFor = entry.bestWhen
    .map((label) => BEST_WHEN_TO_BRAIN_STATUS[label])
    .filter(Boolean)

  return {
    ...entry,
    order: index + 1,
    isActive: entry.status === 'Published',
    description: entry.gentleReminder,
    tip: entry.tryThis[0] ?? '',
    recommendedFor,
  }
}
