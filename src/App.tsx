import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { AppLayout } from '@/components/layout/app-layout'
import { AuthProvider } from '@/context/auth-context'
import { StrategyProvider } from '@/context/strategy-context'
import { ThemeProvider } from '@/context/theme-context'
import { WorkEnergyProvider } from '@/context/work-energy-context'
import { LandingPage } from '@/pages/landing-page'
import { LoginPage } from '@/pages/login-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { EnergyPatternsPage } from '@/pages/energy-patterns-page'
import { DailyWorkReflectionPage } from '@/pages/daily-work-reflection-page'
import { WorkCheckInPage } from '@/pages/work-check-in-page'
import { StrategiesPage } from '@/pages/strategies-page'
import { BodyDoublePage } from '@/pages/body-double-page'
import { ProfilePage } from '@/pages/profile-page'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkEnergyProvider>
          <StrategyProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />

                <Route element={<ProtectedRoute />}>
                  <Route element={<AppLayout />}>
                    <Route path="/home" element={<DashboardPage />} />
                    <Route path="/work-check-in" element={<WorkCheckInPage />} />
                    <Route
                      path="/work-reflection"
                      element={<DailyWorkReflectionPage />}
                    />
                    <Route path="/energy-patterns" element={<EnergyPatternsPage />} />
                    <Route path="/strategies" element={<StrategiesPage />} />
                    <Route path="/body-double" element={<BodyDoublePage />} />
                    <Route path="/profile" element={<ProfilePage />} />

                    {/* Pilot: personal check-in hidden */}
                    <Route
                      path="/check-in"
                      element={<Navigate to="/work-check-in" replace />}
                    />
                    <Route
                      path="/reflection"
                      element={<Navigate to="/home" replace />}
                    />
                    <Route
                      path="/brain-status"
                      element={<Navigate to="/home" replace />}
                    />
                    <Route
                      path="/energy"
                      element={<Navigate to="/energy-patterns" replace />}
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </StrategyProvider>
        </WorkEnergyProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
