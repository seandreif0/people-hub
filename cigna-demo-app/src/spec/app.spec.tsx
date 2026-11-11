import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
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

  describe('feature tiles without IntersectionObserver', () => {
    const original = globalThis.IntersectionObserver

    beforeEach(() => {
      Reflect.deleteProperty(globalThis, 'IntersectionObserver')
    })

    afterEach(() => {
      if (original) globalThis.IntersectionObserver = original
    })

    it('renders all four tiles visible', () => {
      renderApp('/login')
      for (const title of ['Track claims', 'Find care', 'Manage Rx', 'View ID cards']) {
        const heading = screen.getByRole('heading', { level: 3, name: title })
        expect(heading).toBeVisible()
        expect(heading.closest('li')).not.toHaveClass('opacity-0')
      }
    })
  })

  it('reveals feature tiles only once the section reaches the 30% threshold', () => {
    let notify: IntersectionObserverCallback = () => {}
    class MockObserver {
      constructor(cb: IntersectionObserverCallback) { notify = cb }
      observe() {}
      disconnect() {}
    }
    const original = globalThis.IntersectionObserver
    globalThis.IntersectionObserver = MockObserver as unknown as typeof IntersectionObserver
    try {
      renderApp('/login')
      const tile = () => screen.getByRole('heading', { level: 3, name: 'Track claims' }).closest('li')
      const fire = (ratio: number) =>
        act(() => notify([{ isIntersecting: true, intersectionRatio: ratio } as IntersectionObserverEntry], {} as IntersectionObserver))
      fire(0.1)
      expect(tile()).toHaveClass('opacity-0')
      fire(0.35)
      expect(tile()).not.toHaveClass('opacity-0')
    } finally {
      if (original) globalThis.IntersectionObserver = original
      else Reflect.deleteProperty(globalThis, 'IntersectionObserver')
    }
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
