import Constants from 'expo-constants';

const raw = (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;

function resolveApiUrl(): string {
  if (!raw) {
    throw new Error(
      '[env] API_URL is not set. Copy frontend/.env.example to frontend/.env, set API_URL, then restart with `npx expo start -c`.',
    );
  }
  const url = raw.replace(/\/+$/, '');
  if (!__DEV__ && !url.startsWith('https://')) {
    throw new Error('[env] Production builds require an https:// API URL');
  }
  return url; // e.g. https://api.example.com/v1  (version in the path)
}

export const API_URL = resolveApiUrl();