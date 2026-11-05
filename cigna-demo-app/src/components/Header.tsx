import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/context'
import logo from '../assets/cigna-logo.svg'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/claims', label: 'Claims' },
  { to: '/coverage', label: 'Coverage' },
  { to: '/id-cards', label: 'ID Cards' },
  { to: '/find-care', label: 'Find Care' },
  { to: '/pharmacy', label: 'Pharmacy' },
]

export default function Header() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    setMenuOpen(false)
    logout()
    navigate('/login')
  }

  return (
    <header>
      {/* top utility bar */}
      <div className="flex items-center justify-between gap-4 border-b border-divider bg-white px-4 py-3 sm:px-8">
        <Link to={isAuthenticated ? '/' : '/login'} aria-label="Cigna demo home">
          <img src={logo} alt="Cigna Healthcare" className="h-[40px] w-auto sm:h-[53px]" />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <button type="button" className="hidden text-primary underline sm:inline">Español</button>
          <button type="button" className="hidden text-primary underline sm:inline">Help</button>
          {isAuthenticated && (
            <span className="font-medium text-body">Test Member One</span>
          )}
        </div>
      </div>

      {/* blue nav band */}
      {isAuthenticated && (
        <nav aria-label="Main" className="relative bg-primary text-white">
          <div className="flex items-center justify-between px-4 sm:px-8">
            <button
              type="button"
              className="py-4 text-white md:hidden"
              aria-expanded={menuOpen}
              aria-controls="main-nav"
              aria-label="Toggle navigation menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
                )}
              </svg>
            </button>
            <ul
              id="main-nav"
              className={`${menuOpen ? 'flex' : 'hidden'} absolute left-0 right-0 top-full z-40 flex-col bg-primary px-4 pb-4 md:static md:flex md:flex-row md:items-center md:gap-6 md:px-0 md:pb-0`}
            >
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `block py-4 text-base font-medium text-white no-underline md:py-3 ${
                        isActive ? 'underline decoration-white decoration-2 underline-offset-8' : 'hover:underline hover:decoration-white hover:underline-offset-8'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
              <li className="md:hidden">
                <button type="button" onClick={handleLogout} className="btn-inverse mt-2 mb-4">
                  Log out
                </button>
              </li>
            </ul>
            <button type="button" onClick={handleLogout} className="btn-inverse my-2 hidden px-5 py-2 md:inline-flex">
              Log out
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
