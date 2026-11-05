import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, expect, it, beforeEach } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../auth/AuthContext'
import { ToastProvider } from '../components/Toast'
import Login from '../pages/Login'
import Claims from '../pages/Claims'
import FindCare from '../pages/FindCare'
import Dashboard from '../pages/Dashboard'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/context'

function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <>{children}</>
}

function renderApp(initialPath = '/login') {
  return render(
    <AuthProvider>
      <ToastProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
            <Route path="/claims" element={<RequireAuth><Claims /></RequireAuth>} />
            <Route path="/find-care" element={<RequireAuth><FindCare /></RequireAuth>} />
          </Routes>
        </MemoryRouter>
      </ToastProvider>
    </AuthProvider>,
  )
}

describe('Login', () => {
  beforeEach(() => localStorage.clear())

  it('shows an error when submitting empty credentials', () => {
    renderApp('/login')
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: ' ' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: ' ' } })
    fireEvent.click(screen.getByRole('button', { name: /^log in$/i }))
    expect(screen.getByRole('alert')).toHaveTextContent(/enter both a username and password/i)
  })

  it('valid submit lands on the dashboard', async () => {
    renderApp('/login')
    fireEvent.click(screen.getByRole('button', { name: /^log in$/i }))
    await waitFor(() =>
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/good (morning|afternoon|evening)/i),
    )
  })

  it('visiting /claims signed out redirects to login', async () => {
    renderApp('/claims')
    await waitFor(() =>
      expect(screen.getByRole('heading', { name: /welcome to mycigna/i })).toBeInTheDocument(),
    )
  })
})

describe('Claims', () => {
  beforeEach(() => localStorage.setItem('cigna-demo-authenticated', 'true'))

  it('filtering by status Denied shows only denied rows', () => {
    renderApp('/claims')
    fireEvent.change(screen.getByLabelText(/^status$/i), { target: { value: 'Denied' } })
    expect(screen.getAllByText('Denied', { selector: 'span' })).toHaveLength(2)
    expect(screen.queryByText('Pending', { selector: 'span' })).not.toBeInTheDocument()
    expect(screen.getByText('Example Dermatology Center')).toBeInTheDocument()
    expect(screen.queryByText('Sample Urgent Care')).not.toBeInTheDocument()
  })

  it('search with no match shows empty state', () => {
    renderApp('/claims')
    fireEvent.change(screen.getByLabelText(/^search$/i), { target: { value: 'zzzznotfound' } })
    expect(screen.getByText(/no claims match your filters/i)).toBeInTheDocument()
  })
})

describe('Find care', () => {
  beforeEach(() => localStorage.setItem('cigna-demo-authenticated', 'true'))

  it('in-network only toggle hides out-of-network providers', () => {
    renderApp('/find-care')
    expect(screen.getByText('Example Dermatology Center')).toBeInTheDocument()
    fireEvent.click(screen.getByLabelText(/in-network only/i))
    expect(screen.queryByText('Example Dermatology Center')).not.toBeInTheDocument()
    expect(screen.getByText('Dr. Sample Provider')).toBeInTheDocument()
  })
})
