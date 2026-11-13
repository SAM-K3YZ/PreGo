import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

export const REMINDERS_CHANNEL_ID = 'reminders';

// Configures how notifications show; requests nothing. Called once at startup.
export function configureNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
}

export async function ensureNotificationChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(REMINDERS_CHANNEL_ID, {
    name: 'Reminders',
    description: 'Appointment, medication and weekly pregnancy reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  });
}
