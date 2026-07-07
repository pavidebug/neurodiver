import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore'
import type { BrainStatusType } from '@/lib/data'
import { db } from '@/lib/firebase'
import type { WorkCheckIn } from '@/types/work-energy'

const SEARCH_ANALYTICS_COLLECTION = 'searchAnalytics'
const STRATEGY_REQUESTS_COLLECTION = 'strategyRequests'
const FREE_TEXT_REQUESTS_COLLECTION = 'freeTextRequests'

export interface SearchAnalyticsInput {
  userId: string
  searchTerm: string
  resultsFound: number
  selectedStrategy: string | null
  brainStatus: BrainStatusType | null
}

export interface StrategyRequestInput {
  userId: string
  description: string
  searchTerm: string | null
  brainStatus: BrainStatusType | null
}

export interface FreeTextRequestInput {
  userId: string
  description: string
  optionalTopic: string | null
  searchResultsFound: number
  matchedStrategyIds: string[]
  notifyWhenAvailable: boolean
  brainStatus: BrainStatusType | null
}

/** Map today's work check-in energy to a brain status label when available. */
export function getBrainStatusFromWorkCheckIn(
  checkIn: WorkCheckIn | null | undefined,
): BrainStatusType | null {
  if (!checkIn) return null

  if (checkIn.energyTank >= 5) return 'high-energy'
  if (checkIn.energyTank >= 4) return 'steady'
  if (checkIn.energyTank >= 3) return 'steady'
  if (checkIn.energyTank >= 2) return 'running-low'
  return 'recovery-needed'
}

export async function logStrategySearch(
  input: SearchAnalyticsInput,
): Promise<void> {
  await addDoc(collection(db, SEARCH_ANALYTICS_COLLECTION), {
    userId: input.userId,
    searchTerm: input.searchTerm.trim(),
    resultsFound: input.resultsFound,
    selectedStrategy: input.selectedStrategy,
    brainStatus: input.brainStatus,
    timestamp: serverTimestamp(),
  })
}

export async function submitStrategyRequest(
  input: StrategyRequestInput,
): Promise<void> {
  await addDoc(collection(db, STRATEGY_REQUESTS_COLLECTION), {
    userId: input.userId,
    description: input.description.trim(),
    searchTerm: input.searchTerm,
    brainStatus: input.brainStatus,
    status: 'Open',
    timestamp: serverTimestamp(),
  })
}

export async function submitFreeTextRequest(
  input: FreeTextRequestInput,
): Promise<string> {
  const ref = await addDoc(collection(db, FREE_TEXT_REQUESTS_COLLECTION), {
    userId: input.userId,
    description: input.description.trim(),
    optionalTopic: input.optionalTopic,
    searchResultsFound: input.searchResultsFound,
    matchedStrategyIds: input.matchedStrategyIds,
    notifyWhenAvailable: input.notifyWhenAvailable,
    brainStatus: input.brainStatus,
    status: 'Pending',
    timestamp: serverTimestamp(),
  })

  return ref.id
}

export async function updateFreeTextRequestNotify(
  requestId: string,
  notifyWhenAvailable: boolean,
): Promise<void> {
  await updateDoc(doc(db, FREE_TEXT_REQUESTS_COLLECTION, requestId), {
    notifyWhenAvailable,
  })
}

export type { Timestamp }
