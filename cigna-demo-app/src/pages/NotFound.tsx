import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="font-serif text-5xl font-bold">Page not found</h1>
      <p className="mt-4 text-lg text-secondary">
        The page you're looking for doesn't exist in this demo.
      </p>
      <Link to="/" className="btn-primary mt-8">Back to dashboard</Link>
    </div>
  )
}
