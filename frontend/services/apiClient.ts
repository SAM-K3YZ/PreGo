import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import * as Crypto from 'expo-crypto';
import { z } from 'zod';
import { API_URL } from '@/config/env';
import { tokenStore } from '@/services/tokenStore';
import { SessionExpiredError, toApiError } from '@/services/apiError';
import type { RetriableConfig } from '@/types';

// The ONLY app-facing axios instance. Screens never call axios/fetch directly.
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'X-App-Version': Constants.expoConfig?.version ?? 'unknown' },
});

// Separate, interceptor-free client for the refresh call, with its own timeout.
const refreshClient = axios.create({ baseURL: API_URL, timeout: 10000 });

const RefreshResponse = z.object({ accessToken: z.string().min(1), refreshToken: z.string().min(1).optional() });

// A 401 from these means "bad credentials", not "expired session". Never refresh for them.
const AUTH_PATHS = ['/auth/login', '/auth/signup', '/auth/register', '/auth/refresh', '/auth/logout', '/auth/verify-otp', '/auth/forgot-password'];
const isAuthPath = (url?: string) => !!url && AUTH_PATHS.some((p) => url.startsWith(p));

// Only ever attach the token to our own API.
const isAbsolute = (url?: string) => !!url && /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
const targetsApi = (url?: string) => !isAbsolute(url) || (url as string).startsWith(`${API_URL}/`);

// Registered once by the root layout (avoids an import cycle with the auth store).
let onSessionExpired: () => void = () => {};
export const setSessionExpiredHandler = (handler: () => void) => {
  onSessionExpired = handler;
};

apiClient.interceptors.request.use(async (config) => {
  config.headers.set('X-Request-Id', Crypto.randomUUID()); // support can trace a user's failure
  if (targetsApi(config.url)) {
    const token = await tokenStore.getAccess();
    if (token) config.headers.set('Authorization', `Bearer ${token}`);
  }
  return config;
});

// ── single-flight refresh ────────────────────────────────────────────────
let refreshInFlight: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await tokenStore.getRefresh();
  if (!refreshToken) throw new SessionExpiredError();
  try {
    const { data } = await refreshClient.post('/auth/refresh', { refreshToken });
    const parsed = RefreshResponse.parse(data);
    await tokenStore.set(parsed.accessToken, parsed.refreshToken ?? refreshToken);
    return parsed.accessToken;
  } catch (err) {
    const status = (err as AxiosError).response?.status;
    if (status === 400 || status === 401 || status === 403) {
      await tokenStore.clear(); // the server says this session is dead
      throw new SessionExpiredError();
    }
    throw err; // offline / timeout / 5xx: keep the session and let the caller retry later
  }
}

function getFreshToken(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = refreshAccessToken().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

async function getValidToken(usedToken: string | null): Promise<string> {
  const current = await tokenStore.getAccess();
  if (current && current !== usedToken) return current; // another request already refreshed
  return getFreshToken();
}

const bearerOf = (cfg: InternalAxiosRequestConfig) =>
  String(cfg.headers.get('Authorization') ?? '').replace(/^Bearer /, '') || null;

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetriableConfig | undefined;

    if (!original || error.response?.status !== 401 || original._retry || isAuthPath(original.url)) {
      throw toApiError(error);
    }

    original._retry = true; // set for every waiter, not just the first

    try {
      await getValidToken(bearerOf(original));
    } catch (e) {
      if (e instanceof SessionExpiredError) {
        onSessionExpired();
        throw e;
      }
      throw toApiError(e);
    }

    return apiClient(original); // the request interceptor attaches the fresh token
  },
);

export default apiClient;