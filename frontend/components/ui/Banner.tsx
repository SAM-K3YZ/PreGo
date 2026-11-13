import { Pressable, StyleSheet, View } from 'react-native';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import type { BannerProps } from '@/types';

// Inline, dismissible message shown in the page (e.g. "Your data download has started").
export default function Banner({ message, tone = 'success', onClose }: BannerProps) {
  const theme = useTheme();
  const isError = tone === 'error';

  return (
    <View
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
      style={[
        styles.banner,
        {
          backgroundColor: isError ? theme.semanticSoft.error : theme.accent.soft,
          borderColor: isError ? theme.semantic.error : theme.accent.tint,
        },
      ]}
    >
      {isError ? (
        <Icon.WarningCircleIcon size={scale(18)} color={theme.semantic.error} weight="bold" />
      ) : null}
      <Typo size={14} color={theme.text.primary} style={styles.message}>
        {message}
      </Typo>
      <Pressable
        onPress={onClose}
        hitSlop={10}
        accessibilityRole="button"
        accessibilityLabel="Dismiss message"
        style={styles.close}
      >
        <Icon.XIcon size={scale(16)} color={theme.text.secondary} weight="bold" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.md,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingLeft: spacingX.lg,
    paddingRight: spacingX.sm,
    paddingVertical: spacingY.md,
  },
  message: {
    flex: 1,
  },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
