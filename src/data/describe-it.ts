export const DESCRIBE_PLACEHOLDER_EXAMPLES = [
  "I know what I need to do but I can't seem to start.",
  "I've been in meetings all day and now I don't have the energy to do my actual work.",
  'I feel completely drained after talking to people.',
  'I keep forgetting what I was about to do.',
  'My brain just feels noisy today.',
]

export const DESCRIBE_TOPIC_OPTIONS = [
  'Getting started',
  'Staying focused',
  'Feeling overwhelmed',
  'Managing my energy',
  'Communicating with others',
  'Planning my day',
  'Something else',
] as const

export type DescribeTopic = (typeof DESCRIBE_TOPIC_OPTIONS)[number]

/** Keywords appended to free-text search when an optional topic is selected */
export const DESCRIBE_TOPIC_KEYWORDS: Record<DescribeTopic, string> = {
  'Getting started': 'task initiation starting procrastination executive function',
  'Staying focused': 'focus concentration attention distract',
  'Feeling overwhelmed': 'overwhelm stress too much',
  'Managing my energy': 'energy burnout depleted rest recovery',
  'Communicating with others': 'social communication masking interaction',
  'Planning my day': 'planning executive function organize schedule',
  'Something else': '',
}

export const DESCRIBE_DRAFT_STORAGE_KEY = 'neurodiver:describe-draft'

export interface DescribeDraft {
  description: string
  optionalTopic: DescribeTopic | null
  savedAt: string
}
