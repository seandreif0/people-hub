import { Link } from 'react-router-dom'
import { claims } from '../data/claims'
import { plan } from '../data/members'
import StatusChip from '../components/StatusChip'
import ProgressBar from '../components/ProgressBar'
import Leaf from '../components/Leaf'
import { claimYouOwe, money } from '../utils/money'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

const quickActions = [
  { to: '/id-cards', label: 'View ID card' },
  { to: '/find-care', label: 'Find a doctor' },
  { to: '/claims', label: 'Claims' },
  { to: '/pharmacy', label: 'Refill Rx' },
]

export default function Dashboard() {
  const recent = [...claims]
    .sort((a, b) => b.dateOfService.localeCompare(a.dateOfService))
    .slice(0, 4)

  return (
    <div>
      <section className="relative overflow-hidden bg-surface-tint">
        <Leaf className="pointer-events-none absolute -right-8 -top-4 h-32 w-52 opacity-30" rotate={12} />
        <Leaf className="pointer-events-none absolute right-52 top-16 h-16 w-24 opacity-40" color="#CCD6FF" rotate={-25} />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:px-8">
          <h1 className="font-serif text-4xl font-bold sm:text-5xl">
            {greeting()}, Test Member
          </h1>
          <p className="mt-3 text-lg text-secondary">
            Here's a snapshot of your health plan — all demo data, of course.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 sm:px-8 lg:grid-cols-3">
        <section aria-labelledby="plan-heading" className="card lg:col-span-1">
          <h2 id="plan-heading" className="font-serif text-2xl font-bold">Your plan</h2>
          <dl className="mt-4 space-y-2 text-body">
            <div><dt className="text-sm text-secondary">Plan name</dt><dd className="font-medium">{plan.name}</dd></div>
            <div><dt className="text-sm text-secondary">Member ID</dt><dd className="font-medium">{plan.memberId}</dd></div>
            <div><dt className="text-sm text-secondary">Group number</dt><dd className="font-medium">{plan.groupNumber}</dd></div>
            <div><dt className="text-sm text-secondary">Coverage period</dt><dd className="font-medium">{plan.coverageStart} – {plan.coverageEnd}</dd></div>
          </dl>
          <Link to="/coverage" className="mt-4 inline-block font-medium text-primary underline">
            View full coverage
          </Link>
        </section>

        <section aria-labelledby="deductible-heading" className="card lg:col-span-1">
          <h2 id="deductible-heading" className="font-serif text-2xl font-bold">Deductible</h2>
          <div className="mt-4 space-y-5">
            <ProgressBar label="Individual" met={plan.deductible.individualMet} total={plan.deductible.individual} />
            <ProgressBar label="Family" met={plan.deductible.familyMet} total={plan.deductible.family} />
          </div>
          <h3 className="mt-6 font-serif text-2xl font-bold">Out-of-pocket max</h3>
          <div className="mt-4 space-y-5">
            <ProgressBar label="Individual" met={plan.outOfPocketMax.individualMet} total={plan.outOfPocketMax.individual} />
            <ProgressBar label="Family" met={plan.outOfPocketMax.familyMet} total={plan.outOfPocketMax.family} />
          </div>
        </section>

        <div className="space-y-6 lg:col-span-1">
          <section aria-labelledby="actions-heading" className="card">
            <h2 id="actions-heading" className="font-serif text-2xl font-bold">Quick actions</h2>
            <ul className="mt-4 grid grid-cols-2 gap-3">
              {quickActions.map((a) => (
                <li key={a.to}>
                  <Link
                    to={a.to}
                    className="flex h-full items-center justify-center rounded-2xl bg-surface-tint px-3 py-4 text-center font-medium text-primary no-underline hover:bg-primary-tint"
                  >
                    {a.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="nurse-heading" className="card bg-primary text-white">
            <h2 id="nurse-heading" className="font-serif text-2xl font-bold text-white">Talk to a nurse 24/7</h2>
            <p className="mt-2 text-primary-tint">
              Questions about symptoms or care? A nurse is always available.
            </p>
            <a href="tel:1-800-000-0000" className="mt-4 inline-block font-serif text-2xl font-bold text-white underline">
              1-800-000-0000
            </a>
          </section>
        </div>
      </div>

      <section aria-labelledby="recent-claims" className="mx-auto max-w-6xl px-4 pb-10 sm:px-8">
        <div className="card">
          <div className="flex items-baseline justify-between">
            <h2 id="recent-claims" className="font-serif text-2xl font-bold">Recent claims</h2>
            <Link to="/claims" className="font-medium text-primary underline">View all</Link>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-divider text-sm text-secondary">
                  <th scope="col" className="py-2 pr-4 font-medium">Date of service</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Member</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Provider</th>
                  <th scope="col" className="py-2 pr-4 font-medium">You owe</th>
                  <th scope="col" className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((c) => (
                  <tr key={c.id} className="border-b border-divider last:border-0">
                    <td className="py-3 pr-4">{c.dateOfService}</td>
                    <td className="py-3 pr-4">{c.memberName}</td>
                    <td className="py-3 pr-4">
                      <Link to={`/claims/${c.id}`} className="text-primary underline">{c.provider}</Link>
                    </td>
                    <td className="py-3 pr-4">{money(claimYouOwe(c))}</td>
                    <td className="py-3"><StatusChip status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
