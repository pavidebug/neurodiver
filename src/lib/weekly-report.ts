import {
  doc,
  getDoc,
  getDocs,
  collection,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
} from 'firebase/firestore'
import {
  formatDisplayDate,
  getTodayString,
  getWeekEnd,
  getWeekId,
  getWeekStart,
} from '@/lib/dates'
import { db } from '@/lib/firebase'
import {
  ACCOMMODATION_LABELS,
  DRAIN_LABELS,
  REFILL_LABELS,
} from '@/lib/work-check-in-labels'
import { getCheckInsForDateRange } from '@/lib/work-check-ins'
import type {
  UserWorkProfile,
  WeeklyReport,
  WeeklyReportDocument,
  WeeklyReportRankedOption,
  WeeklyReportStatusLabel,
  WorkCheckIn,
} from '@/types/work-energy'
import { WEEKLY_REPORT_MIN_CHECK_INS } from '@/types/work-energy'

export { WEEKLY_REPORT_MIN_CHECK_INS }

function getWeeklyReportRef(userId: string, weekId: string) {
  return doc(db, 'users', userId, 'weeklyReports', weekId)
}

function getWeeklyReportsCollection(userId: string) {
  return collection(db, 'users', userId, 'weeklyReports')
}

function average(values: number[]): number {
  if (values.length === 0) return 0
  return values.reduce((sum, value) => sum + value, 0) / values.length
}

function roundOneDecimal(value: number): number {
  return Math.round(value * 10) / 10
}

