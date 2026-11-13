import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, StyleSheet, View } from 'react-native';
import Constants from 'expo-constants';
import { format } from 'date-fns';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { Banner, Button, ConfirmDialog, Screen } from '@/components/ui';
import LinkHospitalSheet from '@/components/profile/LinkHospitalSheet';
import PregnancyDetailsCard from '@/components/profile/PregnancyDetailsCard';
import ProfileHeader from '@/components/profile/ProfileHeader';
import { SettingsRow, SettingsSection, SettingsToggle } from '@/components/profile/SettingsSection';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useLinkHospital, useProfile } from '@/hooks/useProfile';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { useTheme } from '@/hooks/useTheme';
import { deleteAccount, requestDataExport } from '@/services/account';
import { authenticate, getAppLockSupport } from '@/services/biometrics';
import { ensurePermission } from '@/services/permissions';
import { useAppLockStore } from '@/store/useAppLockStore';
import { useAuthStore } from '@/store/useAuthStore';
import { getGestation } from '@/utils/gestation';
import { scale } from '@/utils/styling';
import type { BannerState, Hospital } from '@/types';

const comingSoon = () => Alert.alert('Coming soon', 'This option is on the way.');

export default function Profile() {
  const theme = useTheme();
  const signOut = useAuthStore((s) => s.signOut);
  const { data: profile, isPending, isError, refetch } = useProfile();
  const pull = usePullToRefresh(refetch);
  const [appointmentReminders, setAppointmentReminders] = useState(false);
  const [medicationAlerts, setMedicationAlerts] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [banner, setBanner] = useState<BannerState>(null);
  const [exporting, setExporting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showHospitalSheet, setShowHospitalSheet] = useState(false);
  const linkHospital = useLinkHospital();

  const errorMessage = (err: unknown) =>
    err instanceof Error ? err.message : 'Something went wrong. Please try again.';

  const downloadData = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      await requestDataExport();
      setBanner({ tone: 'success', message: 'Your PREGO data download has started.' });
    } catch (err) {
      setBanner({ tone: 'error', message: errorMessage(err) });
    } finally {
      setExporting(false);
    }
  };

  const removeAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      setConfirmDelete(false);
      await signOut(); // clears tokens and cached health data, then leaves the patient area
    } catch (err) {
      setConfirmDelete(false);
      setBanner({ tone: 'error', message: errorMessage(err) });
    } finally {
      setDeleting(false);
    }
  };

  const onLinkHospital = (hospital: Hospital) => {
    linkHospital(hospital);
    setBanner({ tone: 'success', message: `${hospital.name} is now linked.` });
  };

  // Notification permission is asked the first time a reminder is switched on.
  const withNotificationPermission =
    (setValue: (value: boolean) => void) => async (value: boolean) => {
      if (!value) return setValue(false);
      if (await ensurePermission('notifications')) setValue(true);
    };

  const appLockEnabled = useAppLockStore((s) => s.enabled);
  const setAppLockEnabled = useAppLockStore((s) => s.setEnabled);
  const [appLockLabel, setAppLockLabel] = useState('Face ID');

  useEffect(() => {
    getAppLockSupport()
      .then((support) => setAppLockLabel(support.label))
      .catch(() => {});
  }, []);

  // Changing the lock always needs the device owner's Face ID, fingerprint or passcode.
  const toggleAppLock = async (value: boolean) => {
    const support = await getAppLockSupport();
    if (value && !support.available) {
      Alert.alert(
        'Set up a screen lock first',
        'Turn on a passcode, Face ID or fingerprint in your phone settings, then try again.',
      );
      return;
    }
    if (await authenticate(value ? `Turn on ${support.label} lock` : 'Turn off app lock')) {
      await setAppLockEnabled(value);
    }
  };

  const gestation = profile?.conceptionDate ? getGestation(profile.conceptionDate) : null;

  const confirmLogOut = () =>
    Alert.alert('Log out?', 'You will need to sign in again to see your records.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: () => signOut() },
    ]);

  return (
    <Screen scroll style={styles.container} {...pull}>
      <Typo size={24} fontWeight="700" color={theme.text.primary}>
        Profile
      </Typo>

      {isPending && <ActivityIndicator color={theme.accent.default} />}

      {isError && (
        <View style={styles.state}>
          <Typo color={theme.text.secondary}>Couldn't load your profile.</Typo>
          <Button title="Try again" onPress={() => refetch()} />
        </View>
      )}

      {profile && (
        <>
          <ProfileHeader profile={profile} weeks={gestation?.weeks} onEditPhoto={comingSoon} />
          <PregnancyDetailsCard
            dueDate={gestation ? format(gestation.dueDate, 'MMM d, yyyy') : undefined}
            bloodType={profile.bloodType}
            hospital={profile.hospitals[0]?.shortName}
          />
        </>
      )}

      {banner && (
        <Banner message={banner.message} tone={banner.tone} onClose={() => setBanner(null)} />
      )}

      <SettingsSection tileColor={theme.gallery.ultrasound.background} title="Security">
        <SettingsToggle
          label={`${appLockLabel} lock`}
          value={appLockEnabled}
          onChange={toggleAppLock}
        />
        <SettingsRow label="Change password" onPress={comingSoon} />
        <SettingsRow label="Multi-factor authentication" onPress={comingSoon} />
        <SettingsRow label="Active sessions" onPress={comingSoon} />
      </SettingsSection>

      <SettingsSection tileColor={theme.gallery.prescription.background} title="Privacy">
        <SettingsRow label="Download my data" onPress={downloadData} />
        <SettingsRow
          label="Delete account"
          onPress={() => setConfirmDelete(true)}
          color={theme.semantic.error}
        />
      </SettingsSection>

      <SettingsSection tileColor={theme.semanticSoft.warning} title="Notifications">
        <SettingsToggle
          label="Appointment reminders"
          value={appointmentReminders}
          onChange={withNotificationPermission(setAppointmentReminders)}
        />
        <SettingsToggle
          label="Medication alerts"
          value={medicationAlerts}
          onChange={withNotificationPermission(setMedicationAlerts)}
        />
        <SettingsToggle
          label="Weekly reports"
          value={weeklyReports}
          onChange={withNotificationPermission(setWeeklyReports)}
        />
      </SettingsSection>

      <SettingsSection tileColor={theme.accent.soft} title="Linked Hospital">
        {profile?.hospitals.map((hospital) => (
          <SettingsRow key={hospital.id} label={hospital.name} onPress={comingSoon} />
        ))}
        <SettingsRow
          label={profile?.hospitals.length ? 'Add another hospital' : 'Link a hospital'}
          onPress={() => setShowHospitalSheet(true)}
          backgroundColor={theme.background.app}
          trailing={
            <View style={[styles.add, { backgroundColor: theme.accent.soft }]}>
              <Icon.PlusIcon size={scale(14)} color={theme.accent.pressed} />
            </View>
          }
        />
      </SettingsSection>

      <Pressable
        onPress={confirmLogOut}
        accessibilityRole="button"
        accessibilityLabel="Log out"
        style={({ pressed }) => [
          styles.logOut,
          {
            backgroundColor: theme.background.card,
            borderColor: theme.accent.tint,
            opacity: pressed ? 0.7 : 1,
          },
        ]}
      >
        <Icon.SignOutIcon size={scale(18)} color={theme.semantic.error} weight="bold" />
        <Typo size={15} fontWeight="700" color={theme.semantic.error}>
          Log Out
        </Typo>
      </Pressable>

      <Typo size={12} color={theme.text.secondary} style={styles.footer}>
        PREGO v{Constants.expoConfig?.version}
      </Typo>

      <ConfirmDialog
        visible={confirmDelete}
        title="Delete your account?"
        message="This removes your PREGO profile and health records. This action cannot be undone."
        confirmLabel="Delete account"
        destructive
        loading={deleting}
        onConfirm={removeAccount}
        onCancel={() => setConfirmDelete(false)}
      />

      <LinkHospitalSheet
        visible={showHospitalSheet}
        linkedIds={profile?.hospitals.map((hospital) => hospital.id) ?? []}
        onClose={() => setShowHospitalSheet(false)}
        onLink={onLinkHospital}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacingY.lg,
  },
  state: {
    gap: spacingY.md,
    alignItems: 'center',
  },
  add: {
    width: scale(28),
    height: scale(28),
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logOut: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingX.sm,
    borderWidth: 1.5,
    borderRadius: radius.xl,
  },
  footer: {
    textAlign: 'center',
  },
});
