const STRATEGY_CATEGORIES = new Set([
  'Executive Function',
  'Emotional Regulation',
  'Sensory Management',
  'Social & Communication',
  'Daily Living',
  'Energy & Burnout',
])

const BEST_WHEN_LABELS = new Set([
  'Running Low',
  'Steady',
  'High Energy',
  'Recovery Needed',
])

const ENERGY_REQUIRED = new Set(['Low', 'Medium'])
const DIFFICULTY_LEVELS = new Set(['Easy', 'Moderate', 'Advanced'])
const EVIDENCE_LEVELS = new Set([
  'Clinical practice',
  'Community-informed',
  'Research-supported',
])
const STATUS_VALUES = new Set(['Published', 'Draft'])

const ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

export class CatalogValidationError extends Error {
  constructor(message) {
    super(message)
    this.name = 'CatalogValidationError'
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new CatalogValidationError(message)
  }
}

function validateStrategy(strategy, index) {
  const label = `strategies[${index}]`

  assert(strategy && typeof strategy === 'object', `${label} must be an object`)
  assert(typeof strategy.id === 'string' && ID_PATTERN.test(strategy.id), `${label}.id must be a kebab-case slug`)
  assert(typeof strategy.title === 'string' && strategy.title.length >= 3, `${label}.title is required`)
  assert(STRATEGY_CATEGORIES.has(strategy.category), `${label}.category is invalid`)
  assert(typeof strategy.challenge === 'string' && strategy.challenge.length >= 2, `${label}.challenge is required`)
  assert(typeof strategy.situation === 'string' && strategy.situation.length >= 10, `${label}.situation is too short`)
  assert(typeof strategy.internalThoughts === 'string' && strategy.internalThoughts.length >= 5, `${label}.internalThoughts is too short`)
  assert(typeof strategy.gentleReminder === 'string' && strategy.gentleReminder.length >= 10, `${label}.gentleReminder is too short`)
  assert(typeof strategy.whatsHappening === 'string' && strategy.whatsHappening.length >= 20, `${label}.whatsHappening is too short`)
  assert(Array.isArray(strategy.tryThis) && strategy.tryThis.length > 0, `${label}.tryThis must be a non-empty array`)

  for (const [tipIndex, tip] of strategy.tryThis.entries()) {
    assert(typeof tip === 'string' && tip.length >= 5, `${label}.tryThis[${tipIndex}] is too short`)
  }

  assert(typeof strategy.whyThisHelps === 'string' && strategy.whyThisHelps.length >= 10, `${label}.whyThisHelps is too short`)
  assert(typeof strategy.expectedOutcome === 'string' && strategy.expectedOutcome.length >= 10, `${label}.expectedOutcome is too short`)
  assert(typeof strategy.estimatedTime === 'string' && strategy.estimatedTime.length >= 2, `${label}.estimatedTime is required`)
  assert(ENERGY_REQUIRED.has(strategy.energyRequired), `${label}.energyRequired is invalid`)
  assert(DIFFICULTY_LEVELS.has(strategy.difficulty), `${label}.difficulty is invalid`)
  assert(Array.isArray(strategy.bestWhen) && strategy.bestWhen.length > 0, `${label}.bestWhen must be a non-empty array`)

  for (const bestWhen of strategy.bestWhen) {
    assert(BEST_WHEN_LABELS.has(bestWhen), `${label}.bestWhen contains invalid value "${bestWhen}"`)
  }

  assert(Array.isArray(strategy.tags) && strategy.tags.length > 0, `${label}.tags must be a non-empty array`)

  for (const tag of strategy.tags) {
    assert(typeof tag === 'string' && tag.trim().length >= 2, `${label}.tags contains invalid tag "${tag}"`)
  }

  assert(Array.isArray(strategy.relatedStrategies), `${label}.relatedStrategies must be an array`)

  for (const relatedId of strategy.relatedStrategies) {
    assert(typeof relatedId === 'string' && ID_PATTERN.test(relatedId), `${label}.relatedStrategies contains invalid id "${relatedId}"`)
  }

  assert(EVIDENCE_LEVELS.has(strategy.evidenceLevel), `${label}.evidenceLevel is invalid`)
  assert(typeof strategy.source === 'string' && strategy.source.length >= 5, `${label}.source is too short`)
  assert(STATUS_VALUES.has(strategy.status), `${label}.status is invalid`)
}

export function validateCatalog(catalog) {
  assert(catalog && typeof catalog === 'object', 'Catalog root must be an object')
  assert(Number.isInteger(catalog.version) && catalog.version >= 1, 'version must be a positive integer')
  assert(typeof catalog.catalogName === 'string' && catalog.catalogName.length > 0, 'catalogName is required')
  assert(typeof catalog.updatedAt === 'string' && DATE_PATTERN.test(catalog.updatedAt), 'updatedAt must be YYYY-MM-DD')
  assert(Array.isArray(catalog.strategies), 'strategies must be an array')

  const seenIds = new Set()

  catalog.strategies.forEach((strategy, index) => {
    validateStrategy(strategy, index)

    if (seenIds.has(strategy.id)) {
      throw new CatalogValidationError(`Duplicate strategy id "${strategy.id}"`)
    }
    seenIds.add(strategy.id)
  })

  for (const strategy of catalog.strategies) {
    for (const relatedId of strategy.relatedStrategies) {
      if (!seenIds.has(relatedId)) {
        throw new CatalogValidationError(
          `Strategy "${strategy.id}" references missing related strategy "${relatedId}"`,
        )
      }
    }
  }

  return catalog
}
