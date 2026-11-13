import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getGalleryItems } from '@/services/gallery';
import { useAuthStore } from '@/store/useAuthStore';
import type { GalleryItem } from '@/types';

const isLocal = (item: GalleryItem) => item.id.startsWith('local-');

export function useGallery() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  const queryKey = ['gallery', userId];

  return useQuery({
    queryKey,
    // Keep files added this session (memory only) across refreshes until uploads exist.
    queryFn: async () => {
      const remote = await getGalleryItems();
      const local = (queryClient.getQueryData<GalleryItem[]>(queryKey) ?? []).filter(isLocal);
      return [...local, ...remote];
    },
    enabled: !!userId,
  });
}

// Adds a picked file to this session's gallery (memory only, cleared on logout)
// until uploads exist.
export function useAddGalleryItem() {
  const userId = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();
  return (item: GalleryItem) =>
    queryClient.setQueryData<GalleryItem[]>(['gallery', userId], (prev = []) => [item, ...prev]);
}
