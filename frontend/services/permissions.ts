import { Alert, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { ensureNotificationChannel } from '@/services/notifications';
import type { PermissionKind, PermissionResult } from '@/types';

// Asked just in time, from the feature that needs it — never at launch.
const SETTINGS_COPY: Record<PermissionKind, { title: string; message: string }> = {
  camera: {
    title: 'Camera access is off',
    message: 'To take photos for your gallery, allow camera access for PREGO in Settings.',
  },
  location: {
    title: 'Location access is off',
    message: 'To find hospitals near you, allow location access for PREGO in Settings.',
  },
  notifications: {
    title: 'Notifications are off',
    message: 'To get reminders, allow notifications for PREGO in Settings.',
  },
};

const REQUESTS: Record<
  PermissionKind,
  { get: () => Promise<PermissionResult>; request: () => Promise<PermissionResult> }
> = {
  camera: {
    get: ImagePicker.getCameraPermissionsAsync,
    request: ImagePicker.requestCameraPermissionsAsync,
  },
  location: {
    get: Location.getForegroundPermissionsAsync,
    request: Location.requestForegroundPermissionsAsync,
  },
  notifications: {
    get: Notifications.getPermissionsAsync,
    request: async () => {
      await ensureNotificationChannel(); // Android 13+ only prompts once a channel exists
      return Notifications.requestPermissionsAsync();
    },
  },
};

const promptOpenSettings = (kind: PermissionKind) => {
  const { title, message } = SETTINGS_COPY[kind];
  Alert.alert(title, message, [
    { text: 'Not now', style: 'cancel' },
    { text: 'Open Settings', onPress: () => Linking.openSettings() },
  ]);
};

/**
 * Resolves true when the permission is granted. Shows the system prompt if it
 * can; if the user previously chose "don't ask again", offers Settings instead.
 */
export async function ensurePermission(kind: PermissionKind): Promise<boolean> {
  const { get, request } = REQUESTS[kind];
  const current = await get();
  if (current.granted) return true;
  if (current.canAskAgain) return (await request()).granted;
  promptOpenSettings(kind);
  return false;
}
