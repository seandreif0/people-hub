// Synthetic data: no PHI
export interface Member {
  id: string
  memberId: string
  name: string
  relationship: 'Subscriber' | 'Spouse' | 'Child'
}

export interface Plan {
  name: string
  memberId: string
  groupNumber: string
  coverageStart: string
  coverageEnd: string
  deductible: { individual: number; family: number; individualMet: number; familyMet: number }
  outOfPocketMax: { individual: number; family: number; individualMet: number; familyMet: number }
  copays: { pcp: number; specialist: number; urgentCare: number; er: number }
  rx: { bin: string; pcn: string; group: string }
}

export const members: Member[] = [
  { id: 'm1', memberId: 'TEST-000123', name: 'Test Member One', relationship: 'Subscriber' },
  { id: 'm2', memberId: 'TEST-000124', name: 'Test Member Two', relationship: 'Spouse' },
  { id: 'm3', memberId: 'TEST-000125', name: 'Test Member Three', relationship: 'Child' },
]

export const plan: Plan = {
  name: 'Cigna Open Access Plus — Demo',
  memberId: 'TEST-000123',
  groupNumber: 'GRP-DEMO-001',
  coverageStart: '2026-01-01',
  coverageEnd: '2026-12-31',
  deductible: { individual: 1500, family: 3000, individualMet: 600, familyMet: 1050 },
  outOfPocketMax: { individual: 5000, family: 10000, individualMet: 1240, familyMet: 2100 },
  copays: { pcp: 25, specialist: 50, urgentCare: 75, er: 300 },
  rx: { bin: '000000', pcn: 'DEMO', group: 'DEMOGRP' },
}
