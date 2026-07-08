import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AdminTableColumn<T> {
  key: string
  header: string
  cell: (row: T) => ReactNode
  className?: string
}

interface AdminDataTableProps<T> {
  columns: AdminTableColumn<T>[]
  rows: T[]
  emptyMessage: string
  loading?: boolean
  getRowKey: (row: T) => string
}

export function AdminDataTable<T>({
  columns,
  rows,
  emptyMessage,
  loading = false,
  getRowKey,
}: AdminDataTableProps<T>) {
  if (loading) {
    return <p className="text-sm text-text-muted">Loading…</p>
  }

  if (rows.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-surface/60 px-6 py-10 text-center text-sm text-text-muted">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto rounded-3xl border border-border bg-surface">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-cream/60 text-text-muted">
            {columns.map((column) => (
              <th key={column.key} className={cn('px-4 py-3 font-medium', column.className)}>
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={getRowKey(row)}
              className="border-b border-border/70 last:border-0 hover:bg-cream/40"
            >
              {columns.map((column) => (
                <td key={column.key} className={cn('px-4 py-3 text-text', column.className)}>
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
