import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { Button } from '@/components/ui';
import { useTheme } from '@/hooks/useTheme';

import type { DoctorFiltersProps, DoctorFiltersValue } from '@/types';

export const emptyDoctorFilters: DoctorFiltersValue = {
  department: '',
  maxFee: null,
  minRating: 0,
};

export default function DoctorFilters({
  visible,
  value,
  departments,
  onChange,
  onClose,
  onApply,
}: DoctorFiltersProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const option = (label: string, selected: boolean, onPress: () => void) => (
    <Pressable
      key={label}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        {
          borderColor: selected ? theme.accent.pressed : theme.border,
          backgroundColor: selected ? theme.accent.tint : theme.background.card,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Typo size={13} color={theme.text.primary}>
        {label}
      </Typo>
    </Pressable>
  );

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close filters"
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            { backgroundColor: theme.background.card, paddingBottom: Math.max(insets.bottom, 16) },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          <View style={styles.header}>
            <Typo size={20} fontWeight="700" color={theme.text.primary}>
              Filter doctors
            </Typo>
            <Pressable
              onPress={onClose}
              style={styles.close}
              accessibilityRole="button"
              accessibilityLabel="Close filters"
            >
              <Icon.XIcon size={22} color={theme.text.primary} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <Typo size={14} fontWeight="600" color={theme.text.primary}>
              Specialty
            </Typo>
            <View style={styles.options}>
              {['', ...departments].map((department) =>
                option(department || 'All specialties', value.department === department, () =>
                  onChange({ ...value, department }),
                ),
              )}
            </View>
            <Typo size={14} fontWeight="600" color={theme.text.primary}>
              Maximum consultation fee
            </Typo>
            <View style={styles.options}>
              {[null, 10000, 15000, 20000].map((maxFee) =>
                option(
                  maxFee === null ? 'Any fee' : `₦${maxFee.toLocaleString('en-NG')} or less`,
                  value.maxFee === maxFee,
                  () => onChange({ ...value, maxFee }),
                ),
              )}
            </View>
            <Typo size={14} fontWeight="600" color={theme.text.primary}>
              Minimum rating
            </Typo>
            <View style={styles.options}>
              {[0, 3, 4, 4.5].map((minRating) =>
                option(
                  minRating === 0 ? 'Any rating' : `${minRating}+ stars`,
                  value.minRating === minRating,
                  () => onChange({ ...value, minRating }),
                ),
              )}
            </View>
          </ScrollView>
          <View style={styles.actions}>
            <Button
              title="Reset"
              variant="outline"
              style={styles.action}
              onPress={() => onChange({ ...emptyDoctorFilters })}
            />
            <Button title="Apply filters" style={styles.action} onPress={onApply} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    height: '55%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  close: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  content: { gap: 12, paddingBottom: 16 },
  options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  option: {
    minHeight: 44,
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  actions: { flexDirection: 'row', gap: 12, paddingTop: 12 },
  action: { flex: 1 },
});
