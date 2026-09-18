import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import { authService, AuthUser } from '../services/authService';

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  async hydrate() {
    // Called once from the root layout on app boot.
    const token = await SecureStore.getItemAsync('accessToken');
    set({ isAuthenticated: !!token, isLoading: false });
  },

  async signIn(email, password) {
    const user = await authService.signIn({ email, password });
    set({ user, isAuthenticated: true });
    return user;
  },

  async signOut() {
    await authService.signOut();
    set({ user: null, isAuthenticated: false });
  },
}));
