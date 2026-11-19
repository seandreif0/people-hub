import { useMemo, useState } from 'react'
import { providers, specialties } from '../data/providers'

export default function FindCare() {
  const [specialty, setSpecialty] = useState('all')
  const [zip, setZip] = useState('')
  const [query, setQuery] = useState('')
  const [inNetworkOnly, setInNetworkOnly] = useState(false)
  const [acceptingOnly, setAcceptingOnly] = useState(false)
  const [sort, setSort] = useState<'distance' | 'rating'>('distance')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return providers
      .filter((p) => specialty === 'all' || p.specialty === specialty)
      .filter((p) => !inNetworkOnly || p.inNetwork)
      .filter((p) => !acceptingOnly || p.acceptingNewPatients)
      .filter((p) => !q || p.name.toLowerCase().includes(q) || p.specialty.toLowerCase().includes(q))
      .sort((a, b) => (sort === 'distance' ? a.distanceMiles - b.distanceMiles : b.rating - a.rating))
  }, [specialty, query, inNetworkOnly, acceptingOnly, sort])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="font-serif text-4xl font-bold">Find Care</h1>
      <p className="mt-2 text-secondary">Search fictional in-network doctors, dentists, and specialists.</p>

      <div className="card mt-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="fc-specialty" className="mb-1 block text-sm font-medium">Specialty</label>
            <select id="fc-specialty" className="input" value={specialty} onChange={(e) => setSpecialty(e.target.value)}>
              <option value="all">All specialties</option>
              {specialties.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="fc-zip" className="mb-1 block text-sm font-medium">ZIP code</label>
            <input id="fc-zip" className="input" inputMode="numeric" placeholder="00000" value={zip} onChange={(e) => setZip(e.target.value)} />
          </div>
          <div>
            <label htmlFor="fc-search" className="mb-1 block text-sm font-medium">Name or keyword</label>
            <input id="fc-search" type="search" className="input" placeholder="e.g. Sample" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div>
            <label htmlFor="fc-sort" className="mb-1 block text-sm font-medium">Sort by</label>
            <select id="fc-sort" className="input" value={sort} onChange={(e) => setSort(e.target.value as 'distance' | 'rating')}>
              <option value="distance">Distance</option>
              <option value="rating">Rating</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#0033FF]"
              checked={inNetworkOnly}
              onChange={(e) => setInNetworkOnly(e.target.checked)}
            />
            In-network only
          </label>
          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="h-5 w-5 accent-[#0033FF]"
              checked={acceptingOnly}
              onChange={(e) => setAcceptingOnly(e.target.checked)}
            />
            Accepting new patients
          </label>
        </div>
      </div>

      <p className="mt-6 text-secondary" aria-live="polite">
        {results.length} {results.length === 1 ? 'result' : 'results'}
      </p>
      {results.length === 0 ? (
        <div className="card mt-4 py-10 text-center text-secondary">
          No providers match your filters. Try clearing a filter.
        </div>
      ) : (
        <ul className="mt-4 space-y-4">
          {results.map((p) => (
            <li key={p.id} className="card flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="text-xl font-bold">{p.name}</h2>
                  {p.inNetwork ? (
                    <span className="chip bg-[#E6F9EF] text-success">
                      <svg viewBox="0 0 16 16" className="mr-1 h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                        <path d="M6.5 11.2 3.2 7.9l1-1 2.3 2.3 5.3-5.3 1 1z" />
                      </svg>
                      In-network
                    </span>
                  ) : (
                    <span className="chip bg-surface-neutral text-secondary">Out-of-network</span>
                  )}
                  {p.acceptingNewPatients && (
                    <span className="chip bg-surface-tint text-primary-pressed">Accepting new patients</span>
                  )}
                </div>
                <p className="mt-1 text-secondary">{p.specialty}</p>
                <p className="mt-1 text-sm text-secondary">{p.address}</p>
                <p className="mt-1 text-sm text-secondary">{p.phone}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold">{p.distanceMiles.toFixed(1)} mi</p>
                <p className="text-sm text-secondary" aria-label={`Rated ${p.rating} out of 5`}>
                  ★ {p.rating.toFixed(1)}
                </p>
                <button type="button" className="btn-secondary mt-3 px-5 py-2">View profile</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
