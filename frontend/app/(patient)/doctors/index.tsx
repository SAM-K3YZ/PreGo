import Typo from '@/components/Typo';
import { useTheme } from '@/hooks/useTheme';
import { Button, Input, Screen } from '@/components/ui';
import { scale, verticalScale } from '@/utils/styling';
import { useRef, useState } from 'react';
import { ActivityIndicator, View, ScrollView, StyleSheet, Pressable, Keyboard } from 'react-native';
import * as Icon from 'phosphor-react-native';
import DoctorCard from '@/components/doctors/DoctorCard';
import DoctorFilters, { emptyDoctorFilters } from '@/components/doctors/DoctorFilters';
import { useDoctors } from '@/hooks/useDoctors';
import { usePullToRefresh } from '@/hooks/usePullToRefresh';
import { router } from 'expo-router';

export default function Doctors() {
  const theme = useTheme();
  const { data: doctors = [], isPending, isError, refetch } = useDoctors();
  const pull = usePullToRefresh(refetch);
  const scrollViewRef = useRef<ScrollView>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState(emptyDoctorFilters);
  const [draftFilters, setDraftFilters] = useState(emptyDoctorFilters);
  const [search, setSearch] = useState('');
  const departments = [
    ...new Set(doctors.flatMap((doctor) => (doctor.department ? [doctor.department] : []))),
  ];
  const activeFilterCount =
    Number(!!filters.department) + Number(filters.maxFee !== null) + Number(filters.minRating > 0);
  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch = `${doctor.name ?? ''} ${doctor.department ?? ''}`
      .toLowerCase()
      .includes(search.trim().toLowerCase());
    return (
      matchesSearch &&
      (!filters.department || doctor.department === filters.department) &&
      (filters.maxFee === null || (doctor.fee !== undefined && doctor.fee <= filters.maxFee)) &&
      (filters.minRating === 0 || Number(doctor.rating) >= filters.minRating)
    );
  });

  return (
    <Screen
      scroll
      keyboardAware
      scrollViewRef={scrollViewRef}
      style={styles.container}
      {...pull}
    >
      {/* header */}
      <View style={styles.top}>
        <View>
          <Typo size={20} color={theme.text.primary} fontWeight={'bold'}>
            Find a Doctor
          </Typo>
          <Typo size={14} color={theme.text.secondary} fontWeight={'regular'}>
            Verified antenatal specialists near you
          </Typo>
        </View>
      </View>
      {/* search bar */}
      <View style={styles.inputArea}>
        <Input
          value={search}
          onChangeText={setSearch}
          containerStyle={styles.searchInput}
          style={styles.searchText}
          leftIcon={Icon.MagnifyingGlassIcon}
          placeholderTextColor={theme.text.secondary}
          placeholder="Search doctors or specialities..."
          keyboardType="default"
        />
        {/* filter */}
        <Pressable
          style={styles.filterButton}
          accessibilityRole="button"
          accessibilityLabel="Filter doctors"
          accessibilityHint={`${activeFilterCount} filters applied`}
          onPress={() => {
            Keyboard.dismiss();
            setDraftFilters({ ...filters });
            setShowFilters(true);
          }}
        >
          {({ pressed }) => (
            <Icon.FunnelSimpleIcon
              size={verticalScale(25)}
              color={
                pressed || activeFilterCount > 0
                  ? theme.accent.pressed
                  : theme.text.primary
              }
              weight="bold"
            />
          )}
        </Pressable>
      </View>
      {/* doctors list */}
      <View style={styles.doctorsList}>
        {isPending && <ActivityIndicator color={theme.accent.default} />}
        {isError && (
          <View style={styles.state}>
            <Typo color={theme.text.secondary}>Couldn't load doctors.</Typo>
            <Button title="Try again" onPress={() => refetch()} />
          </View>
        )}
        {filteredDoctors.map((doctor) => (
          <DoctorCard
            key={doctor.id}
            {...doctor}
            onPress={() => router.push({ pathname: '/doctors/[id]', params: { id: doctor.id } })}
          />
        ))}
        {/* {filteredDoctors.map(({ id, ...doctor }) => (
          <DoctorCard key={id} {...doctor} />
        ))} */}
        {!isPending && !isError && filteredDoctors.length === 0 && (
          <Typo color={theme.text.secondary}>
            No doctors match your search or filters. Try adjusting them.
          </Typo>
        )}
      </View>
      <DoctorFilters
        visible={showFilters}
        value={draftFilters}
        departments={departments}
        onChange={setDraftFilters}
        onClose={() => setShowFilters(false)}
        onApply={() => {
          setFilters({ ...draftFilters });
          setShowFilters(false);
          scrollViewRef.current?.scrollTo({ y: 0, animated: true });
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 25,
  },
  top: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputArea: {
    width: '100%',
    gap: scale(8),
    alignItems: 'center',
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    minWidth: 0,
  },
  searchText: {
    minWidth: 0,
  },
  filterButton: {
    width: 44,
    minHeight: 44,
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorsList: {
    gap: verticalScale(12),
  },
  state: {
    gap: verticalScale(12),
    alignItems: 'center',
  },
});
