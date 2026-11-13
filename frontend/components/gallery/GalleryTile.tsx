import { Image, Pressable, StyleSheet, View } from 'react-native';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { GALLERY_ICON, getGalleryColors } from '@/components/gallery/galleryVisuals';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import type { GalleryTileProps } from '@/types';

// Ultrasounds and belly photos share this card; only the colours and emoji differ.
export default function GalleryTile({ item, onPress }: GalleryTileProps) {
  const theme = useTheme();
  const colors = getGalleryColors(theme, item.category);
  const isPhoto = !!item.uri && !!item.mimeType?.startsWith('image/');
  const CategoryIcon = GALLERY_ICON[item.category];

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={item.title}
      accessibilityHint="Opens this item"
      style={({ pressed }) => [
        styles.tile,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      {isPhoto ? (
        <Image source={{ uri: item.uri }} style={StyleSheet.absoluteFill} accessibilityIgnoresInvertColors />
      ) : (
        <CategoryIcon size={scale(40)} color={colors.icon} weight="duotone" />
      )}
      <View style={[styles.lock, { backgroundColor: theme.background.card }]}>
        <Icon.LockIcon size={scale(12)} color={theme.text.secondary} />
      </View>
      <View style={isPhoto ? [styles.caption, { backgroundColor: theme.background.card }] : null}>
        <Typo size={14} fontWeight="600" color={theme.text.primary} numberOfLines={1}>
          {item.label}
        </Typo>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    width: '48%',
    aspectRatio: 0.75,
    borderWidth: 1.5,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacingY.md,
    paddingHorizontal: spacingX.sm,
    overflow: 'hidden',
  },
  caption: {
    position: 'absolute',
    bottom: spacingY.sm,
    left: spacingX.sm,
    right: spacingX.sm,
    alignItems: 'center',
    paddingVertical: spacingY.xs,
    borderRadius: radius.full,
  },
  lock: {
    position: 'absolute',
    top: spacingY.sm,
    right: spacingX.sm,
    paddingHorizontal: spacingX.sm,
    paddingVertical: spacingY.xs,
    borderRadius: radius.full,
  },
});
