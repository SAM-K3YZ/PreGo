import { useQuery } from '@tanstack/react-query';
import { getHospitals } from '@/services/hospitals';

export function useHospitals() {
  return useQuery({
    queryKey: ['hospitals'],
    queryFn: getHospitals,
  });
}
