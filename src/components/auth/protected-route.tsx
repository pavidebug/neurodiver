import { Navigate, Outlet } from 'react-router-dom'
import { AuthLoadingScreen } from '@/components/auth/auth-loading-screen'
import { useAuth } from '@/context/auth-context'

export function ProtectedRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
