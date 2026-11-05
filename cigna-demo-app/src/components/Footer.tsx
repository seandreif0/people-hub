import { Link } from 'react-router-dom'

const columns = [
  {
    heading: 'I want to...',
    links: ['Find a doctor', 'View my claims', 'Get my ID card', 'Refill a prescription'],
  },
  {
    heading: 'Learn about...',
    links: ['My coverage', 'Deductibles', 'Pharmacy benefits', 'Dental & vision'],
  },
  {
    heading: 'Get support',
    links: ['Help center', 'Contact us', 'Español', 'Accessibility'],
  },
]

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-divider bg-surface-neutral">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
        <div className="grid gap-8 sm:grid-cols-3">
          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h2 className="font-serif text-lg font-bold text-navy">{col.heading}</h2>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link to="/" className="text-primary underline">
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <p className="mt-10 border-t border-divider pt-6 text-sm text-secondary">
          This is a fictional demonstration application. It is not affiliated with,
          endorsed by, or connected to Cigna Healthcare or The Cigna Group. All people,
          plans, claims, providers, and prescriptions shown are entirely synthetic.
          Product details are illustrative only and do not represent real coverage.
        </p>
        <p className="mt-3 text-sm text-secondary">
          © 2026 Demo Corp. For demonstration purposes only.
        </p>
      </div>
    </footer>
  )
}
