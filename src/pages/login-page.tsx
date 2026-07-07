import { Navigate } from 'react-router-dom'

/** Legacy route — welcome/sign-in lives at `/` */
export function LoginPage() {
  return <Navigate to="/" replace />
}
