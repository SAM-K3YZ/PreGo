import { Pressable, StyleSheet, Switch, View } from 'react-native';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { radius, spacingX } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale, verticalScale } from '@/utils/styling';
import type { SettingsRowProps, SettingsSectionProps, SettingsToggleProps } from '@/types';

export function SettingsSection({ tileColor, title, children }: SettingsSectionProps) {
  const theme = useTheme();

  return (
    <View
      style={[
        styles.section,
        { backgroundColor: theme.background.card, borderColor: theme.border },
      ]}
    >
      <View style={styles.header}>
        <Typo size={15} fontWeight="700" color={theme.text.primary}>
          {title}
        </Typo>
      </View>
      {children}
    </View>
  );
}

export function SettingsRow({ label, onPress, color, backgroundColor, trailing }: SettingsRowProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.row,
        { borderTopColor: theme.border, backgroundColor, opacity: pressed ? 0.6 : 1 },
      ]}
    >
      <Typo size={14} color={color ?? theme.text.primary} style={styles.label}>
        {label}
      </Typo>
      {trailing ?? <Icon.CaretRightIcon size={scale(16)} color={theme.text.secondary} />}
    </Pressable>
  );
}

export function SettingsToggle({ label, value, onChange }: SettingsToggleProps) {
  const theme = useTheme();

  return (
    <View style={[styles.row, { borderTopColor: theme.border }]}>
      <Typo size={14} color={theme.text.primary} style={styles.label}>
        {label}
      </Typo>
      <Switch
        value={value}
        onValueChange={onChange}
        accessibilityLabel={label}
        trackColor={{ true: theme.accent.default, false: theme.border }}
        thumbColor={theme.text.onAccent}
        ios_backgroundColor={theme.border}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    borderWidth: 1.5,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.md,
    padding: spacingX.lg,
  },
  tile: {
    width: scale(36),
    height: scale(36),
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: verticalScale(18),
  },
  row: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.md,
    paddingHorizontal: spacingX.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  label: {
    flex: 1,
  },
});
