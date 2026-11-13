import { useState } from 'react';
import { Alert, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import * as Icon from 'phosphor-react-native';
import { Screen, Input, Button } from '@/components/ui';
import Typo from '@/components/Typo';
import { useTheme } from '@/hooks/useTheme';
import AuthHeader from '@/components/AuthHeader';
import { spacingY, radius } from '@/constants/theme';
import { scale } from '@/utils/styling';
import { authService } from '@/services/authService';
import { getEmailError, normalizeEmail } from '@/utils/validation';
import { getApiErrorMessage } from '@/services/apiError';

export default function ForgotPassword() {
  const theme = useTheme();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = getEmailError(email);
  const isFormValid = email.length > 0 && !emailError;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await authService.forgotPassword(normalizeEmail(email));
      Alert.alert(
        'Check your email',
        'If an account exists for that email, a reset link is on its way.',
        [{ text: 'OK', onPress: () => router.back() }],
      );
    } catch (err) {
      Alert.alert('Something went wrong', getApiErrorMessage(err, 'Please try again in a moment.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        style={{ alignSelf: 'flex-start', marginBottom: spacingY.md }}
      >
        <Icon.ArrowLeftIcon size={scale(22)} color={theme.text.primary} />
      </Pressable>

      <AuthHeader />

      <Typo size={24} color={theme.text.primary} fontWeight="bold" style={{ marginBottom: 4 }}>
        Reset your password
      </Typo>
      <Typo size={14} color={theme.text.secondary} style={{ marginBottom: spacingY.xl }}>
        Enter the email on your account and we&apos;ll send you a link to reset your password.
      </Typo>

      <Input
        label="Email address"
        placeholder="adaeze@email.com"
        leftIcon={Icon.EnvelopeIcon}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        autoComplete="email"
        textContentType="emailAddress"
        value={email}
        onChangeText={setEmail}
        onBlur={() => setEmailTouched(true)}
        errorText={emailTouched ? emailError : undefined}
        containerStyle={{ marginBottom: spacingY.xl }}
      />

      <Button
        title="Send Reset Link"
        onPress={handleSubmit}
        loading={isSubmitting}
        disabled={!isFormValid}
        style={{ borderRadius: radius.full }}
      />
    </Screen>
  );
}
