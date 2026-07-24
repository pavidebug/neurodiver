import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/app-layout'
import { StrategyProvider } from '@/context/strategy-context'
import { ThemeProvider } from '@/context/theme-context'
import { StrategiesPage } from '@/pages/strategies-page'
import { OPEN_DAY_STRATEGIES_ALL } from '@/data/open-day-strategies'

export default function App() {
  return (
    <ThemeProvider>
      <StrategyProvider catalog={OPEN_DAY_STRATEGIES_ALL}>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/strategies" element={<StrategiesPage />} />
              <Route
                path="*"
                element={<Navigate to="/strategies?version=1" replace />}
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </StrategyProvider>
    </ThemeProvider>
  )
}
