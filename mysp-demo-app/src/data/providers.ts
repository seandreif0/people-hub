// Synthetic data: no PHI
export interface Provider {
  id: string
  name: string
  specialty: string
  address: string
  distanceMiles: number
  rating: number
  inNetwork: boolean
  acceptingNewPatients: boolean
  phone: string
}

export const specialties = [
  'Family Medicine',
  'Pediatrics',
  'Dermatology',
  'Cardiology',
  'Orthopedics',
  'Dentistry',
]

export const providers: Provider[] = [
  { id: 'p1', name: 'Dr. Sample Provider', specialty: 'Family Medicine', address: '123 Example St, Sampletown, CT 00000', distanceMiles: 1.2, rating: 4.8, inNetwork: true, acceptingNewPatients: true, phone: '1-800-000-0001' },
  { id: 'p2', name: 'Example Family Medicine', specialty: 'Family Medicine', address: '45 Demo Ave, Sampletown, CT 00000', distanceMiles: 2.4, rating: 4.5, inNetwork: true, acceptingNewPatients: false, phone: '1-800-000-0002' },
  { id: 'p3', name: 'Sample Pediatrics Associates', specialty: 'Pediatrics', address: '67 Fictional Rd, Sampletown, CT 00000', distanceMiles: 3.1, rating: 4.9, inNetwork: true, acceptingNewPatients: true, phone: '1-800-000-0003' },
  { id: 'p4', name: 'Dr. Placeholder Cardio', specialty: 'Cardiology', address: '200 Mock Blvd, Testville, CT 00000', distanceMiles: 5.6, rating: 4.2, inNetwork: true, acceptingNewPatients: true, phone: '1-800-000-0004' },
  { id: 'p5', name: 'Example Dermatology Center', specialty: 'Dermatology', address: '88 Synthetic Ln, Testville, CT 00000', distanceMiles: 6.3, rating: 3.9, inNetwork: false, acceptingNewPatients: true, phone: '1-800-000-0005' },
  { id: 'p6', name: 'Sample Orthopedic Clinic', specialty: 'Orthopedics', address: '310 Invented Way, Sampletown, CT 00000', distanceMiles: 7.8, rating: 4.6, inNetwork: true, acceptingNewPatients: false, phone: '1-800-000-0006' },
  { id: 'p7', name: 'Dr. Fictional Molars', specialty: 'Dentistry', address: '12 Fabricated Ct, Sampletown, CT 00000', distanceMiles: 2.0, rating: 4.7, inNetwork: true, acceptingNewPatients: true, phone: '1-800-000-0007' },
  { id: 'p8', name: 'Demo Dermatology Partners', specialty: 'Dermatology', address: '400 Imaginary Dr, Testville, CT 00000', distanceMiles: 9.4, rating: 4.4, inNetwork: false, acceptingNewPatients: false, phone: '1-800-000-0008' },
  { id: 'p9', name: 'Dr. Example Heartwell', specialty: 'Cardiology', address: '77 Pretend Pl, Sampletown, CT 00000', distanceMiles: 4.5, rating: 4.9, inNetwork: true, acceptingNewPatients: true, phone: '1-800-000-0009' },
  { id: 'p10', name: 'Sample Bones & Joints', specialty: 'Orthopedics', address: '520 Notreal St, Testville, CT 00000', distanceMiles: 11.2, rating: 4.1, inNetwork: false, acceptingNewPatients: true, phone: '1-800-000-0010' },
]
