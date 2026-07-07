import { Navigate, Outlet } from 'react-router-dom'
import { AuthLoadingScreen } from '@/components/auth/auth-loading-screen'
import { useAuth } from '@/context/auth-context'

/** Routes only for signed-out users (landing, login). Signed-in users go to the dashboard. */
export function PublicRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (user) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