function countOptions<T extends string>(
  checkIns: WorkCheckIn[],
  getValues: (checkIn: WorkCheckIn) => T[],
  labels: Record<T, string>,
): WeeklyReportRankedOption[] {
  const counts = new Map<string, { option: string; label: string; count: number }>()

  for (const checkIn of checkIns) {
    for (const option of getValues(checkIn)) {
      const label = labels[option as T] ?? option
      const existing = counts.get(option)
      if (existing) {
        existing.count += 1
      } else {
        counts.set(option, { option, label, count: 1 })
      }
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
}

function buildSourceFingerprint(checkIns: WorkCheckIn[]): string {
  return checkIns
    .map((checkIn) => `${checkIn.date}:${checkIn.checkInTime}`)
    .sort()
    .join('|')
}

function resolveStatusLabel(
  avgEnergy: number,
  avgMasking: number,
  avgSupport: number,
): WeeklyReportStatusLabel {
  if (avgEnergy <= 2.5 || avgMasking >= 4 || avgSupport <= 2) {
    return 'Needs support'
  }

  if (avgEnergy >= 3.5 && avgMasking <= 3 && avgSupport >= 3.5) {
    return 'Stable'
  }

  return 'Watch closely'
}

function buildEnergyCurve(
  weekStart: Date,
  checkIns: WorkCheckIn[],
): WeeklyReportDocument['energyCurve'] {
  const byDate = new Map(checkIns.map((checkIn) => [checkIn.date, checkIn]))
  const points: WeeklyReportDocument['energyCurve'] = []

  for (let offset = 0; offset < 7; offset += 1) {
    const day = new Date(weekStart)
    day.setDate(day.getDate() + offset)
    const date = getTodayString(day)
    const checkIn = byDate.get(date)

    points.push({
      date,
      energyTank: checkIn?.energyTank ?? null,
      maskingLoad: checkIn?.maskingLoad ?? null,
    })
  }

  return points
}

function buildInsights(checkIns: WorkCheckIn[]): WeeklyReportDocument['insights'] {
  const lowestEnergy = [...checkIns].sort(
    (a, b) => a.energyTank - b.energyTank,
  )[0]
  const highestMasking = [...checkIns].sort(
    (a, b) => b.maskingLoad - a.maskingLoad,
  )[0]
  const bestRecovery = [...checkIns].sort(
    (a, b) => b.energyTank - a.energyTank,
  )[0]

  const avgEnergy = average(checkIns.map((entry) => entry.energyTank))
  const avgMasking = average(checkIns.map((entry) => entry.maskingLoad))
  const avgSupport = average(checkIns.map((entry) => entry.supportFelt))

  let relationshipNote =
    'Your energy, masking, and support levels moved independently this week — that is normal.'

  if (avgMasking >= 4 && avgEnergy <= 3) {
    relationshipNote =
      'On days when masking felt harder, your energy tank tended to run lower — extra recovery time may help.'
  } else if (avgSupport >= 4 && avgEnergy >= 3.5) {
    relationshipNote =
      'When support felt stronger, your energy held up better — small accommodations may be making a difference.'
  } else if (avgMasking >= 3.5 && avgSupport <= 2.5) {
    relationshipNote =
      'Masking felt heavy while support felt low — asking for one small accommodation could ease the load.'
  }

  const summaryParts: string[] = []

  if (lowestEnergy) {
    summaryParts.push(
      `Your lowest energy day was ${formatDisplayDate(lowestEnergy.date)}.`,
    )
  }

  if (highestMasking) {
    summaryParts.push(
      `Masking felt hardest on ${formatDisplayDate(highestMasking.date)}.`,
    )
  }

  if (bestRecovery && bestRecovery.date !== lowestEnergy?.date) {
    summaryParts.push(
      `Your best recovery day was ${formatDisplayDate(bestRecovery.date)}.`,
    )
  }

  summaryParts.push(relationshipNote)

  return {
    summary: summaryParts.join(' '),
    lowestEnergyDay: lowestEnergy?.date ?? null,
    highestMaskingDay: highestMasking?.date ?? null,
    bestRecoveryDay: bestRecovery?.date ?? null,
    relationshipNote,
  }
}

function buildMaskingSummary(checkIns: WorkCheckIn[]): string {
  const avgMasking = average(checkIns.map((entry) => entry.maskingLoad))

  if (avgMasking >= 4) {
    return 'Masking took a lot of effort most days this week. That kind of sustained effort is real work — not a personal failing.'
  }

  if (avgMasking >= 3) {
    return 'Masking varied this week — some days felt easier to be yourself than others. Noticing the difference is useful data.'
  }

  return 'Being yourself at work felt relatively manageable this week. That is worth acknowledging.'
}

function buildAccommodationSummary(checkIns: WorkCheckIn[]): string {
  const topNeeds = countOptions(
    checkIns,
    (checkIn) => checkIn.accommodationNeeds,
    ACCOMMODATION_LABELS,
  )

  if (topNeeds.length === 0) {
    return 'You did not flag specific accommodations this week — that does not mean support was not needed.'
  }

  const labels = topNeeds.map((entry) => entry.label.toLowerCase()).join(', ')
  return `The support that came up most often: ${labels}. These are practical starting points for conversations — not demands.`
}

function buildRecommendation(
  topDrains: WeeklyReportRankedOption[],
  topRefills: WeeklyReportRankedOption[],
  checkIns: WorkCheckIn[],
): string {
  const avgMasking = average(checkIns.map((entry) => entry.maskingLoad))

  if (topDrains[0]?.option === 'too-many-meetings') {
    return 'Try protecting one meeting-free block next week — even 30 minutes can change how the day feels.'
  }

  if (topDrains[0]?.option === 'too-many-interruptions') {
    return 'Pick one hour next week for focused work and let one person know you are unavailable then.'
  }

  if (topRefills[0]?.option === 'quiet-time') {
    return 'Schedule a short quiet break on your calendar next week — treat it like any other important appointment.'
  }

  if (topRefills[0]?.option === 'breaks') {
    return 'Build in one small break at the same time each day next week and notice whether your afternoon shifts.'
  }

  if (avgMasking >= 4) {
    return 'Choose one moment next week to drop the mask slightly — a trusted colleague, a quieter space, or a written note instead of a meeting.'
  }

  return 'Pick one refill that helped this week and make a gentle plan to repeat it at least twice next week.'
}

function buildNoteForWeek(statusLabel: WeeklyReportStatusLabel): string {
  if (statusLabel === 'Needs support') {
    return 'This week asked a lot of you. You do not need to push through on willpower alone — small adjustments and rest count as progress.'
  }

  if (statusLabel === 'Watch closely') {
    return 'Your week had ups and downs — that is human. Keep noticing what drains you and what refills you, without grading yourself.'
  }

  return 'You showed up for yourself this week. Keep building on what worked, and give yourself room on the harder days.'
}

function mapWeeklyReport(id: string, data: Record<string, unknown>): WeeklyReport {
  return {
    id,
    weekId: String(data.weekId ?? id),
    weekStart: String(data.weekStart ?? ''),
    weekEnd: String(data.weekEnd ?? ''),
    weekNumber: Number(data.weekNumber ?? 1),
    generatedAt: data.generatedAt as Timestamp,
    sourceFingerprint: String(data.sourceFingerprint ?? ''),
    checkInCount: Number(data.checkInCount ?? 0),
    profile: data.profile as WeeklyReportDocument['profile'],
    averages: data.averages as WeeklyReportDocument['averages'],
    energyCurve: data.energyCurve as WeeklyReportDocument['energyCurve'],
    insights: data.insights as WeeklyReportDocument['insights'],
    topDrains: data.topDrains as WeeklyReportDocument['topDrains'],
    topRefills: data.topRefills as WeeklyReportDocument['topRefills'],
    maskingSummary: String(data.maskingSummary ?? ''),
    accommodationSummary: String(data.accommodationSummary ?? ''),
    recommendation: String(data.recommendation ?? ''),
    noteForWeek: String(data.noteForWeek ?? ''),
  }
}

async function getNextWeekNumber(userId: string): Promise<number> {
  const snapshot = await getDocs(getWeeklyReportsCollection(userId))
  return snapshot.size + 1
}

export interface GenerateWeeklyReportOptions {
  force?: boolean
  checkIns: WorkCheckIn[]
  profile: UserWorkProfile
  displayName?: string | null
  email?: string | null
}

/**
 * Fetch check-ins for the week, calculate patterns, and cache the report in Firestore.
 * Skips regeneration when the source fingerprint is unchanged unless `force` is true.
 */
export async function generateWeeklyReport(
  userId: string,
  weekStartDate: Date | string = getWeekStart(),
  options: GenerateWeeklyReportOptions,
): Promise<WeeklyReport | null> {
  const weekStart =
    typeof weekStartDate === 'string'
      ? new Date(`${weekStartDate}T12:00:00`)
      : weekStartDate
  const weekEnd = getWeekEnd(weekStart)
  const weekId = getWeekId(weekStart)
  const weekStartStr = getTodayString(weekStart)
  const weekEndStr = getTodayString(weekEnd)

  const weekCheckIns = getCheckInsForDateRange(
    options.checkIns,
    weekStartStr,
    weekEndStr,
  )

  if (weekCheckIns.length < WEEKLY_REPORT_MIN_CHECK_INS) {
    return null
  }

  const sourceFingerprint = buildSourceFingerprint(weekCheckIns)
  const reportRef = getWeeklyReportRef(userId, weekId)
  const existingSnapshot = await getDoc(reportRef)

  if (!options.force && existingSnapshot.exists()) {
    const existing = mapWeeklyReport(
      existingSnapshot.id,
      existingSnapshot.data() as Record<string, unknown>,
    )
    if (existing.sourceFingerprint === sourceFingerprint) {
      return existing
    }
  }

  const avgEnergy = roundOneDecimal(
    average(weekCheckIns.map((entry) => entry.energyTank)),
  )
  const avgMasking = roundOneDecimal(
    average(weekCheckIns.map((entry) => entry.maskingLoad)),
  )
  const avgSupport = roundOneDecimal(
    average(weekCheckIns.map((entry) => entry.supportFelt)),
  )
  const avgWouldUseAgain = roundOneDecimal(
    average(weekCheckIns.map((entry) => entry.wouldUseAgain)),
  )

  const statusLabel = resolveStatusLabel(avgEnergy, avgMasking, avgSupport)
  const topDrains = countOptions(
    weekCheckIns,
    (checkIn) => checkIn.drains,
    DRAIN_LABELS,
  )
  const topRefills = countOptions(
    weekCheckIns,
    (checkIn) => checkIn.refills,
    REFILL_LABELS,
  )

  const weekNumber = existingSnapshot.exists()
    ? Number(existingSnapshot.data()?.weekNumber ?? 1)
    : await getNextWeekNumber(userId)

  const reportPayload: Omit<WeeklyReportDocument, 'generatedAt'> & {
    generatedAt: ReturnType<typeof serverTimestamp>
  } = {
    weekId,
    weekStart: weekStartStr,
    weekEnd: weekEndStr,
    weekNumber,
    generatedAt: serverTimestamp(),
    sourceFingerprint,
    checkInCount: weekCheckIns.length,
    profile: {
      displayName: options.displayName ?? null,
      selfDescription: options.profile.selfDescription,
      email: options.email ?? options.profile.email,
      daysCompleted: weekCheckIns.length,
      statusLabel,
    },
    averages: {
      energyTank: avgEnergy,
      maskingLoad: avgMasking,
      supportFelt: avgSupport,
      wouldUseAgain: avgWouldUseAgain,
    },
    energyCurve: buildEnergyCurve(weekStart, weekCheckIns),
    insights: buildInsights(weekCheckIns),
    topDrains,
    topRefills,
    maskingSummary: buildMaskingSummary(weekCheckIns),
    accommodationSummary: buildAccommodationSummary(weekCheckIns),
    recommendation: buildRecommendation(topDrains, topRefills, weekCheckIns),
    noteForWeek: buildNoteForWeek(statusLabel),
  }

  await setDoc(reportRef, reportPayload)

  return {
    id: weekId,
    ...reportPayload,
    generatedAt: Timestamp.now(),
  } as WeeklyReport
}

export async function fetchWeeklyReport(
  userId: string,
  weekId: string,
): Promise<WeeklyReport | null> {
  const snapshot = await getDoc(getWeeklyReportRef(userId, weekId))
  if (!snapshot.exists()) return null

  return mapWeeklyReport(snapshot.id, snapshot.data() as Record<string, unknown>)
}

export async function fetchLatestWeeklyReport(
  userId: string,
): Promise<WeeklyReport | null> {
  const reportsQuery = query(
    getWeeklyReportsCollection(userId),
    orderBy('generatedAt', 'desc'),
  )
  const snapshot = await getDocs(reportsQuery)
  const first = snapshot.docs[0]
  if (!first) return null

  return mapWeeklyReport(first.id, first.data() as Record<string, unknown>)
}

export function countWeekCheckIns(
  checkIns: WorkCheckIn[],
  weekStartDate: Date = getWeekStart(),
): number {
  const weekEnd = getWeekEnd(weekStartDate)
  return getCheckInsForDateRange(
    checkIns,
    getTodayString(weekStartDate),
    getTodayString(weekEnd),
  ).length
}
