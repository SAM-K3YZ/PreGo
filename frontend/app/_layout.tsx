import { useEffect, useState } from 'react';
import { Text, TextInput } from 'react-native';
import { Slot, useRouter, useSegments } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Nunito_700Bold, Nunito_800ExtraBold, Nunito_900Black } from '@expo-google-fonts/nunito';
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useAuthStore } from '../store/useAuthStore';
import { useFontsStore } from '../store/useFontsStore';

// Inter is the app-wide default (body text, form fields, captions) without
// touching every screen: patch the default style RN applies to Text/
// TextInput. RN's type defs don't expose defaultProps, so this goes
// through an `any` cast. Nunito (headings/bold labels/wordmark) is applied
// per-instance by Typo, based on fontWeight — see components/Typo.tsx.
// Must only run once the font has actually finished loading (see the
// fontsLoaded effect below) — patching it eagerly renders Text with a
// font family that isn't registered yet and RN throws for that.
const TextWithDefaults = Text as unknown as { defaultProps?: { style?: unknown } };
const TextInputWithDefaults = TextInput as unknown as { defaultProps?: { style?: unknown } };

SplashScreen.preventAutoHideAsync();

// This is the guard: it runs on every navigation and enforces
// "no authenticated screen renders without a valid session."
export default function RootLayout() {
  const { isAuthenticated, isLoading, hydrate } = useAuthStore();
  const setFontsLoaded = useFontsStore((s) => s.setFontsLoaded);
  const segments = useSegments();
  const router = useRouter();
  const [queryClient] = useState(() => new QueryClient());

  const [fontsLoaded] = useFonts({
    Nunito_700Bold,
    Nunito_800ExtraBold,
    Nunito_900Black,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
  });

  useEffect(() => {
    hydrate();
  }, []);

  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments[0] === '(onboarding)' || segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(onboarding)/splash');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(patient)/home'); // TODO: route by role once role is on the user object
    }
  }, [isAuthenticated, isLoading, segments]);

  useEffect(() => {
    if (!fontsLoaded) return;

    TextWithDefaults.defaultProps = TextWithDefaults.defaultProps || {};
    TextWithDefaults.defaultProps.style = [
      { fontFamily: 'Inter_400Regular' },
      TextWithDefaults.defaultProps.style,
    ];

    TextInputWithDefaults.defaultProps = TextInputWithDefaults.defaultProps || {};
    TextInputWithDefaults.defaultProps.style = [
      { fontFamily: 'Inter_400Regular' },
      TextInputWithDefaults.defaultProps.style,
    ];

    setFontsLoaded(true);
    SplashScreen.hideAsync();
  }, [fontsLoaded, setFontsLoaded]);

  return (
    <QueryClientProvider client={queryClient}>
      <Slot />
    </QueryClientProvider>
  );
}
