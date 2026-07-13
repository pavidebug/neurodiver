export const SITUATION_CARD_STYLES: Record<
  string,
  { bgClass: string; iconClass: string }
> = {
  'starting-task': { bgClass: 'bg-sage-light/80', iconClass: 'text-green' },
  overwhelmed: { bgClass: 'bg-[#F8E4E8]', iconClass: 'text-[#C97B8A]' },
  masking: { bgClass: 'bg-lavender-muted', iconClass: 'text-lavender-deep' },
  'low-energy': { bgClass: 'bg-yellow/50', iconClass: 'text-orange' },
  distractions: { bgClass: 'bg-lavender/40', iconClass: 'text-lavender-deep' },
  'racing-thoughts': { bgClass: 'bg-[#FFE8CC]', iconClass: 'text-orange' },
  'time-blindness': { bgClass: 'bg-[#E3EEF8]', iconClass: 'text-[#5B8DB8]' },
  'too-many-tasks': { bgClass: 'bg-cream-dark', iconClass: 'text-text-muted' },
  'unexpected-changes': { bgClass: 'bg-[#E5EEEA]', iconClass: 'text-green-soft' },
  'social-exhaustion': { bgClass: 'bg-lavender-muted', iconClass: 'text-lavender-deep' },
  'sensory-overload': { bgClass: 'bg-sage-light/60', iconClass: 'text-green' },
  burnout: { bgClass: 'bg-[#F8E4E8]', iconClass: 'text-orange' },
}

export const CATEGORY_CARD_STYLES: Record<string, { bgClass: string; iconClass: string }> = {
  focus: { bgClass: 'bg-green-muted', iconClass: 'text-green' },
  energy: { bgClass: 'bg-yellow/45', iconClass: 'text-orange' },
  'executive-function': { bgClass: 'bg-sage-light/70', iconClass: 'text-green-soft' },
  'emotional-regulation': { bgClass: 'bg-[#F8E4E8]', iconClass: 'text-[#C97B8A]' },
  sensory: { bgClass: 'bg-lavender/35', iconClass: 'text-lavender-deep' },
  communication: { bgClass: 'bg-[#E3EEF8]', iconClass: 'text-[#5B8DB8]' },
  workplace: { bgClass: 'bg-cream-dark', iconClass: 'text-text-muted' },
  recovery: { bgClass: 'bg-green-muted/80', iconClass: 'text-green' },
}
