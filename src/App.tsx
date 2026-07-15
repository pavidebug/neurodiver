import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { OnboardingGate } from '@/components/auth/onboarding-gate'
import { PublicRoute } from '@/components/auth/public-route'
import { AppLayout } from '@/components/layout/app-layout'
import { AuthProvider } from '@/context/auth-context'
import { StrategyProvider } from '@/context/strategy-context'
import { ThemeProvider } from '@/context/theme-context'
import { WorkEnergyProvider } from '@/context/work-energy-context'
import { FeatureConfigProvider } from '@/context/feature-config-context'
import { FeaturePageGate } from '@/components/feature-page-gate'
import { LandingPage } from '@/pages/landing-page'
import { LoginPage } from '@/pages/login-page'
import { DashboardPage } from '@/pages/dashboard-page'
import { WorkCheckInPage } from '@/pages/work-check-in-page'
import { StrategiesPage } from '@/pages/strategies-page'
import { BodyDoublePage } from '@/pages/body-double-page'
import { ProfilePage } from '@/pages/profile-page'
import { InviteFriendPage } from '@/pages/invite-friend-page'
import { OnboardingPage } from '@/pages/onboarding-page'
import { WeeklyReflectionPage } from '@/pages/weekly-reflection-page'
import { TodayReflectionPage } from '@/pages/today-reflection-page'
import { AdminRoute } from '@/components/AdminRoute'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { AdminPage } from '@/pages/admin-page'
import { AdminUsersPage } from '@/pages/admin-users-page'
import { AdminStrategiesPage } from '@/pages/admin-strategies-page'
import { AdminFeedbackPage } from '@/pages/admin-feedback-page'
import { AdminModulesPage } from '@/pages/admin-modules-page'
import { AdminBodyDoublePage } from '@/pages/admin-body-double-page'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FeatureConfigProvider>
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
                      <Route path="/admin/modules" element={<AdminModulesPage />} />
                      <Route path="/admin/body-double" element={<AdminBodyDoublePage />} />
                    </Route>
                  </Route>

                  <Route element={<OnboardingGate />}>
                    <Route element={<AppLayout />}>
                      <Route path="/home" element={<FeaturePageGate page="today"><DashboardPage /></FeaturePageGate>} />
                    <Route path="/work-check-in" element={<WorkCheckInPage />} />
                    <Route path="/today-reflection" element={<TodayReflectionPage />} />
                    <Route
                      path="/work-reflection"
                      element={<Navigate to="/weekly-reflection" replace />}
                    />
                    <Route
                      path="/energy-patterns"
                      element={<Navigate to="/home" replace />}
                    />
                    <Route path="/insights" element={<Navigate to="/home" replace />} />
                    <Route path="/weekly-insights" element={<Navigate to="/home" replace />} />
                    <Route path="/weekly-reflection" element={<WeeklyReflectionPage />} />
                    <Route path="/strategies" element={<FeaturePageGate page="strategies"><StrategiesPage /></FeaturePageGate>} />
                    <Route path="/body-double" element={<FeaturePageGate page="bodyDouble"><BodyDoublePage /></FeaturePageGate>} />
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
                      element={<Navigate to="/home" replace />}
                    />

                    <Route path="*" element={<Navigate to="/home" replace />} />
                    </Route>
                  </Route>
                </Route>
              </Routes>
            </BrowserRouter>
          </StrategyProvider>
        </WorkEnergyProvider>
        </FeatureConfigProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
