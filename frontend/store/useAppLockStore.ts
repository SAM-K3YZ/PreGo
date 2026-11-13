import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import type { AppLockState } from '@/types';

const ENABLED_KEY = 'appLockEnabled';
const WRITE_OPTS: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

export const useAppLockStore = create<AppLockState>((set) => ({
  ready: false,
  enabled: false,
  locked: false,

  async hydrate() {
    try {
      const enabled = (await SecureStore.getItemAsync(ENABLED_KEY)) === 'true';
      set({ enabled, locked: enabled, ready: true }); // cold start opens locked
    } catch {
      // Can't tell whether the lock is on: fail closed. The lock screen still
      // offers Face ID / passcode and Log out, so nobody is stuck.
      set({ enabled: true, locked: true, ready: true });
    }
  },

  async setEnabled(enabled) {
    if (enabled) await SecureStore.setItemAsync(ENABLED_KEY, 'true', WRITE_OPTS);
    else await SecureStore.deleteItemAsync(ENABLED_KEY);
    set({ enabled, locked: false });
  },

  lock() {
    set((state) => ({ locked: state.enabled }));
  },

  unlock() {
    set({ locked: false });
  },

  // On sign-out: the next account on this device starts without a lock.
  async reset() {
    await SecureStore.deleteItemAsync(ENABLED_KEY);
    set({ enabled: false, locked: false });
  },
}));
