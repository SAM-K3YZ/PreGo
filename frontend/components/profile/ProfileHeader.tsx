import { Pressable, StyleSheet, View } from 'react-native';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { Card } from '@/components/ui';
import { getInitials } from '@/components/ui/Avatar';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import type { ProfileHeaderProps } from '@/types';

export default function ProfileHeader({ profile, weeks, onEditPhoto }: ProfileHeaderProps) {
  const theme = useTheme();

  return (
    <Card style={styles.card} padding={20}>
      <View>
        <View style={[styles.avatar, { backgroundColor: theme.accent.default }]}>
          <Typo size={24} fontWeight="800" color={theme.text.onAccent}>
            {getInitials(profile.fullName)}
          </Typo>
        </View>
        <Pressable
          onPress={onEditPhoto}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel="Edit profile photo"
          style={[
            styles.edit,
            { backgroundColor: theme.accent.default, borderColor: theme.background.card },
          ]}
        >
          <Icon.PencilSimpleLineIcon size={scale(12)} color={theme.text.onAccent} weight="bold" />
        </Pressable>
      </View>

      <View style={styles.details}>
        <Typo size={20} fontWeight="700" color={theme.text.primary}>
          {profile.fullName}
        </Typo>
        <Typo size={13} color={theme.text.secondary}>
          {profile.email} · {profile.phone}
        </Typo>
        <View style={styles.tags}>
          <View style={[styles.tag, { backgroundColor: theme.accent.soft }]}>
            <Typo size={12} fontWeight="600" color={theme.accent.pressed}>
              Patient
            </Typo>
          </View>
          {weeks !== undefined && (
            <View style={[styles.tag, { backgroundColor: theme.secondary.soft }]}>
              <Typo size={12} fontWeight="600" color={theme.secondary.dark}>
                Week {weeks}
              </Typo>
            </View>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.lg,
    borderRadius: radius.xxl,
  },
  avatar: {
    width: scale(68),
    height: scale(68),
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  edit: {
    position: 'absolute',
    right: -scale(4),
    bottom: -scale(4),
    width: scale(24),
    height: scale(24),
    borderWidth: 2,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: spacingY.xs,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacingX.sm,
    marginTop: spacingY.xs,
  },
  tag: {
    paddingHorizontal: spacingX.md,
    paddingVertical: spacingY.xs,
    borderRadius: radius.full,
  },
});
