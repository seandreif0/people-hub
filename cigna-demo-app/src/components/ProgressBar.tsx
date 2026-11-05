import { money, progressPercent, remaining } from '../utils/money'

export default function ProgressBar({
  label,
  met,
  total,
}: {
  label: string
  met: number
  total: number
}) {
  const pct = progressPercent(met, total)
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-medium text-body">{label}</span>
        <span className="text-sm text-secondary">
          {money(remaining(total, met))} remaining of {money(total)}
        </span>
      </div>
      <div
        className="mt-2 h-3 w-full overflow-hidden rounded-full bg-divider"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
      </div>
      <span className="mt-1 block text-sm text-secondary">{pct}% met</span>
    </div>
  )
}
