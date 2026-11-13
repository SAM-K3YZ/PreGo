import axios from 'axios';
import type { ServerErrorBody } from '@/types';

const FALLBACK: Record<number, string> = {
  400: 'Something was wrong with that request.',
  401: 'Please sign in again.',
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: 'That conflicts with an existing record.',
  429: 'Too many attempts. Please wait a moment and try again.',
};

// Deliberately does NOT keep config, headers, request or response, so it can be
// logged or sent to Sentry without leaking tokens or health data.
export class ApiError extends Error {
  readonly status?: number;
  readonly code: string;
  readonly requestId?: string;
  readonly isNetwork: boolean;

  constructor(init: { message: string; code: string; status?: number; requestId?: string; isNetwork: boolean }) {
    super(init.message);
    this.name = 'ApiError';
    this.status = init.status;
    this.code = init.code;
    this.requestId = init.requestId;
    this.isNetwork = init.isNetwork;
  }

  get retryable() {
    return this.isNetwork || this.status === 408 || this.status === 429 || (this.status ?? 0) >= 500;
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super('SESSION_EXPIRED');
    this.name = 'SessionExpiredError';
  }
}

export function toApiError(err: unknown): ApiError {
  if (err instanceof ApiError) return err;
  if (axios.isAxiosError(err)) {
    const body = err.response?.data as ServerErrorBody | undefined;
    const status = err.response?.status;
    const isNetwork = !err.response;
    return new ApiError({
      status,
      isNetwork,
      code: body?.code ?? (isNetwork ? (err.code === 'ECONNABORTED' ? 'TIMEOUT' : 'NETWORK') : 'UNKNOWN'),
      requestId: body?.requestId ?? (err.response?.headers?.['x-request-id'] as string | undefined),
      message: isNetwork
        ? "Can't reach the server. Check your connection and try again."
        : (status ?? 0) >= 500
          ? 'Something went wrong on our side. Please try again.'
          : (body?.message ?? body?.error ?? FALLBACK[status ?? 0] ?? 'Something went wrong.'),
    });
  }
  return new ApiError({ code: 'UNKNOWN', isNetwork: false, message: 'Something went wrong.' });
}

// User-facing message for any error thrown by apiClient or a service.
export function getApiErrorMessage(err: unknown, fallbackMessage: string): string {
  if (err instanceof ApiError || axios.isAxiosError(err)) return toApiError(err).message;
  return fallbackMessage;
}