import { describe, expect, it } from 'vitest'
import { claimYouOwe, lineYouOwe, progressPercent, remaining } from './money'
import type { Claim } from '../data/claims'

describe('progressPercent', () => {
  it('returns percentage met', () => {
    expect(progressPercent(600, 1500)).toBe(40)
    expect(progressPercent(0, 1500)).toBe(0)
  })
  it('caps at 100', () => {
    expect(progressPercent(2000, 1500)).toBe(100)
  })
  it('handles zero total', () => {
    expect(progressPercent(10, 0)).toBe(0)
  })
})

describe('remaining', () => {
  it('returns the unmet amount and never goes negative', () => {
    expect(remaining(1500, 600)).toBe(900)
    expect(remaining(1500, 2000)).toBe(0)
  })
})

describe('claim you-owe math', () => {
  const claim: Claim = {
    id: 'CLM-X',
    dateOfService: '2026-01-01',
    memberId: 'TEST-000',
    memberName: 'Test',
    provider: 'Example',
    type: 'Medical',
    billed: 500,
    status: 'Processed',
    lines: [
      { description: 'a', billed: 300, discount: 50, planPaid: 100, deductible: 100, coinsurance: 30, copay: 20 },
      { description: 'b', billed: 200, discount: 20, planPaid: 150, deductible: 0, coinsurance: 10, copay: 0 },
    ],
  }

  it('lineYouOwe = deductible + coinsurance + copay', () => {
    expect(lineYouOwe(claim.lines[0])).toBe(150)
    expect(lineYouOwe(claim.lines[1])).toBe(10)
  })

  it('claimYouOwe sums all service lines', () => {
    expect(claimYouOwe(claim)).toBe(160)
  })
})
