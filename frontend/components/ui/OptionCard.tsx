import { Pressable, StyleSheet, View } from 'react-native';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import type { OptionCardProps } from '@/types';

// A selectable card with a radio circle: used for "pick one" lists
// (Add to Gallery methods and categories, Link a hospital).
export default function OptionCard({
  icon: OptionIcon,
  iconColor,
  tileColor,
  title,
  subtitle,
  selected,
  disabled = false,
  onPress,
}: OptionCardProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected, disabled }}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
      style={({ pressed }) => [
        styles.card,
        tileColor ? styles.cardLarge : styles.cardCompact,
        {
          backgroundColor: selected ? theme.accent.soft : theme.background.card,
          borderColor: selected ? theme.accent.default : theme.border,
          opacity: disabled ? 0.45 : pressed ? 0.85 : 1,
        },
      ]}
    >
      {tileColor ? (
        <View style={[styles.tile, { backgroundColor: tileColor }]}>
          <OptionIcon size={scale(24)} color={iconColor} weight="duotone" />
        </View>
      ) : (
        <OptionIcon size={scale(22)} color={iconColor} weight="duotone" />
      )}

      <View style={styles.text}>
        <Typo size={tileColor ? 16 : 15} fontWeight="600" color={theme.text.primary}>
          {title}
        </Typo>
        {subtitle ? (
          <Typo size={13} color={theme.text.secondary}>
            {subtitle}
          </Typo>
        ) : null}
      </View>

      <View
        style={[
          styles.radio,
          selected
            ? { backgroundColor: theme.accent.default, borderColor: theme.accent.default }
            : { borderColor: theme.border },
        ]}
      >
        {selected ? <Icon.CheckIcon size={scale(13)} color={theme.text.onAccent} weight="bold" /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.lg,
    borderWidth: 1.5,
    borderRadius: radius.xl,
    paddingHorizontal: spacingX.lg,
  },
  cardLarge: {
    paddingVertical: spacingY.lg,
  },
  cardCompact: {
    minHeight: 64,
    paddingVertical: spacingY.md,
  },
  tile: {
    width: scale(52),
    height: scale(52),
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    flex: 1,
    gap: spacingY.xs,
  },
  radio: {
    width: scale(24),
    height: scale(24),
    borderRadius: radius.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
