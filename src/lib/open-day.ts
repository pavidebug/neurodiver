export const OPEN_DAY_DEFAULT_DECK_VERSION = '1' as const

export const OPEN_DAY_DECK_VERSIONS = ['1', '2', '3'] as const

export type OpenDayDeckVersion = (typeof OPEN_DAY_DECK_VERSIONS)[number]

export function getOpenDayDeckVersion(value: string | null): OpenDayDeckVersion {
  return OPEN_DAY_DECK_VERSIONS.includes(value as OpenDayDeckVersion)
    ? (value as OpenDayDeckVersion)
    : OPEN_DAY_DEFAULT_DECK_VERSION
}

export function getOpenDayStrategyPath(version: OpenDayDeckVersion): string {
  return `/strategies?version=${version}`
}
