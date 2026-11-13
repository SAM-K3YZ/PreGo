import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from '@/constants/theme';
import type { Theme } from '@/types';

export function useTheme(overridePreference?: 'light' | 'dark'): Theme {
  const systemScheme = useColorScheme();
  const scheme = overridePreference || systemScheme;
  return scheme === 'dark' ? darkTheme : lightTheme;
}
