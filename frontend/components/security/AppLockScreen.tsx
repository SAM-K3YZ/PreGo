import { useEffect, useRef, useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { Button } from '@/components/ui';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { authenticate, getAppLockSupport } from '@/services/biometrics';
import { scale } from '@/utils/styling';
import type { AppLockScreenProps } from '@/types';

// Covers everything (including other modals) until the user authenticates.
export default function AppLockScreen({ visible, ready, onUnlock, onLogOut }: AppLockScreenProps) {
  const theme = useTheme();
  const [label, setLabel] = useState('Unlock');
  const [busy, setBusy] = useState(false);
  // Only one Face ID / passcode prompt at a time (auto prompt or the button).
  const inFlight = useRef(false);

  const runAuth = async () => {
    inFlight.current = true;
    try {
      return await authenticate('Unlock PREGO');
    } finally {
      inFlight.current = false;
    }
  };

  const unlock = async () => {
    if (inFlight.current) return;
    setBusy(true);
    const ok = await runAuth();
    setBusy(false);
    if (ok) onUnlock();
  };

  // Prompt straight away when the lock appears, like banking apps.
  useEffect(() => {
    if (!visible || !ready) return;
    let cancelled = false;
    getAppLockSupport()
      .then((support) => !cancelled && setLabel(`Unlock with ${support.label}`))
      .catch(() => {});
    if (!inFlight.current) {
      runAuth().then((ok) => {
        if (!cancelled && ok) onUnlock();
      });
    }
    return () => {
      cancelled = true;
    };
  }, [visible, ready, onUnlock]);

  return (
    <Modal visible={visible} animationType="none" statusBarTranslucent onRequestClose={() => {}}>
      <View style={[styles.root, { backgroundColor: theme.background.app }]}>
        {ready && (
          <>
            <View style={[styles.icon, { backgroundColor: theme.accent.soft }]}>
              <Icon.LockKeyIcon size={scale(32)} color={theme.accent.pressed} weight="bold" />
            </View>
            <Typo size={22} fontWeight="700" color={theme.text.primary}>
              PREGO is locked
            </Typo>
            <Typo size={14} color={theme.text.secondary} style={styles.message}>
              Unlock to see your pregnancy records.
            </Typo>
            <Button title={label} onPress={unlock} loading={busy} style={styles.button} />
            <Button title="Log out" variant="ghost" onPress={onLogOut} />
          </>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingY.md,
    paddingHorizontal: spacingX.xxl,
  },
  icon: {
    width: scale(72),
    height: scale(72),
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacingY.sm,
  },
  message: {
    textAlign: 'center',
  },
  button: {
    alignSelf: 'stretch',
    marginTop: spacingY.lg,
  },
});
