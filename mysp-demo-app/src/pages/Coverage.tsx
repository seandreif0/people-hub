import { useState } from 'react'
import { coverageByTab, type CoverageTab } from '../data/coverage'
import { members } from '../data/members'

const tabs: CoverageTab[] = ['Medical', 'Dental', 'Pharmacy', 'Vision']

export default function Coverage() {
  const [tab, setTab] = useState<CoverageTab>('Medical')

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="font-serif text-4xl font-bold">Coverage</h1>
      <p className="mt-2 text-secondary">What your demo plan pays for covered services.</p>

      <div role="tablist" aria-label="Coverage categories" className="mt-8 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            className={`rounded-full border-2 px-5 py-2 font-medium ${
              tab === t
                ? 'border-primary bg-primary text-white'
                : 'border-divider bg-white text-body hover:border-primary hover:text-primary'
            }`}
            onClick={() => setTab(t)}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="card mt-6" role="tabpanel" aria-label={`${tab} coverage`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left">
            <thead>
              <tr className="border-b border-divider text-sm text-secondary">
                <th scope="col" className="py-2 pr-4 font-medium">Service</th>
                <th scope="col" className="py-2 pr-4 font-medium">In-network</th>
                <th scope="col" className="py-2 font-medium">Out-of-network</th>
              </tr>
            </thead>
            <tbody>
              {coverageByTab[tab].map((r) => (
                <tr key={r.service} className="border-b border-divider last:border-0">
                  <td className="py-3 pr-4 font-medium">{r.service}</td>
                  <td className="py-3 pr-4">{r.inNetwork}</td>
                  <td className="py-3 text-secondary">{r.outOfNetwork}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <section aria-labelledby="members-heading" className="card mt-6">
        <h2 id="members-heading" className="font-serif text-2xl font-bold">Covered family members</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {members.map((m) => (
            <li key={m.id} className="rounded-2xl bg-surface-tint p-4">
              <p className="font-medium">{m.name}</p>
              <p className="text-sm text-secondary">{m.relationship} · {m.memberId}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
