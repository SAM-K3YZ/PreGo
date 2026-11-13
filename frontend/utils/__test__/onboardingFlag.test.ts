import Storage from 'expo-sqlite/kv-store';
import { isOnboardingCompleted, markOnboardingCompleted } from '@/services/onboardingFlag';

// In-memory stand-in for the SQLite key-value store.
jest.mock('expo-sqlite/kv-store', () => {
  const data = new Map<string, string>();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key: string) => data.get(key) ?? null),
      setItem: jest.fn(async (key: string, value: string) => {
        data.set(key, value);
      }),
      removeItem: jest.fn(async (key: string) => {
        data.delete(key);
      }),
      clear: () => data.clear(),
    },
  };
});

const store = Storage as unknown as {
  getItem: jest.Mock;
  setItem: jest.Mock;
  removeItem: jest.Mock;
  clear: () => void;
};

beforeEach(() => {
  store.clear();
  jest.clearAllMocks();
});

describe('onboardingFlag', () => {
  it('is not completed by default', async () => {
    expect(await isOnboardingCompleted()).toBe(false);
  });

  it('is completed after markOnboardingCompleted()', async () => {
    await markOnboardingCompleted();
    expect(await isOnboardingCompleted()).toBe(true);
    expect(store.setItem).toHaveBeenCalledWith('prego.onboardingCompleted', 'true');
  });

  it('migrates the old prego.hasLaunchedBefore key', async () => {
    await store.setItem('prego.hasLaunchedBefore', 'true');

    expect(await isOnboardingCompleted()).toBe(true);
    expect(await store.getItem('prego.hasLaunchedBefore')).toBeNull();
    expect(await store.getItem('prego.onboardingCompleted')).toBe('true');
  });

  it('keeps the old key if saving the new one fails', async () => {
    await store.setItem('prego.hasLaunchedBefore', 'true');
    store.setItem.mockRejectedValueOnce(new Error('disk full'));

    expect(await isOnboardingCompleted()).toBe(true);
    expect(await store.getItem('prego.hasLaunchedBefore')).toBe('true');
  });

  it('treats a read error as not completed', async () => {
    store.getItem.mockRejectedValueOnce(new Error('storage unavailable'));
    expect(await isOnboardingCompleted()).toBe(false);
  });

  it('markOnboardingCompleted() never throws', async () => {
    store.setItem.mockRejectedValueOnce(new Error('storage unavailable'));
    await expect(markOnboardingCompleted()).resolves.toBeUndefined();
  });
});
