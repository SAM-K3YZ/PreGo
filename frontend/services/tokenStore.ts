import * as SecureStore from 'expo-secure-store';
import type { AuthUser } from '@/types';

const ACCESS = 'accessToken';
const REFRESH = 'refreshToken';
const USER = 'authUser';
const WRITE_OPTS: SecureStore.SecureStoreOptions = {
  // Never synced to iCloud/backups or restored onto another device.
  keychainAccessible: SecureStore.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
};

let accessCache: string | null | undefined; // undefined = not loaded yet

export const tokenStore = {
  async getAccess(): Promise<string | null> {
    if (accessCache === undefined) accessCache = await SecureStore.getItemAsync(ACCESS);
    return accessCache;
  },
  getRefresh: () => SecureStore.getItemAsync(REFRESH),
  async set(access: string, refresh: string) {
    // Refresh first: if we die between writes, the old access token just expires
    // and the new refresh token recovers the session.
    await SecureStore.setItemAsync(REFRESH, refresh, WRITE_OPTS);
    await SecureStore.setItemAsync(ACCESS, access, WRITE_OPTS);
    accessCache = access;
  },
  // The signed-in user, so query keys stay scoped to them across restarts.
  setUser: (user: AuthUser) => SecureStore.setItemAsync(USER, JSON.stringify(user), WRITE_OPTS),
  async getUser(): Promise<AuthUser | null> {
    try {
      const raw = await SecureStore.getItemAsync(USER);
      const user = raw ? (JSON.parse(raw) as Partial<AuthUser>) : null;
      return user?.id && user.role && user.email ? (user as AuthUser) : null;
    } catch {
      return null;
    }
  },
  async clear() {
    accessCache = null;
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS),
      SecureStore.deleteItemAsync(REFRESH),
      SecureStore.deleteItemAsync(USER),
    ]);
  },
};