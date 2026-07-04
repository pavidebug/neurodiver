export function getTodayString(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/** Monday-start week boundaries in local time */
export function getWeekStart(date = new Date()): Date {
  const cursor = new Date(date)
  cursor.setHours(12, 0, 0, 0)

  const day = cursor.getDay()
  const diff = day === 0 ? -6 : 1 - day
  cursor.setDate(cursor.getDate() + diff)

  return cursor
}

export function getWeekEnd(weekStart: Date): Date {
  const end = new Date(weekStart)
  end.setDate(end.getDate() + 6)
  return end
}

/** ISO week id for Monday-start weeks, e.g. 2026-W27 */
export function getWeekId(date = new Date()): string {
  const weekStart = getWeekStart(date)
  const year = weekStart.getFullYear()
  const firstMonday = getWeekStart(new Date(year, 0, 4))
  const diffDays = Math.floor(
    (weekStart.getTime() - firstMonday.getTime()) / 86_400_000,
  )
  const weekNumber = Math.floor(diffDays / 7) + 1
  return `${year}-W${String(weekNumber).padStart(2, '0')}`
}

/** Month id, e.g. 2026-07 */
export function getMonthId(date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}`
}

export function formatDisplayDate(dateStr: string): string {
  return new Date(`${dateStr}T12:00:00`).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}
