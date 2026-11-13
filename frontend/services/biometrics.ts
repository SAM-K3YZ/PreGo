import { Platform } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import type { AppLockSupport } from '@/types';

const { AuthenticationType, SecurityLevel } = LocalAuthentication;

/** Whether the device can lock the app (biometrics or at least a passcode), and what to call it. */
export async function getAppLockSupport(): Promise<AppLockSupport> {
  const [hasHardware, level, types] = await Promise.all([
    LocalAuthentication.hasHardwareAsync(),
    LocalAuthentication.getEnrolledLevelAsync(),
    LocalAuthentication.supportedAuthenticationTypesAsync(),
  ]);

  const enrolledBiometrics = hasHardware && level >= SecurityLevel.BIOMETRIC_WEAK;
  let label = 'Passcode';
  if (enrolledBiometrics && types.includes(AuthenticationType.FACIAL_RECOGNITION)) {
    label = Platform.OS === 'ios' ? 'Face ID' : 'Face unlock';
  } else if (enrolledBiometrics && types.includes(AuthenticationType.FINGERPRINT)) {
    label = Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
  }

  return { available: level > SecurityLevel.NONE, label };
}

/** Face ID / fingerprint, falling back to the device passcode. */
export async function authenticate(promptMessage: string): Promise<boolean> {
  try {
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage,
      cancelLabel: 'Cancel',
      fallbackLabel: 'Use passcode',
      disableDeviceFallback: false,
    });
    return result.success;
  } catch {
    return false;
  }
}
