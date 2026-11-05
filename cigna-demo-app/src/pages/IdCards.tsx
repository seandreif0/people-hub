import { useState } from 'react'
import { members, plan } from '../data/members'
import { useToast } from '../components/toast-context'
import Leaf from '../components/Leaf'
import logo from '../assets/cigna-logo.svg'

export default function IdCards() {
  const { showToast } = useToast()
  const [memberId, setMemberId] = useState(members[0].memberId)
  const member = members.find((m) => m.memberId === memberId) ?? members[0]

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-8">
      <h1 className="font-serif text-4xl font-bold">ID Cards</h1>
      <p className="mt-2 text-secondary">Digital ID cards for everyone on your plan.</p>

      <div className="mt-6">
        <label htmlFor="card-member" className="mb-1 block text-sm font-medium">Family member</label>
        <select
          id="card-member"
          className="input max-w-sm"
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          {members.map((m) => (
            <option key={m.memberId} value={m.memberId}>
              {m.name} ({m.relationship})
            </option>
          ))}
        </select>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* front */}
        <section aria-label={`ID card front for ${member.name}`} className="relative overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-[0_4px_16px_rgba(0,0,0,0.2)]">
          <Leaf className="pointer-events-none absolute -right-8 top-8 h-20 w-32 opacity-25" />
          <div className="relative flex items-center justify-between">
            <div className="rounded-lg bg-white p-1"><img src={logo} alt="Cigna Healthcare" className="h-8 w-auto" /></div>
            <span className="text-sm font-medium">Demo Plan</span>
          </div>
          <p className="mt-6 font-serif text-2xl font-bold">{member.name}</p>
          <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div><dt className="text-primary-tint">Member ID</dt><dd className="font-medium">{member.memberId}</dd></div>
            <div><dt className="text-primary-tint">Group</dt><dd className="font-medium">{plan.groupNumber}</dd></div>
            <div className="col-span-2"><dt className="text-primary-tint">Plan</dt><dd className="font-medium">{plan.name}</dd></div>
          </dl>
          <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-white/30 pt-3 text-center text-sm">
            <div><dt className="text-primary-tint">PCP</dt><dd className="font-bold">${plan.copays.pcp}</dd></div>
            <div><dt className="text-primary-tint">Spec</dt><dd className="font-bold">${plan.copays.specialist}</dd></div>
            <div><dt className="text-primary-tint">UC</dt><dd className="font-bold">${plan.copays.urgentCare}</dd></div>
            <div><dt className="text-primary-tint">ER</dt><dd className="font-bold">${plan.copays.er}</dd></div>
          </dl>
          <dl className="mt-3 flex gap-6 text-xs">
            <div><dt className="inline text-primary-tint">Rx BIN: </dt><dd className="inline font-medium">{plan.rx.bin}</dd></div>
            <div><dt className="inline text-primary-tint">PCN: </dt><dd className="inline font-medium">{plan.rx.pcn}</dd></div>
            <div><dt className="inline text-primary-tint">Grp: </dt><dd className="inline font-medium">{plan.rx.group}</dd></div>
          </dl>
        </section>

        {/* back */}
        <section aria-label={`ID card back for ${member.name}`} className="rounded-3xl bg-surface-neutral p-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <h2 className="font-serif text-xl font-bold">Important numbers</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-secondary">Member services</dt><dd className="font-medium">1-800-000-0000</dd></div>
            <div className="flex justify-between"><dt className="text-secondary">24/7 nurse line</dt><dd className="font-medium">1-800-000-0001</dd></div>
            <div className="flex justify-between"><dt className="text-secondary">Pharmacy help</dt><dd className="font-medium">1-800-000-0002</dd></div>
            <div className="flex justify-between"><dt className="text-secondary">Behavioral health</dt><dd className="font-medium">1-800-000-0003</dd></div>
          </dl>
          <h3 className="mt-5 font-serif text-xl font-bold">Claims address</h3>
          <p className="mt-1 text-sm text-secondary">
            Demo Claims Processing<br />
            PO Box 0000<br />
            Sampletown, CT 00000
          </p>
          <p className="mt-4 text-xs text-secondary">
            Fictional demo card — not valid proof of insurance.
          </p>
        </section>
      </div>

      <div className="mt-6 flex gap-3">
        <button type="button" className="btn-primary" onClick={() => showToast('Print dialog would open (demo).')}>
          Print
        </button>
        <button type="button" className="btn-secondary" onClick={() => showToast(`ID card emailed (demo) for ${member.name}.`)}>
          Email
        </button>
      </div>
    </div>
  )
}
