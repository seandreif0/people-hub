import { Link, useParams } from 'react-router-dom'
import { claims } from '../data/claims'
import StatusChip from '../components/StatusChip'
import { useToast } from '../components/toast-context'
import { claimDiscount, claimPlanPaid, claimYouOwe, lineYouOwe, money } from '../utils/money'

export default function ClaimDetail() {
  const { id } = useParams()
  const { showToast } = useToast()
  const claim = claims.find((c) => c.id === id)

  if (!claim) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold">Claim not found</h1>
        <Link to="/claims" className="mt-4 inline-block text-primary underline">Back to claims</Link>
      </div>
    )
  }

  const rows: [string, number][] = [
    ['Amount billed', claim.billed],
    ['Plan discount', -claimDiscount(claim)],
    ['Plan paid', -claimPlanPaid(claim)],
    ['Applied to deductible', claim.lines.reduce((s, l) => s + l.deductible, 0)],
    ['Coinsurance', claim.lines.reduce((s, l) => s + l.coinsurance, 0)],
    ['Copay', claim.lines.reduce((s, l) => s + l.copay, 0)],
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <Link to="/claims" className="text-primary underline">← Back to claims</Link>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-4xl font-bold">Claim {claim.id}</h1>
        <StatusChip status={claim.status} />
      </div>
      <p className="mt-2 text-secondary">
        {claim.type} · {claim.dateOfService} · {claim.memberName} · {claim.provider}
      </p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="eob-heading" className="card">
          <h2 id="eob-heading" className="font-serif text-2xl font-bold">EOB breakdown</h2>
          <dl className="mt-4 space-y-3">
            {rows.map(([label, value]) => (
              <div key={label} className="flex justify-between border-b border-divider pb-2">
                <dt className="text-secondary">{label}</dt>
                <dd className="font-medium">{value < 0 ? `-${money(-value)}` : money(value)}</dd>
              </div>
            ))}
            <div className="flex justify-between pt-1 text-lg font-bold">
              <dt>You owe</dt>
              <dd>{money(claimYouOwe(claim))}</dd>
            </div>
          </dl>
          <button
            type="button"
            className="btn-primary mt-6"
            onClick={() => showToast('EOB download started (demo — no file will download).')}
          >
            Download EOB
          </button>
        </section>

        <section aria-labelledby="lines-heading" className="card">
          <h2 id="lines-heading" className="font-serif text-2xl font-bold">Service lines</h2>
          <ul className="mt-4 space-y-4">
            {claim.lines.map((l, i) => (
              <li key={i} className="rounded-2xl bg-surface-neutral p-4">
                <p className="font-medium">{l.description}</p>
                <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                  <div className="flex justify-between"><dt className="text-secondary">Billed</dt><dd>{money(l.billed)}</dd></div>
                  <div className="flex justify-between"><dt className="text-secondary">Discount</dt><dd>{money(l.discount)}</dd></div>
                  <div className="flex justify-between"><dt className="text-secondary">Plan paid</dt><dd>{money(l.planPaid)}</dd></div>
                  <div className="flex justify-between font-medium"><dt>You owe</dt><dd>{money(lineYouOwe(l))}</dd></div>
                </dl>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
