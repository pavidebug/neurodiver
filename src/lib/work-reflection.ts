import {
  getDrainLabel,
  getDrainingTimeLabel,
  getEaseLabel,
  getEnergySummary,
  getEnergyTankLabel,
  getRefillLabel,
  getSupportLabel,
} from '@/lib/work-check-in-labels'
import type { WorkCheckIn } from '@/types/work-energy'

export interface WorkReflectionSnapshotItem {
  label: string
  value: string
}

export interface WorkReflectionContent {
  energySummary: string
  insight: string
  experiment: string
  snapshot: WorkReflectionSnapshotItem[]
}

export function buildWorkReflection(checkIn: WorkCheckIn): WorkReflectionContent {
  return {
    energySummary: getEnergySummary(checkIn.energyTank),
    insight: buildInsight(checkIn),
    experiment: buildExperiment(checkIn),
    snapshot: [
      {
        label: "Today's energy tank",
        value: getEnergyTankLabel(checkIn.energyTank),
      },
      {
        label: 'Easy to be yourself',
        value: getEaseLabel(checkIn.maskingLoad),
      },
      {
        label: 'Support felt',
        value: getSupportLabel(checkIn.supportFelt),
      },
      {
        label: 'Biggest drain',
        value: getDrainLabel(checkIn.biggestDrain, checkIn.biggestDrainOther),
      },
      {
        label: 'Biggest refill',
        value: getRefillLabel(checkIn.biggestRefill, checkIn.biggestRefillOther),
      },
      {
        label: 'Hardest part of the day',
        value: getDrainingTimeLabel(checkIn.mostDrainingTime),
      },
    ],
  }
}

function buildInsight(checkIn: WorkCheckIn): string {
  const energyLow = checkIn.energyTank <= 2
  const easeDifficult = checkIn.maskingLoad >= 4

  if (energyLow && easeDifficult) {
    return 'Today may have taken more energy than it looked like from the outside.'
  }

  if (checkIn.supportFelt >= 4) {
    return 'Support seemed to make today a little easier.'
  }

  if (checkIn.biggestDrain === 'too-many-meetings') {
    return 'Meetings appeared to take a lot of your energy today.'
  }

  if (checkIn.biggestRefill === 'quiet-time') {
    return 'Quiet time seemed to help you recharge.'
  }

  if (checkIn.biggestDrain === 'too-many-interruptions') {
    return 'Interruptions may have made it harder to settle into your work today.'
  }

  if (checkIn.biggestRefill === 'breaks') {
    return 'Taking breaks seemed to give you a little room to breathe today.'
  }

  if (checkIn.mostDrainingTime === 'after-work') {
    return 'Work may have stayed with you after you logged off today.'
  }

  if (checkIn.energyTank >= 4) {
    return 'You seemed to finish the day with a bit of energy still in the tank.'
  }

  return 'Noticing what drained and what helped is a gentle way to understand your work days.'
}

function buildExperiment(checkIn: WorkCheckIn): string {
  if (checkIn.biggestDrain === 'too-many-meetings') {
    return 'Tomorrow, try protecting one quiet break after your busiest meeting.'
  }

  if (
    checkIn.mostDrainingTime === 'morning' ||
    checkIn.mostDrainingTime === 'midday'
  ) {
    return 'Notice whether your energy feels different before lunch tomorrow.'
  }

  if (
    checkIn.ableToAskNeeds === 'no' ||
    checkIn.ableToAskNeeds === 'not-really'
  ) {
    return 'See if asking for help a little earlier changes your afternoon.'
  }

  if (checkIn.biggestDrain === 'too-many-interruptions') {
    return 'Tomorrow, notice whether one protected focus block changes how the day feels.'
  }

  if (checkIn.biggestRefill === 'movement') {
    return 'Try a short walk or stretch tomorrow and notice if your afternoon feels different.'
  }

  if (checkIn.mostDrainingTime === 'end-of-day') {
    return 'Tomorrow, try a small wind-down ritual before you finish for the day.'
  }

  return 'Pick one small thing that helped today and see if you can make room for it again tomorrow.'
}
