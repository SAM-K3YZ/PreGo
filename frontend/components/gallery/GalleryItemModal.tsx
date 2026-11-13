import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import Typo from '@/components/Typo';
import { GALLERY_ICON, getGalleryColors } from '@/components/gallery/galleryVisuals';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import type { GalleryItemModalProps } from '@/types';

export default function GalleryItemModal({ item, onClose }: GalleryItemModalProps) {
  const theme = useTheme();
  if (!item) return null;
  const colors = getGalleryColors(theme, item.category);
  const CategoryIcon = GALLERY_ICON[item.category];

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close"
        />
        <View
          accessibilityViewIsModal
          style={[styles.card, { backgroundColor: theme.background.app }]}
        >
          <View style={[styles.preview, { backgroundColor: colors.background }]}>
            {item.uri && item.mimeType?.startsWith('image/') ? (
              <Image
                source={{ uri: item.uri }}
                style={StyleSheet.absoluteFill}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
              />
            ) : (
              <CategoryIcon size={scale(64)} color={colors.icon} weight="duotone" />
            )}
          </View>
          <View style={styles.footer}>
            <View style={styles.text}>
              <Typo size={18} fontWeight="700" color={theme.text.primary}>
                {item.title}
              </Typo>
              <Typo size={13} color={theme.text.secondary}>
                Only visible to you
              </Typo>
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Close"
              style={({ pressed }) => [
                styles.close,
                { backgroundColor: theme.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Typo size={14} fontWeight="600" color={theme.text.primary}>
                Close
              </Typo>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacingX.lg,
  },
  card: {
    borderRadius: radius.xxl,
    padding: spacingX.xl,
    gap: spacingY.lg,
  },
  preview: {
    aspectRatio: 1.2,
    borderRadius: radius.xl,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.md,
  },
  text: {
    flex: 1,
    gap: spacingY.xs,
  },
  close: {
    minHeight: 44,
    paddingHorizontal: spacingX.lg,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
