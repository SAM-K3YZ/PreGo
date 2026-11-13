import Storage from 'expo-sqlite/kv-store';

// App storage (wiped on uninstall), never SecureStore: the iOS Keychain survives
// an uninstall, which would make a reinstall skip onboarding.
const ONBOARDING_COMPLETED_KEY = 'prego.onboardingCompleted';
// Set by older builds on first launch; treated as "completed" and migrated.
const LEGACY_KEY = 'prego.hasLaunchedBefore';

/** True once the user has finished onboarding on this install. Read errors count as "not completed". */
export async function isOnboardingCompleted(): Promise<boolean> {
  try {
    if (await Storage.getItem(ONBOARDING_COMPLETED_KEY)) return true;
    if (!(await Storage.getItem(LEGACY_KEY))) return false;
  } catch {
    return false; // show onboarding rather than getting stuck
  }

  // Migrate the legacy key. Only drop it once the new key is saved, so a failed
  // write is retried next launch instead of losing the flag.
  try {
    await Storage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
    await Storage.removeItem(LEGACY_KEY);
  } catch {
    // Still completed for this launch; the migration runs again next time.
  }
  return true;
}

/** Records that onboarding is done. Never throws. */
export async function markOnboardingCompleted(): Promise<void> {
  try {
    await Storage.setItem(ONBOARDING_COMPLETED_KEY, 'true');
  } catch {
    // Worst case the user sees onboarding once more on the next launch.
  }
}
