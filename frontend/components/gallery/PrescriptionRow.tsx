import { Pressable, StyleSheet, View } from 'react-native';
import Typo from '@/components/Typo';
import { GALLERY_ICON, getGalleryColors } from '@/components/gallery/galleryVisuals';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import type { PrescriptionRowProps } from '@/types';

export default function PrescriptionRow({ item, onPress }: PrescriptionRowProps) {
  const theme = useTheme();
  const colors = getGalleryColors(theme, item.category);
  const CategoryIcon = GALLERY_ICON[item.category];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${item.label}, PDF`}
      accessibilityHint="Opens this prescription"
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: theme.background.card,
          borderColor: theme.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: colors.background }]}>
        <CategoryIcon size={scale(24)} color={colors.icon} weight="duotone" />
      </View>
      <View style={styles.text}>
        <Typo size={15} fontWeight="600" color={theme.text.primary} numberOfLines={1}>
          {item.label}
        </Typo>
        <Typo size={13} color={theme.text.secondary}>
          PDF · Tap to view
        </Typo>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.lg,
    borderWidth: 1.5,
    borderRadius: radius.xl,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
  },
  icon: {
    width: scale(48),
    height: scale(48),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: spacingY.xs,
  },
});
