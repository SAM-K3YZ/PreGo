import { create } from 'zustand';
import type { GalleryUiState } from '@/types';

// The Gallery's active tab, shared with the Add to Gallery screen so that after
// adding a file the Gallery opens on the category it was added to.
export const useGalleryUiStore = create<GalleryUiState>((set) => ({
  category: 'ultrasound',
  setCategory: (category) => set({ category }),
}));
