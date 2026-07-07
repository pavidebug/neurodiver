import {
  DESCRIBE_DRAFT_STORAGE_KEY,
  type DescribeDraft,
  type DescribeTopic,
} from '@/data/describe-it'

export function loadDescribeDraft(): DescribeDraft | null {
  try {
    const raw = localStorage.getItem(DESCRIBE_DRAFT_STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as DescribeDraft
    if (typeof parsed.description !== 'string') return null

    return parsed
  } catch {
    return null
  }
}

export function saveDescribeDraft(
  description: string,
  optionalTopic: DescribeTopic | null,
): void {
  const draft: DescribeDraft = {
    description,
    optionalTopic,
    savedAt: new Date().toISOString(),
  }

  localStorage.setItem(DESCRIBE_DRAFT_STORAGE_KEY, JSON.stringify(draft))
}

export function clearDescribeDraft(): void {
  localStorage.removeItem(DESCRIBE_DRAFT_STORAGE_KEY)
}
