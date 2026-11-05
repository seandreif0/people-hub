import type { Claim, ServiceLine } from '../data/claims'

export function money(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
}

export function progressPercent(met: number, total: number): number {
  if (total <= 0) return 0
  return Math.min(100, Math.round((met / total) * 100))
}

export function remaining(total: number, met: number): number {
  return Math.max(0, total - met)
}

export function lineYouOwe(l: ServiceLine): number {
  return l.deductible + l.coinsurance + l.copay
}

export function claimYouOwe(c: Claim): number {
  return c.lines.reduce((sum, l) => sum + lineYouOwe(l), 0)
}

export function claimPlanPaid(c: Claim): number {
  return c.lines.reduce((sum, l) => sum + l.planPaid, 0)
}

export function claimDiscount(c: Claim): number {
  return c.lines.reduce((sum, l) => sum + l.discount, 0)
}
