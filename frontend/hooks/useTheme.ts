import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, Theme } from '../constants/theme';

export function useTheme(overridePreference?: 'light' | 'dark'): Theme {
  const systemScheme = useColorScheme();
  const scheme = overridePreference || systemScheme;
  return scheme === 'dark' ? darkTheme : lightTheme;
}
