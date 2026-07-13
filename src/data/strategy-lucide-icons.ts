import {
  BatteryLow,
  Brain,
  Briefcase,
  Clock,
  Ear,
  Flame,
  Heart,
  Kanban,
  Layers,
  Leaf,
  ListTodo,
  MessageCircle,
  Shuffle,
  Target,
  Users,
  Volume2,
  VenetianMask,
  Zap,
  type LucideIcon,
} from 'lucide-react'

export const SITUATION_LUCIDE_ICONS: Record<string, LucideIcon> = {
  'starting-task': ListTodo,
  overwhelmed: Layers,
  masking: VenetianMask,
  'low-energy': BatteryLow,
  distractions: Volume2,
  'racing-thoughts': Brain,
  'time-blindness': Clock,
  'too-many-tasks': Kanban,
  'unexpected-changes': Shuffle,
  'social-exhaustion': Users,
  'sensory-overload': Ear,
  burnout: Flame,
}

export const CATEGORY_LUCIDE_ICONS: Record<string, LucideIcon> = {
  focus: Target,
  energy: Zap,
  'executive-function': Kanban,
  'emotional-regulation': Heart,
  sensory: Ear,
  communication: MessageCircle,
  workplace: Briefcase,
  recovery: Leaf,
}

/** Body Double upcoming session card icons */
export const SESSION_CARD_LUCIDE_ICONS: LucideIcon[] = [Clock, Zap, Target]
