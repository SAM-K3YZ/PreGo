import Typo from '@/components/Typo';
import { Screen } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';
import { useDoctor } from '@/hooks/useDoctors';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { verticalScale } from '@/utils/styling';
import { router, useLocalSearchParams } from 'expo-router';
import * as Icon from 'phosphor-react-native';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';

export default function DoctorDetailsScreen() {
  const theme = useTheme();
  const params = useLocalSearchParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: doctor, isLoading, isError, refetch } = useDoctor(id);
  const pull = usePullToRefresh(refetch);

  const goBack = () => (router.canGoBack() ? router.back() : router.replace('/doctors'));

  return (
    <Screen scroll style={styles.container} {...pull}>
      <Pressable
        onPress={goBack}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.back}
      >
        <Icon.ArrowLeftIcon size={verticalScale(24)} color={theme.text.primary} />
      </Pressable>

      {isLoading && <ActivityIndicator color={theme.accent.default} />}

      {isError && (
        <Pressable onPress={() => refetch()} accessibilityRole="button">
          <Typo color={theme.text.secondary}>Couldn't load this doctor. Tap to retry.</Typo>
        </Pressable>
      )}

      {!isLoading && !isError && !doctor && (
        <Typo color={theme.text.secondary}>This doctor is no longer available.</Typo>
      )}

      {doctor && (
        <View style={styles.content}>
          <Typo size={22} fontWeight="bold" color={theme.text.primary}>
            {doctor.name}
          </Typo>
          <Typo color={theme.text.secondary}>{doctor.department}</Typo>
          <Typo color={theme.text.secondary}>{doctor.hospital}</Typo>
          {/* rating, fee, about, availability, then the Book appointment CTA */}
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { gap: 20 },
  back: { width: 44, height: 44, justifyContent: 'center' },
  content: { gap: 8 },
});
