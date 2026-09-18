import { create } from 'zustand';

interface FontsState {
  fontsLoaded: boolean;
  setFontsLoaded: (loaded: boolean) => void;
}

export const useFontsStore = create<FontsState>((set) => ({
  fontsLoaded: false,
  setFontsLoaded: (loaded) => set({ fontsLoaded: loaded }),
}));
