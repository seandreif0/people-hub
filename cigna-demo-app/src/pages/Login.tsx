import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/context'
import FeatureBento from '../components/FeatureBento'
import Leaf from '../components/Leaf'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [username, setUsername] = useState('testmember')
  const [password, setPassword] = useState('demo')
  const [error, setError] = useState<string | null>(null)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (login(username, password)) {
      navigate('/')
    } else {
      setError('Please enter both a username and password.')
    }
  }

  return (
    <div>
      <section className="relative overflow-hidden bg-surface-tint">
        <Leaf className="pointer-events-none absolute -right-10 -top-6 h-40 w-64 opacity-30" rotate={15} />
        <Leaf className="pointer-events-none absolute right-40 bottom-0 h-20 w-32 opacity-50" color="#CCD6FF" rotate={-10} />
        <div className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-12 sm:px-8 md:grid-cols-2 md:py-16">
          <div className="relative">
            <Leaf className="mb-4 block h-12 w-20" rotate={-20} />
            <h1 className="font-serif text-[40px] font-bold leading-tight text-navy sm:text-[56px]">
              Welcome to myCigna
            </h1>
            <p className="mt-4 max-w-md text-lg text-secondary">
              Your demo member portal for managing coverage, claims, prescriptions,
              and care — all in one place.
            </p>
          </div>

          <div className="card relative z-10">
            <h2 className="font-serif text-2xl font-bold">Log in to your account</h2>
            <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate={false}>
              {error && (
                <p role="alert" className="rounded-lg border border-error bg-[#FBEAEA] px-4 py-3 text-sm font-medium text-error">
                  {error}
                </p>
              )}
              <div>
                <label htmlFor="username" className="mb-1 block font-medium text-body">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  className="input"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(null) }}
                />
              </div>
              <div>
                <label htmlFor="password" className="mb-1 block font-medium text-body">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className="input"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null) }}
                />
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button type="submit" className="btn-primary">Log in</button>
                <button type="button" className="btn-secondary">Register</button>
              </div>
              <a href="/login" className="inline-block text-primary underline">
                Forgot username or password?
              </a>
            </form>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-8">
        <h2 className="font-serif text-3xl font-bold">With myCigna, you're in control:</h2>
        <FeatureBento />
      </section>
    </div>
  )
}
