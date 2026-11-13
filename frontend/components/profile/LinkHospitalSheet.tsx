import { useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { BottomSheet, Button, Input, OptionCard } from '@/components/ui';
import { radius, spacingY } from '@/constants/theme';
import { useHospitals } from '@/hooks/useHospitals';
import { useTheme } from '@/hooks/useTheme';
import { isSearchActive, matchesWordPrefixes, MIN_SEARCH_LENGTH } from '@/utils/search';
import type { LinkHospitalSheetProps } from '@/types';

export default function LinkHospitalSheet({
  visible,
  linkedIds,
  onClose,
  onLink,
}: LinkHospitalSheetProps) {
  const theme = useTheme();
  const { data: hospitals = [], isPending, isError, refetch } = useHospitals();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const available = hospitals.filter((hospital) => !linkedIds.includes(hospital.id));
  // Filters live from three characters; shorter input keeps the full list.
  const searching = isSearchActive(search);
  const results = searching
    ? available.filter(
        (hospital) =>
          matchesWordPrefixes(hospital.name, search) ||
          matchesWordPrefixes(hospital.shortName, search),
      )
    : available;
  // Only a visible hospital can be linked.
  const selected = results.find((hospital) => hospital.id === selectedId);
  const typedTooLittle = search.trim().length > 0 && !searching;

  const close = () => {
    setSelectedId(null);
    setSearch('');
    onClose();
  };

  const link = () => {
    if (!selected) return;
    onLink(selected);
    close();
  };

  return (
    <BottomSheet
      visible={visible}
      title="Link a hospital"
      subtitle="Choose where you receive antenatal care."
      onClose={close}
      footer={
        <Button
          title="Link Hospital"
          size="lg"
          disabled={!selected}
          onPress={link}
          style={styles.button}
        />
      }
    >
      <Input
        value={search}
        onChangeText={setSearch}
        placeholder="Search hospitals"
        accessibilityLabel="Search hospitals"
        rightIcon={Icon.MagnifyingGlassIcon}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="search"
        helperText={typedTooLittle ? `Type at least ${MIN_SEARCH_LENGTH} letters to search` : undefined}
      />

      {isPending && <ActivityIndicator color={theme.accent.default} />}

      {isError && (
        <View style={styles.state}>
          <Typo color={theme.text.secondary}>Couldn't load hospitals.</Typo>
          <Button title="Try again" variant="outline" onPress={() => refetch()} />
        </View>
      )}

      {!isPending && !isError && available.length === 0 && (
        <Typo color={theme.text.secondary} style={styles.empty}>
          All available hospitals are already linked.
        </Typo>
      )}

      {!isPending && !isError && available.length > 0 && results.length === 0 && (
        <View style={styles.notFound} accessibilityLiveRegion="polite">
          <Icon.MagnifyingGlassIcon size={28} color={theme.text.secondary} />
          <Typo fontWeight="600" color={theme.text.primary} style={styles.empty}>
            Hospital not found
          </Typo>
          <Typo size={13} color={theme.text.secondary} style={styles.empty}>
            No hospital matches "{search.trim()}". Check the spelling or try another name.
          </Typo>
        </View>
      )}

      {results.map((hospital) => (
        <OptionCard
          key={hospital.id}
          icon={Icon.HospitalIcon}
          iconColor={theme.text.secondary}
          tileColor={theme.border}
          title={hospital.name}
          subtitle={hospital.location}
          selected={hospital.id === selectedId}
          onPress={() => setSelectedId(hospital.id)}
        />
      ))}
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.xl,
    minHeight: 56,
  },
  state: {
    gap: spacingY.md,
    alignItems: 'center',
  },
  empty: {
    textAlign: 'center',
  },
  notFound: {
    alignItems: 'center',
    gap: spacingY.xs,
    paddingVertical: spacingY.lg,
  },
});
