import * as Location from 'expo-location';
import { ensurePermission } from '@/services/permissions';
import type { Coordinates } from '@/types';

/**
 * Approximate position for "near you" features. Low accuracy is enough to find
 * nearby hospitals and avoids collecting precise location. Null if not allowed.
 */
export async function getApproximateLocation(): Promise<Coordinates | null> {
  if (!(await ensurePermission('location'))) return null;
  const { coords } = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Low,
  });
  return { latitude: coords.latitude, longitude: coords.longitude };
}
