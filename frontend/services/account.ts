// Data export and account deletion (NDPA access and erasure rights).
// The backend has no endpoints for these yet, so both fail with a clear message
// instead of pretending to work. Replace the bodies with apiClient calls once
// the endpoints exist; the Profile screen already handles success and errors.

export const ACCOUNT_ACTION_UNAVAILABLE =
  "This isn't available in the app yet. We're working on it.";

export async function requestDataExport(): Promise<void> {
  throw new Error(ACCOUNT_ACTION_UNAVAILABLE);
}

export async function deleteAccount(): Promise<void> {
  throw new Error(ACCOUNT_ACTION_UNAVAILABLE);
}
