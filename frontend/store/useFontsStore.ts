import { create } from 'zustand';
import type { FontsState } from '@/types';

export const useFontsStore = create<FontsState>((set) => ({
  fontsLoaded: false,
  setFontsLoaded: (loaded) => set({ fontsLoaded: loaded }),
}));
