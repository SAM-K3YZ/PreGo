import { useRouter } from 'expo-router';
import { BabyIcon } from 'phosphor-react-native';
import { Screen, Button } from '@/components/ui';
import Typo from '@/components/Typo';
import { lightTheme, spacingY } from '@/constants/theme';
import { scale } from '@/utils/styling';

// Shown to devices that have opened the app before but currently have no
// session (signed out, expired token, etc.) — splash sends first-time /
// post-uninstall launches straight to sign-up instead of here.
export default function Welcome() {
  const router = useRouter();

  return (
    <Screen center>
      <BabyIcon size={scale(72)} color={lightTheme.accent.default} weight="duotone" />

      <Typo
        size={30}
        fontWeight={'semibold'}
        style={{ marginTop: spacingY.lg, marginBottom: spacingY.sm }}
      >
        Welcome to Prego
      </Typo>
      <Typo
        size={15}
        color={lightTheme.text.secondary}
        style={{ textAlign: 'center', marginBottom: spacingY.xxxl }}
      >
        Sign in to pick up where you left off, or create an account to get started.
      </Typo>

      <Button
        title="Sign In"
        onPress={() => router.push('/(auth)/sign-in')}
        style={{ width: '100%', marginBottom: spacingY.md }}
      />
      <Button
        title="Create Account"
        variant="outline"
        onPress={() => router.push('/(onboarding)/onboarding')}
        style={{ width: '100%' }}
      />
    </Screen>
  );
}
