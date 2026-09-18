import { useState } from 'react';
import { Alert, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { EnvelopeIcon, UserIcon } from 'phosphor-react-native';
import { Button, Input, PhoneInput, Screen } from '@/components/ui';
import Typo from '@/components/Typo';
import AuthHeader from '@/components/AuthHeader';
import { lightTheme, spacingX, spacingY, radius } from '@/constants/theme';
import { authService } from '@/services/authService';
import { SignUpRole } from '@/types';
import { defaultCountry, Country } from '@/constants/countries';
import { getEmailError, getPasswordError } from '@/utils/validation';
import { getApiErrorMessage } from '@/utils/apiError';

export default function SignUp() {
  const router = useRouter();
  const [role, setRole] = useState<SignUpRole>('patient');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [phone, setPhone] = useState('');
  const [phoneCountry, setPhoneCountry] = useState<Country>(defaultCountry);
  const [password, setPassword] = useState('');
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [hospitalName, setHospitalName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emailError = getEmailError(email);
  const passwordError = getPasswordError(password);

  const isFormValid =
    fullName.trim().length > 0 &&
    email.length > 0 &&
    !emailError &&
    phone.trim().length > 0 &&
    password.length > 0 &&
    !passwordError &&
    (role === 'patient' ||
      (licenseNumber.trim().length > 0 &&
        specialty.trim().length > 0 &&
        hospitalName.trim().length > 0));

  const handleSubmit = async () => {
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      await authService.signUp({
        email,
        password,
        role,
        fullName,
        phone: `${phoneCountry.dialCode}${phone}`,
        ...(role === 'doctor' ? { licenseNumber, specialty, hospitalName } : {}),
      });
      router.push('/(auth)/verify-otp');
    } catch (err) {
      Alert.alert('Sign up failed', getApiErrorMessage(err, 'Please check your details and try again.'));
    } finally {
      // Don't let the password linger in memory/state longer than the
      // single request that needed it — regardless of outcome.
      setPassword('');
      setPasswordTouched(false);
      setIsSubmitting(false);
    }
  };

  return (
    <Screen scroll>
      <AuthHeader />

      {/* middle */}
      <View>
        <Typo
          size={24}
          color={lightTheme.text.primary}
          fontWeight="bold"
          style={{ marginBottom: 4 }}
        >
          Create your account
        </Typo>
        <Typo size={14} color={lightTheme.text.secondary} style={{ marginBottom: spacingY.xl }}>
          Join 12,000+ women on their pregnancy journey
        </Typo>

        <View style={styles.roleToggle}>
          <Pressable
            style={[styles.roleOption, role === 'patient' && styles.roleOptionActive]}
            onPress={() => setRole('patient')}
          >
            <Typo
              size={14}
              fontWeight="700"
              color={role === 'patient' ? '#FFFFFF' : lightTheme.text.secondary}
            >
              I&apos;m a patient
            </Typo>
          </Pressable>
          <Pressable
            style={[styles.roleOption, role === 'doctor' && styles.roleOptionActive]}
            onPress={() => setRole('doctor')}
          >
            <Typo
              size={14}
              fontWeight="700"
              color={role === 'doctor' ? '#FFFFFF' : lightTheme.text.secondary}
            >
              I&apos;m a doctor
            </Typo>
          </Pressable>
        </View>

        <Input
          label="Full name"
          placeholder="Adaeze Okonkwo"
          leftIcon={UserIcon}
          keyboardType="default"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          value={fullName}
          onChangeText={setFullName}
          containerStyle={styles.field}
        />
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
          helperText="We'll send booking confirmations and appointment reminders here"
          errorText={emailTouched ? emailError : undefined}
          containerStyle={styles.field}
        />
        <PhoneInput
          label="Phone number"
          placeholder="801 234 5678"
          country={phoneCountry}
          onCountryChange={setPhoneCountry}
          value={phone}
          onChangeText={setPhone}
          containerStyle={styles.field}
        />

        {role === 'doctor' ? (
          <>
            <Input
              label="Medical license number"
              placeholder="e.g. MDCN/R/12345"
              keyboardType="default"
              autoCapitalize="characters"
              value={licenseNumber}
              onChangeText={setLicenseNumber}
              containerStyle={styles.field}
            />
            <Input
              label="Specialty"
              placeholder="e.g. Obstetrics & Gynaecology"
              keyboardType="default"
              autoCapitalize="words"
              value={specialty}
              onChangeText={setSpecialty}
              containerStyle={styles.field}
            />
            <Input
              label="Hospital / Clinic name"
              placeholder="e.g. Lagos University Teaching Hospital"
              keyboardType="default"
              autoCapitalize="words"
              value={hospitalName}
              onChangeText={setHospitalName}
              containerStyle={styles.field}
            />
          </>
        ) : null}

        <Input
          label="Password"
          placeholder="Create a strong password"
          secureTextEntry
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password-new"
          textContentType="newPassword"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setPasswordTouched(true)}
          helperText="At least 8 characters, with an uppercase letter, a lowercase letter, and a number"
          errorText={passwordTouched ? passwordError : undefined}
          containerStyle={styles.field}
        />

        <Button
          title="Create Account"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={!isFormValid}
          style={{ borderRadius: radius.full, marginTop: spacingY.md }}
        />
      </View>

      {/* footer*/}
      <View style={styles.footer}>
        <Pressable
          onPress={() => router.push('/(auth)/sign-in')}
          style={{ flexDirection: 'row', marginBottom: spacingY.md }}
        >
          <Typo size={14} color={lightTheme.text.secondary}>
            Already have an account?{' '}
          </Typo>
          <Typo size={14} fontWeight="700" color={lightTheme.accent.default}>
            Sign In
          </Typo>
        </Pressable>

        <Typo size={12} color={lightTheme.text.secondary} style={{ textAlign: 'center' }}>
          By signing up you agree to our Terms of Service and Privacy Policy
        </Typo>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: lightTheme.border,
    borderRadius: radius.full,
    padding: 4,
    marginBottom: spacingY.xl,
  },
  roleOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.full,
    alignItems: 'center',
  },
  roleOptionActive: {
    backgroundColor: lightTheme.accent.default,
  },
  field: {
    marginBottom: spacingY.lg,
  },
  footer: {
    alignItems: 'center',
    paddingHorizontal: spacingX.xl,
    paddingBottom: spacingY.xxl,
    paddingTop: spacingY.md,
  },
});
