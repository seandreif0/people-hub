// Synthetic data: no PHI
export interface Prescription {
  id: string
  drug: string
  dosage: string
  prescriber: string
  pharmacy: string
  refillsLeft: number
  lastFilled: string
  memberName: string
}

export const prescriptions: Prescription[] = [
  { id: 'rx1', drug: 'Examplestatin', dosage: '20 mg tablet, once daily', prescriber: 'Dr. Sample Provider', pharmacy: 'Example Pharmacy #101', refillsLeft: 3, lastFilled: '2026-10-01', memberName: 'Test Member One' },
  { id: 'rx2', drug: 'Placebopril', dosage: '10 mg capsule, once daily', prescriber: 'Dr. Sample Provider', pharmacy: 'Example Pharmacy #101', refillsLeft: 1, lastFilled: '2026-09-15', memberName: 'Test Member One' },
  { id: 'rx3', drug: 'Demoxifen', dosage: '5 mg tablet, twice daily', prescriber: 'Dr. Placeholder Cardio', pharmacy: 'Example Pharmacy #102', refillsLeft: 5, lastFilled: '2026-10-10', memberName: 'Test Member Two' },
  { id: 'rx4', drug: 'Samplamine', dosage: '50 mg tablet, once daily', prescriber: 'Dr. Placeholder Cardio', pharmacy: 'Example Pharmacy #102', refillsLeft: 0, lastFilled: '2026-08-20', memberName: 'Test Member Two' },
  { id: 'rx5', drug: 'Fictivent', dosage: '90 mcg inhaler, as needed', prescriber: 'Sample Pediatrics Associates', pharmacy: 'Example Pharmacy #101', refillsLeft: 2, lastFilled: '2026-09-28', memberName: 'Test Member Three' },
]
