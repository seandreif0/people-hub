import { useState } from 'react'
import { prescriptions as seed, type Prescription } from '../data/prescriptions'
import { useToast } from '../components/toast-context'
import Leaf from '../components/Leaf'

export default function Pharmacy() {
  const { showToast } = useToast()
  const [rxs, setRxs] = useState<Prescription[]>(seed)

  const refill = (id: string) => {
    const rx = rxs.find((r) => r.id === id)
    if (!rx) return
    if (rx.refillsLeft === 0) {
      showToast(`${rx.drug} has no refills left — contact your prescriber.`)
      return
    }
    setRxs((list) =>
      list.map((r) => (r.id === id ? { ...r, refillsLeft: r.refillsLeft - 1 } : r)),
    )
    showToast(`Refill requested for ${rx.drug}. Ready in ~2 hours (demo).`)
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="font-serif text-4xl font-bold">Pharmacy</h1>
      <p className="mt-2 text-secondary">Manage your family's demo prescriptions.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <ul className="space-y-4 lg:col-span-2">
          {rxs.map((rx) => (
            <li key={rx.id} className="card">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">{rx.drug}</h2>
                  <p className="text-secondary">{rx.dosage}</p>
                  <dl className="mt-3 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
                    <div><dt className="inline text-secondary">For: </dt><dd className="inline">{rx.memberName}</dd></div>
                    <div><dt className="inline text-secondary">Prescriber: </dt><dd className="inline">{rx.prescriber}</dd></div>
                    <div><dt className="inline text-secondary">Pharmacy: </dt><dd className="inline">{rx.pharmacy}</dd></div>
                    <div><dt className="inline text-secondary">Last filled: </dt><dd className="inline">{rx.lastFilled}</dd></div>
                  </dl>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${rx.refillsLeft === 0 ? 'text-error' : 'text-secondary'}`}>
                    {rx.refillsLeft} {rx.refillsLeft === 1 ? 'refill' : 'refills'} left
                  </p>
                  <button
                    type="button"
                    className="btn-primary mt-3 px-5 py-2"
                    onClick={() => refill(rx.id)}
                    disabled={rx.refillsLeft === 0}
                  >
                    Refill
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <aside className="relative overflow-hidden card bg-surface-tint lg:col-span-1 h-fit">
          <Leaf className="pointer-events-none absolute -right-8 -top-6 h-24 w-40 opacity-25" />
          <h2 className="relative font-serif text-2xl font-bold">Save with home delivery</h2>
          <p className="mt-2 text-secondary">
            Get a 90-day supply of maintenance medications delivered to your door —
            often for less than retail pickup.
          </p>
          <button
            type="button"
            className="btn-primary mt-4"
            onClick={() => showToast('Home delivery enrollment is not available in this demo.')}
          >
            Learn more
          </button>
        </aside>
      </div>
    </div>
  )
}
