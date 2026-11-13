import type { Doctor } from '@/types';

const DOCTORS: Doctor[] = [
  {
    id: 'doctor-1',
    name: 'Dr. Amaka Obi',
    department: 'Obstetrics & Gynaecology',
    fee: 15000,
    rating: 4.2,
    hospital: 'Lagos University Teaching Hospital',
  },
  {
    id: 'doctor-2',
    name: 'Dr. Tunde Adeyemi',
    department: 'Maternal-Fetal Medicine',
    fee: 18000,
    rating: 4.8,
    hospital: 'LUTH',
  },
  {
    id: 'doctor-3',
    name: 'Dr. Zainab Musa',
    department: 'Antenatal Care',
    fee: 12500,
    rating: 3.4,
    hospital: 'National Hospital Abuja',
  },
  {
    id: 'doctor-4',
    name: 'Dr. Chidi Okafor',
    department: 'Obstetrics & Gynaecology',
    fee: 20000,
    rating: 5,
    hospital: 'University of Nigeria Teaching Hospital',
  },
  {
    id: 'doctor-5',
    name: 'Dr. Funmi Bello',
    department: 'Maternal Health',
    fee: 10000,
    hospital: 'Lagos State University Teaching Hospital',
  },
];

export async function getDoctors(): Promise<Doctor[]> {
  return DOCTORS;
}

// When this calls the API, build the path with encodeURIComponent(id).
export async function getDoctorById(id: string): Promise<Doctor | null> {
  return DOCTORS.find((d) => d.id === id) ?? null;
}
