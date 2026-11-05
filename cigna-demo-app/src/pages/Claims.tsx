import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { claims, type ClaimStatus, type ClaimType } from '../data/claims'
import { members } from '../data/members'
import StatusChip from '../components/StatusChip'
import { claimYouOwe, money } from '../utils/money'

const statuses: ClaimStatus[] = ['Processed', 'Pending', 'Denied']
const types: ClaimType[] = ['Medical', 'Dental', 'Pharmacy']

export default function Claims() {
  const navigate = useNavigate()
  const [member, setMember] = useState('all')
  const [type, setType] = useState('all')
  const [status, setStatus] = useState('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return [...claims]
      .sort((a, b) => b.dateOfService.localeCompare(a.dateOfService))
      .filter((c) => member === 'all' || c.memberId === member)
      .filter((c) => type === 'all' || c.type === type)
      .filter((c) => status === 'all' || c.status === status)
      .filter((c) => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return (
          c.provider.toLowerCase().includes(q) ||
          c.memberName.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q)
        )
      })
  }, [member, type, status, query])

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-8">
      <h1 className="font-serif text-4xl font-bold">Claims</h1>
      <p className="mt-2 text-secondary">Review and filter your family's claims.</p>

      <div className="card mt-8">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <label htmlFor="filter-member" className="mb-1 block text-sm font-medium">Member</label>
            <select id="filter-member" className="input" value={member} onChange={(e) => setMember(e.target.value)}>
              <option value="all">All members</option>
              {members.map((m) => (
                <option key={m.memberId} value={m.memberId}>{m.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="filter-type" className="mb-1 block text-sm font-medium">Type</label>
            <select id="filter-type" className="input" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="all">All types</option>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-status" className="mb-1 block text-sm font-medium">Status</label>
            <select id="filter-status" className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All statuses</option>
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="filter-search" className="mb-1 block text-sm font-medium">Search</label>
            <input
              id="filter-search"
              type="search"
              className="input"
              placeholder="Provider, member, or claim #"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="card mt-6">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-secondary">
            No claims match your filters. Try broadening your search.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-divider text-sm text-secondary">
                  <th scope="col" className="py-2 pr-4 font-medium">Date of service</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Member</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Provider</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Type</th>
                  <th scope="col" className="py-2 pr-4 font-medium">Billed</th>
                  <th scope="col" className="py-2 pr-4 font-medium">You owe</th>
                  <th scope="col" className="py-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr
                    key={c.id}
                    tabIndex={0}
                    role="link"
                    className="cursor-pointer border-b border-divider last:border-0 hover:bg-surface-tint focus-visible:bg-surface-tint"
                    onClick={() => navigate(`/claims/${c.id}`)}
                    onKeyDown={(e) => { if (e.key === 'Enter') navigate(`/claims/${c.id}`) }}
                  >
                    <td className="py-3 pr-4">{c.dateOfService}</td>
                    <td className="py-3 pr-4">{c.memberName}</td>
                    <td className="py-3 pr-4 text-primary underline">{c.provider}</td>
                    <td className="py-3 pr-4">{c.type}</td>
                    <td className="py-3 pr-4">{money(c.billed)}</td>
                    <td className="py-3 pr-4">{money(claimYouOwe(c))}</td>
                    <td className="py-3"><StatusChip status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
