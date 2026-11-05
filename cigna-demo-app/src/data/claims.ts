// Synthetic data: no PHI
export type ClaimStatus = 'Processed' | 'Pending' | 'Denied'
export type ClaimType = 'Medical' | 'Dental' | 'Pharmacy'

export interface ServiceLine {
  description: string
  billed: number
  discount: number
  planPaid: number
  deductible: number
  coinsurance: number
  copay: number
}

export interface Claim {
  id: string
  dateOfService: string
  memberId: string
  memberName: string
  provider: string
  type: ClaimType
  billed: number
  status: ClaimStatus
  lines: ServiceLine[]
}

const line = (
  description: string,
  billed: number,
  discount: number,
  planPaid: number,
  deductible: number,
  coinsurance: number,
  copay: number,
): ServiceLine => ({ description, billed, discount, planPaid, deductible, coinsurance, copay })

export const claims: Claim[] = [
  {
    id: 'CLM-1001', dateOfService: '2026-10-12', memberId: 'TEST-000123', memberName: 'Test Member One',
    provider: 'Example Family Medicine', type: 'Medical', billed: 220, status: 'Processed',
    lines: [line('Office visit, established patient', 220, 80, 115, 0, 0, 25)],
  },
  {
    id: 'CLM-1002', dateOfService: '2026-10-02', memberId: 'TEST-000124', memberName: 'Test Member Two',
    provider: 'Sample Dental Group', type: 'Dental', billed: 180, status: 'Processed',
    lines: [line('Routine cleaning and exam', 180, 40, 140, 0, 0, 0)],
  },
  {
    id: 'CLM-1003', dateOfService: '2026-09-28', memberId: 'TEST-000123', memberName: 'Test Member One',
    provider: 'Example Pharmacy #101', type: 'Pharmacy', billed: 65, status: 'Processed',
    lines: [line('Generic prescription fill, 30-day', 65, 25, 30, 0, 0, 10)],
  },
  {
    id: 'CLM-1004', dateOfService: '2026-09-15', memberId: 'TEST-000125', memberName: 'Test Member Three',
    provider: 'Sample Pediatrics Associates', type: 'Medical', billed: 340, status: 'Pending',
    lines: [line('Well-child visit with labs', 340, 90, 0, 150, 0, 0)],
  },
  {
    id: 'CLM-1005', dateOfService: '2026-09-03', memberId: 'TEST-000124', memberName: 'Test Member Two',
    provider: 'Example Dermatology Center', type: 'Medical', billed: 410, status: 'Denied',
    lines: [line('Out-of-network consultation', 410, 0, 0, 0, 0, 0)],
  },
  {
    id: 'CLM-1006', dateOfService: '2026-08-22', memberId: 'TEST-000123', memberName: 'Test Member One',
    provider: 'Sample Orthopedic Clinic', type: 'Medical', billed: 890, status: 'Processed',
    lines: [
      line('Specialist office visit', 320, 120, 150, 0, 0, 50),
      line('X-ray, knee, 2 views', 570, 260, 280, 30, 0, 0),
    ],
  },
  {
    id: 'CLM-1007', dateOfService: '2026-08-10', memberId: 'TEST-000125', memberName: 'Test Member Three',
    provider: 'Example Pharmacy #101', type: 'Pharmacy', billed: 45, status: 'Processed',
    lines: [line('Generic prescription fill, 30-day', 45, 20, 15, 0, 0, 10)],
  },
  {
    id: 'CLM-1008', dateOfService: '2026-07-30', memberId: 'TEST-000123', memberName: 'Test Member One',
    provider: 'Sample Urgent Care', type: 'Medical', billed: 275, status: 'Processed',
    lines: [line('Urgent care visit', 275, 100, 100, 0, 0, 75)],
  },
  {
    id: 'CLM-1009', dateOfService: '2026-07-18', memberId: 'TEST-000124', memberName: 'Test Member Two',
    provider: 'Sample Dental Group', type: 'Dental', billed: 620, status: 'Denied',
    lines: [line('Crown, porcelain', 620, 0, 0, 0, 0, 0)],
  },
  {
    id: 'CLM-1010', dateOfService: '2026-07-05', memberId: 'TEST-000125', memberName: 'Test Member Three',
    provider: 'Example Pediatrics Associates', type: 'Medical', billed: 150, status: 'Processed',
    lines: [line('Sick visit', 150, 55, 70, 0, 0, 25)],
  },
  {
    id: 'CLM-1011', dateOfService: '2026-06-19', memberId: 'TEST-000123', memberName: 'Test Member One',
    provider: 'Example Lab Services', type: 'Medical', billed: 210, status: 'Pending',
    lines: [line('Comprehensive metabolic panel', 210, 60, 0, 90, 0, 0)],
  },
  {
    id: 'CLM-1012', dateOfService: '2026-06-02', memberId: 'TEST-000124', memberName: 'Test Member Two',
    provider: 'Example Pharmacy #102', type: 'Pharmacy', billed: 120, status: 'Processed',
    lines: [line('Brand prescription fill, 90-day', 120, 30, 60, 0, 0, 30)],
  },
]
