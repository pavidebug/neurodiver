import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { OnboardingGate } from '@/components/auth/onboarding-gate'
import { PublicRoute } from '@/components/auth/public-route'
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
import { InviteFriendPage } from '@/pages/invite-friend-page'
import { OnboardingPage } from '@/pages/onboarding-page'
import { WeeklyInsightsPage } from '@/pages/weekly-insights-page'
import { AdminRoute } from '@/components/AdminRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminPage } from '@/pages/admin-page'
import { AdminUsersPage } from '@/pages/admin-users-page'
import { AdminStrategiesPage } from '@/pages/admin-strategies-page'
import { AdminFeedbackPage } from '@/pages/admin-feedback-page'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WorkEnergyProvider>
          <StrategyProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<PublicRoute />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<LoginPage />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                  <Route path="/onboarding" element={<OnboardingPage />} />

                  <Route element={<AdminRoute />}>
                    <Route element={<AdminLayout />}>
                      <Route path="/admin" element={<AdminPage />} />
                      <Route path="/admin/users" element={<AdminUsersPage />} />
                      <Route path="/admin/strategies" element={<AdminStrategiesPage />} />
                      <Route path="/admin/feedback" element={<AdminFeedbackPage />} />
                    </Route>
                  </Route>

                  <Route element={<OnboardingGate />}>
                    <Route element={<AppLayout />}>
                      <Route path="/home" element={<DashboardPage />} />
                    <Route path="/work-check-in" element={<WorkCheckInPage />} />
                    <Route
                      path="/work-reflection"
                      element={<DailyWorkReflectionPage />}
                    />
                    <Route path="/energy-patterns" element={<EnergyPatternsPage />} />
                    <Route path="/weekly-insights" element={<WeeklyInsightsPage />} />
                    <Route path="/strategies" element={<StrategiesPage />} />
                    <Route path="/body-double" element={<BodyDoublePage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/profile/invite-friend" element={<InviteFriendPage />} />

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

                    <Route path="*" element={<Navigate to="/home" replace />} />
                    </Route>
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
