import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '@/services/profile';
import { useAuthStore } from '@/store/useAuthStore';
import type { Hospital, ProfileDetails } from '@/types';

export function useProfile() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const queryKey = ['profile', userId];

  return useQuery({
    queryKey,
    // Keep hospitals linked this session (memory only) across refreshes until the
    // profile API exists; otherwise a refetch of the dummy data would drop them.
    queryFn: async () => {
      const remote = await getProfile();
      const previous = queryClient.getQueryData<ProfileDetails>(queryKey)?.hospitals ?? [];
      const known = new Set(remote.hospitals.map((h) => h.id));
      return { ...remote, hospitals: [...remote.hospitals, ...previous.filter((h) => !known.has(h.id))] };
    },
    enabled: !!userId,
  });
}

// Links a hospital to the profile in the cache (memory only) until the links API exists.
export function useLinkHospital() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  return (hospital: Hospital) =>
    queryClient.setQueryData<ProfileDetails>(['profile', userId], (prev) =>
      prev && !prev.hospitals.some((h) => h.id === hospital.id)
        ? { ...prev, hospitals: [...prev.hospitals, hospital] }
        : prev,
    );
}
