import { useState } from 'react';
import { Alert, Pressable, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EnvelopeIcon } from 'phosphor-react-native';
import { useAuthStore } from '../../store/useAuthStore';
import { Screen, Input, Button } from '@/components/ui';
import Typo from '@/components/Typo';
import AuthHeader from '@/components/AuthHeader';
import GoogleLogo from '@/components/GoogleLogo';
import { lightTheme, spacingX, spacingY, radius } from '@/constants/theme';
import { getEmailError } from '@/utils/validation';
import { getApiErrorMessage } from '@/utils/apiError';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const signIn = useAuthStore((s) => s.signIn);

  const emailError = getEmailError(email);
  const isFormValid = email.length > 0 && !emailError && password.length > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      Alert.alert(
        'Sign in failed',
        getApiErrorMessage(err, 'Check your email and password and try again.'),
      );
    } finally {
      setPassword('');
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Coming soon', 'Google sign-in isn’t set up yet.');
  };

  return (
    <Screen scroll>
      <AuthHeader />

      <Typo size={24} color={lightTheme.text.primary} fontWeight="bold" style={{ marginBottom: 4 }}>
        Welcome back
      </Typo>
      <Typo size={14} color={lightTheme.text.secondary} style={{ marginBottom: spacingY.xl }}>
        Sign in to continue your journey
      </Typo>

      <Input
        label="Email address"
        placeholder="adaeze@email.com"
        leftIcon={EnvelopeIcon}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setEmailTouched(true)}
        errorText={emailTouched ? emailError : undefined}
        containerStyle={{ marginBottom: spacingY.lg }}
      />
      <Input
        label="Password"
        placeholder="••••••••"
        secureTextEntry
        keyboardType="default"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="password"
        textContentType="password"
        value={password}
        onChangeText={setPassword}
        containerStyle={{ marginBottom: spacingY.sm }}
      />

      <Pressable
        onPress={() => router.push('/(auth)/forgot-password')}
        style={{ alignSelf: 'flex-end', marginBottom: spacingY.lg }}
      >
        <Typo size={13} fontWeight="600" color={lightTheme.accent.default}>
          Forgot password?
        </Typo>
      </Pressable>

      <Button
        title="Sign In"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={!isFormValid}
        style={{ borderRadius: radius.full }}
      />

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: spacingY.xl,
        }}
      >
        <View style={{ flex: 1, height: 1, backgroundColor: lightTheme.border }} />
        <Typo
          size={13}
          color={lightTheme.text.secondary}
          style={{ marginHorizontal: spacingX.md }}
        >
          or continue with
        </Typo>
        <View style={{ flex: 1, height: 1, backgroundColor: lightTheme.border }} />
      </View>

      <Pressable
        onPress={handleGoogleSignIn}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: spacingX.sm,
          borderWidth: 1,
          borderColor: lightTheme.border,
          borderRadius: radius.full,
          paddingVertical: spacingY.md,
          backgroundColor: lightTheme.background.card,
        }}
      >
        <GoogleLogo size={18} />
        <Typo size={15} fontWeight="600" color={lightTheme.text.primary}>
          Continue with Google
        </Typo>
      </Pressable>

      <Pressable
        onPress={() => router.push('/(auth)/sign-up')}
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: spacingY.xl,
        }}
      >
        <Typo size={14} color={lightTheme.text.secondary}>
          New to PREGO?{' '}
        </Typo>
        <Typo size={14} fontWeight="700" color={lightTheme.accent.default}>
          Create account
        </Typo>
      </Pressable>
    </Screen>
  );
}
