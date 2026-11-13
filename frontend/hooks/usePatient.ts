import { useQuery } from '@tanstack/react-query';
import { getMyPatientProfile } from '@/services/patients';
import { useAuthStore } from '@/store/useAuthStore';

export function usePatient() {
  const userId = useAuthStore((s) => s.user?.id);
  return useQuery({
    queryKey: ['patient-me', userId],
    queryFn: getMyPatientProfile,
    enabled: !!userId,
  });
}
