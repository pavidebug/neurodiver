import type { WorkCheckInDraftAnswers } from '@/types/work-energy'

const DRAFT_KEY = 'neurodiver-work-check-in-draft'

interface StoredDraft {
  date: string
  step: number
  answers: WorkCheckInDraftAnswers
}

export function readWorkCheckInDraft(date: string): StoredDraft | null {
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY)
    if (!raw) return null

    const draft = JSON.parse(raw) as StoredDraft
    if (draft.date !== date) return null

    return draft
  } catch {
    return null
  }
}

export function saveWorkCheckInDraft(
  date: string,
  step: number,
  answers: WorkCheckInDraftAnswers,
) {
  const payload: StoredDraft = { date, step, answers }
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
}

export function clearWorkCheckInDraft() {
  sessionStorage.removeItem(DRAFT_KEY)
}
