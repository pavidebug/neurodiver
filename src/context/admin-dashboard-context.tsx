import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { fetchAdminDashboard } from '@/lib/admin-dashboard'
import type { AdminDashboardData } from '@/types/admin-dashboard'

interface AdminDashboardContextValue {
  data: AdminDashboardData | null
  loading: boolean
  error: string | null
  reload: () => void
}

const AdminDashboardContext = createContext<AdminDashboardContextValue | null>(null)

export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AdminDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const reload = useCallback(() => {
    setReloadKey((key) => key + 1)
  }, [])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const dashboard = await fetchAdminDashboard()
        if (!cancelled) {
          setData(dashboard)
        }
      } catch (caught) {
        if (!cancelled) {
          const detail = caught instanceof Error ? caught.message : 'Unknown data error'
          setError(`Unable to load dashboard data: ${detail}`)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  const value = useMemo(
    () => ({ data, loading, error, reload }),
    [data, loading, error, reload],
  )

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  )
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext)
  if (!context) {
    throw new Error('useAdminDashboard must be used within AdminDashboardProvider')
  }
  return context
}
