import { Navigate, Outlet } from 'react-router-dom'
import { AuthLoadingScreen } from '@/components/auth/auth-loading-screen'
import { useAuth } from '@/context/auth-context'
import { isAdminUser } from '@/utils/admin'

export function AdminRoute() {
  const { user, loading } = useAuth()

  if (loading) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!isAdminUser(user)) {
    return <Navigate to="/home" replace />
  }

  return <Outlet />
}
