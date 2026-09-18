import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

// This is the ONLY axios instance in the app. Every service file (authService,
// logService, doctorService, etc.) imports and uses THIS client — never call
// axios/fetch directly from a screen or component.

const apiUrl = (Constants.expoConfig?.extra as { apiUrl: string })?.apiUrl;

// Passwords, tokens, and health data all travel over this client — plain
// HTTP outside of local dev means they'd go over the wire unencrypted.
if (!__DEV__ && !apiUrl?.startsWith('https://')) {
  console.warn(
    `[apiClient] API_URL ("${apiUrl}") is not HTTPS in a production build. ` +
      'Set API_URL to an https:// endpoint before shipping.',
  );
}

const apiClient = axios.create({
  baseURL: apiUrl,
  timeout: 15000,
});

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Attach the access token to every outgoing request.
apiClient.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a request comes back 401, try ONE silent refresh, then retry the request.
// If the refresh itself fails, clear tokens and let the auth store redirect to sign-in.
let isRefreshing = false;
let pendingQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  pendingQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token as string)));
  pendingQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetriableConfig;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await SecureStore.getItemAsync('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available. Please sign in again.');
      }

      const { data } = await axios.post(
        `${(Constants.expoConfig?.extra as { apiUrl: string })?.apiUrl}/auth/refresh`,
        { refreshToken },
      );

      await SecureStore.setItemAsync('accessToken', data.accessToken);
      await SecureStore.setItemAsync('refreshToken', data.refreshToken ?? refreshToken);

      processQueue(null, data.accessToken);
      originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      return apiClient(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      await SecureStore.deleteItemAsync('accessToken');
      await SecureStore.deleteItemAsync('refreshToken');
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default apiClient;
