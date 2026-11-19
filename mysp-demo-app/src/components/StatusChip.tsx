import type { ClaimStatus } from '../data/claims'

const styles: Record<ClaimStatus, string> = {
  Processed: 'bg-surface-tint text-primary-pressed',
  Pending: 'bg-surface-neutral text-secondary',
  Denied: 'bg-[#FBEAEA] text-error',
}

export default function StatusChip({ status }: { status: ClaimStatus }) {
  return <span className={`chip ${styles[status]}`}>{status}</span>
}
