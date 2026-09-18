import axios from 'axios';

// The backend consistently responds with { error: string } on failure
// (see auth.controller.ts, validateRequest.ts, and the central error
// handler in server.ts) — pull that through instead of a generic message
// whenever it's available, so e.g. "An account with this email already
// exists" reaches the user instead of "check your details".
export function getApiErrorMessage(err: unknown, fallbackMessage: string): string {
  if (axios.isAxiosError(err)) {
    if (!err.response) {
      return 'Can’t reach the server. Check your internet connection and that the server is running, then try again.';
    }
    const data = err.response.data as { error?: string } | undefined;
    if (data?.error) return data.error;
  }
  return fallbackMessage;
}
