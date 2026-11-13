import { create } from 'zustand';
import Storage from 'expo-sqlite/kv-store';
import { authService } from '@/services/authService';
import { tokenStore } from '@/services/tokenStore';
import { useAppLockStore } from '@/store/useAppLockStore';
import type { AuthState } from '@/types';

// Lives in app storage (wiped on uninstall), unlike the Keychain.
const INSTALLED_FLAG = 'prego.installed';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  async hydrate() {
    // Called once from the root layout on app boot.
    try {
      // First launch after install: iOS Keychain can outlive an uninstall, so
      // drop any tokens left over from a previous install.
      if (!(await Storage.getItem(INSTALLED_FLAG))) {
        await tokenStore.clear();
        await Storage.setItem(INSTALLED_FLAG, '1');
      }
      const [token, user] = await Promise.all([tokenStore.getAccess(), tokenStore.getUser()]);
      if (token && !user) {
        // Session from before the user was stored: sign in again so cached data
        // can be scoped to a known account.
        await tokenStore.clear();
      }
      const isAuthenticated = !!token && !!user;
      set({ user: isAuthenticated ? user : null, isAuthenticated, isLoading: false });
    } catch {
      // Storage unavailable: show the signed-out flow rather than a blank app.
      // Tokens are left in place, so the next launch can still restore the session.
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  async signIn(email, password) {
    const user = await authService.signIn({ email, password });
    set({ user, isAuthenticated: true });
    return user;
  },

  async signOut() {
    await authService.signOut();
    await useAppLockStore.getState().reset().catch(() => {});
    set({ user: null, isAuthenticated: false });
  },

  // Tokens are already cleared by the time this runs.
  clearSession() {
    useAppLockStore.getState().reset().catch(() => {});
    set({ user: null, isAuthenticated: false });
  },
}));
