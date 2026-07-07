import {
  formatAccommodationLabels,
  formatDrainLabels,
  formatRefillLabels,
  getDrainingTimeLabel,
  getEaseLabel,
  getEnergySummary,
  getEnergyTankLabel,
  getSupportLabel,
  getWouldUseAgainLabel,
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
        label: 'Masking effort',
        value: getEaseLabel(checkIn.maskingLoad),
      },
      {
        label: 'Support felt',
        value: getSupportLabel(checkIn.supportFelt),
      },
      {
        label: 'Energy drains',
        value: formatDrainLabels(checkIn.drains, checkIn.drainsOther),
      },
      {
        label: 'What helped recharge',
        value: formatRefillLabels(checkIn.refills, checkIn.refillsOther),
      },
      {
        label: 'Hardest part of the day',
        value: getDrainingTimeLabel(checkIn.mostDrainingTime),
      },
      {
        label: 'Support that would help',
        value: formatAccommodationLabels(
          checkIn.accommodationNeeds,
          checkIn.accommodationNeedsOther,
        ),
      },
      {
        label: 'Would check in again',
        value: getWouldUseAgainLabel(checkIn.wouldUseAgain),
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

  if (checkIn.drains.includes('too-many-meetings')) {
    return 'Meetings appeared to take a lot of your energy today.'
  }

  if (checkIn.refills.includes('quiet-time')) {
    return 'Quiet time seemed to help you recharge.'
  }

  if (checkIn.drains.includes('too-many-interruptions')) {
    return 'Interruptions may have made it harder to settle into your work today.'
  }

  if (checkIn.refills.includes('breaks')) {
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
  if (checkIn.drains.includes('too-many-meetings')) {
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

  if (checkIn.drains.includes('too-many-interruptions')) {
    return 'Tomorrow, notice whether one protected focus block changes how the day feels.'
  }

  if (checkIn.refills.includes('movement')) {
    return 'Try a short walk or stretch tomorrow and notice if your afternoon feels different.'
  }

  if (checkIn.mostDrainingTime === 'end-of-day') {
    return 'Tomorrow, try a small wind-down ritual before you finish for the day.'
  }

  return 'Pick one small thing that helped today and see if you can make room for it again tomorrow.'
}
