import type { Hospital } from '@/types';

// Temporary records until the hospitals API (ENDPOINTS.HOSPITALS.LIST) is connected.
const HOSPITALS: Hospital[] = [
  {
    id: 'lagos-island-general',
    name: 'Lagos Island General Hospital',
    shortName: 'Lagos Island',
    location: 'Lagos Island, Lagos',
  },
  {
    id: 'luth',
    name: 'Lagos University Teaching Hospital',
    shortName: 'LUTH',
    location: 'Idi-Araba, Lagos',
  },
  {
    id: 'reddington',
    name: 'Reddington Hospital',
    shortName: 'Reddington',
    location: 'Victoria Island, Lagos',
  },
  { id: 'eko', name: 'Eko Hospital', shortName: 'Eko', location: 'Ikeja, Lagos' },
];

export async function getHospitals(): Promise<Hospital[]> {
  return HOSPITALS;
}
