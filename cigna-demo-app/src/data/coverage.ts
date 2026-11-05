// Synthetic data: no PHI
export type CoverageTab = 'Medical' | 'Dental' | 'Pharmacy' | 'Vision'

export interface CoverageRow {
  service: string
  inNetwork: string
  outOfNetwork: string
}

export const coverageByTab: Record<CoverageTab, CoverageRow[]> = {
  Medical: [
    { service: 'Primary care visit', inNetwork: '$25 copay', outOfNetwork: '40% after deductible' },
    { service: 'Specialist visit', inNetwork: '$50 copay', outOfNetwork: '40% after deductible' },
    { service: 'Urgent care', inNetwork: '$75 copay', outOfNetwork: '$75 copay' },
    { service: 'Emergency room', inNetwork: '$300 copay', outOfNetwork: '$300 copay' },
    { service: 'Preventive care', inNetwork: 'Covered 100%', outOfNetwork: '40% after deductible' },
    { service: 'Lab & X-ray', inNetwork: '20% after deductible', outOfNetwork: '40% after deductible' },
    { service: 'Hospital stay', inNetwork: '20% after deductible', outOfNetwork: '50% after deductible' },
  ],
  Dental: [
    { service: 'Cleanings & exams', inNetwork: 'Covered 100%', outOfNetwork: '50%' },
    { service: 'Fillings', inNetwork: '20%', outOfNetwork: '50%' },
    { service: 'Crowns', inNetwork: '50%', outOfNetwork: 'Not covered' },
    { service: 'Orthodontia (child)', inNetwork: '50% up to $1,500 lifetime', outOfNetwork: 'Not covered' },
  ],
  Pharmacy: [
    { service: 'Generic, 30-day retail', inNetwork: '$10 copay', outOfNetwork: 'Not covered' },
    { service: 'Brand, 30-day retail', inNetwork: '$35 copay', outOfNetwork: 'Not covered' },
    { service: 'Generic, 90-day home delivery', inNetwork: '$20 copay', outOfNetwork: 'Not covered' },
    { service: 'Specialty medications', inNetwork: '30% up to $150', outOfNetwork: 'Not covered' },
  ],
  Vision: [
    { service: 'Annual eye exam', inNetwork: '$10 copay', outOfNetwork: 'Up to $45 reimbursement' },
    { service: 'Frames', inNetwork: '$150 allowance', outOfNetwork: 'Up to $80 reimbursement' },
    { service: 'Lenses', inNetwork: '$20 copay', outOfNetwork: 'Up to $40 reimbursement' },
    { service: 'Contact lenses', inNetwork: '$130 allowance', outOfNetwork: 'Up to $105 reimbursement' },
  ],
}
