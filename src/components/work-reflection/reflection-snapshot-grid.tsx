import {
  Battery,
  BatteryLow,
  CloudSun,
  HandHeart,
  Headphones,
  Heart,
} from 'lucide-react'
import { ReflectionInsightCard } from '@/components/work-reflection/reflection-insight-card'
import {
  formatDrainLabels,
  formatRefillLabels,
  getDrainingTimeLabel,
  getEaseLabel,
  getEnergyTankLabel,
  getSupportLabel,
} from '@/lib/work-check-in-labels'
import type { WorkCheckIn } from '@/types/work-energy'

function energySupportText(score: number): string {
  if (score <= 2) return "You're running on low."
  if (score === 3) return 'Steady — not full, not empty.'
  return 'You ended with some energy left.'
}

function easeSupportText(score: number): string {
  if (score >= 4) return 'Masking took a lot out of you today.'
  if (score === 3) return 'Some masking — a fairly typical day.'
  return 'You got to be yourself more easily today.'
}

function supportFeltText(score: number): string {
  if (score >= 4) return 'You felt supported today.'
  if (score === 3) return 'Support was there, but not always.'
  return 'Support felt harder to reach today.'
}

function scalePercent(score: number): number {
  return (score / 5) * 100
}

export function ReflectionSnapshotGrid({ checkIn }: { checkIn: WorkCheckIn }) {
  const cards = [
    {
      id: 'energy',
      icon: Battery,
      label: "Today's energy tank",
      value: getEnergyTankLabel(checkIn.energyTank),
      supportText: energySupportText(checkIn.energyTank),
      accentPercent: scalePercent(checkIn.energyTank),
      tintClass: 'bg-yellow/30 text-orange',
      iconTintClass: 'bg-yellow/50 text-orange',
    },
    {
      id: 'ease',
      icon: Heart,
      label: 'Masking effort',
      value: getEaseLabel(checkIn.maskingLoad),
      supportText: easeSupportText(checkIn.maskingLoad),
      accentPercent: scalePercent(6 - checkIn.maskingLoad),
      tintClass: 'bg-orange/10 text-orange',
      iconTintClass: 'bg-orange/15 text-orange',
    },
    {
      id: 'support',
      icon: HandHeart,
      label: 'Support felt',
      value: getSupportLabel(checkIn.supportFelt),
      supportText: supportFeltText(checkIn.supportFelt),
      accentPercent: scalePercent(checkIn.supportFelt),
      tintClass: 'bg-green-muted/80 text-green',
      iconTintClass: 'bg-green-muted text-green',
    },
    {
      id: 'drains',
      icon: BatteryLow,
      label: 'Energy drains',
      value: formatDrainLabels(checkIn.drains, checkIn.drainsOther),
      supportText: 'This is what pulled energy away.',
      accentPercent: 55,
      tintClass: 'bg-cream-dark/80 text-text-muted',
      iconTintClass: 'bg-yellow/40 text-text-muted',
    },
    {
      id: 'refills',
      icon: Headphones,
      label: 'What helped recharge',
      value: formatRefillLabels(checkIn.refills, checkIn.refillsOther),
      supportText: 'Small refills add up.',
      accentPercent: 70,
      tintClass: 'bg-green-muted/50 text-green',
      iconTintClass: 'bg-green-muted/90 text-green',
    },
    {
      id: 'hardest',
      icon: CloudSun,
      label: 'Hardest part of the day',
      value: getDrainingTimeLabel(checkIn.mostDrainingTime),
      supportText: "That's when it hit hardest.",
      accentPercent: 45,
      tintClass: 'bg-yellow/20 text-text-muted',
      iconTintClass: 'bg-yellow/35 text-text-muted',
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {cards.map(({ id, ...card }) => (
        <ReflectionInsightCard key={id} {...card} />
      ))}
    </div>
  )
}
