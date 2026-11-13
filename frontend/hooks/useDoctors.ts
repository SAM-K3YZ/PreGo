import { useQuery } from '@tanstack/react-query';
import { getDoctorById, getDoctors } from '@/services/doctors';
import { isValidResourceId } from '@/utils/validation';

export function useDoctors() {
  return useQuery({
    queryKey: ['doctors'],
    queryFn: getDoctors,
  });
}

export function useDoctor(id?: string) {
  return useQuery({
    queryKey: ['doctor', id],
    queryFn: () => getDoctorById(id as string),
    enabled: isValidResourceId(id),
  });
}