import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { useAuth } from './auth/context'
import { ToastProvider } from './components/Toast'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Claims from './pages/Claims'
import ClaimDetail from './pages/ClaimDetail'
import Coverage from './pages/Coverage'
import IdCards from './pages/IdCards'
import FindCare from './pages/FindCare'
import Pharmacy from './pages/Pharmacy'
import NotFound from './pages/NotFound'
import type { ReactNode } from 'react'

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function LoginRoute() {
  const { isAuthenticated } = useAuth()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <Login />
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
              <Route path="/claims" element={<RequireAuth><Claims /></RequireAuth>} />
              <Route path="/claims/:id" element={<RequireAuth><ClaimDetail /></RequireAuth>} />
              <Route path="/coverage" element={<RequireAuth><Coverage /></RequireAuth>} />
              <Route path="/id-cards" element={<RequireAuth><IdCards /></RequireAuth>} />
              <Route path="/find-care" element={<RequireAuth><FindCare /></RequireAuth>} />
              <Route path="/pharmacy" element={<RequireAuth><Pharmacy /></RequireAuth>} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
