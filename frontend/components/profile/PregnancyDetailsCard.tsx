import { StyleSheet, View } from 'react-native';
import Typo from '@/components/Typo';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { PregnancyDetailsCardProps } from '@/types';

export default function PregnancyDetailsCard({ dueDate, bloodType, hospital }: PregnancyDetailsCardProps) {
  const theme = useTheme();
  const stats = [
    { label: 'DUE DATE', value: dueDate },
    { label: 'BLOOD TYPE', value: bloodType },
    { label: 'HOSPITAL', value: hospital },
  ];

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.accent.soft, borderColor: theme.accent.tint },
      ]}
    >
      <Typo size={15} fontWeight="600" color={theme.text.primary}>
        Pregnancy Details
      </Typo>
      <View style={styles.stats}>
        {stats.map((stat, index) => (
          <View
            key={stat.label}
            style={[
              styles.stat,
              index > 0 && styles.divided,
              index > 0 && { borderLeftColor: theme.accent.tint },
            ]}
          >
            <Typo size={11} color={theme.text.secondary} numberOfLines={1}>
              {stat.label}
            </Typo>
            <Typo size={14} fontWeight="600" color={theme.text.primary} numberOfLines={1}>
              {stat.value ?? '—'}
            </Typo>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1.5,
    borderRadius: radius.xl,
    padding: spacingX.lg,
    gap: spacingY.md,
  },
  stats: {
    flexDirection: 'row',
    gap: spacingX.md,
  },
  stat: {
    flexGrow: 1,
    flexShrink: 1,
    gap: spacingY.xs,
  },
  divided: {
    borderLeftWidth: 1,
    paddingLeft: spacingX.md,
  },
});
