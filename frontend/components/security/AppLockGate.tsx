import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import AppLockScreen from '@/components/security/AppLockScreen';
import { useAppLockStore } from '@/store/useAppLockStore';
import { useAuthStore } from '@/store/useAuthStore';

// Long enough to return from the camera or a file picker without relocking.
const RELOCK_AFTER_MS = 60_000;

export default function AppLockGate() {
  const { ready, enabled, locked, hydrate, lock, unlock } = useAppLockStore();
  const signOut = useAuthStore((s) => s.signOut);
  const backgroundedAt = useRef<number | null>(null);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!enabled) return;
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'background') {
        backgroundedAt.current = Date.now();
      } else if (state === 'active' && backgroundedAt.current !== null) {
        if (Date.now() - backgroundedAt.current >= RELOCK_AFTER_MS) lock();
        backgroundedAt.current = null;
      }
    });
    return () => subscription.remove();
  }, [enabled, lock]);

  return (
    <AppLockScreen
      visible={!ready || locked}
      ready={ready}
      onUnlock={unlock}
      onLogOut={() => signOut()}
    />
  );
}
