import { StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { format } from 'date-fns';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import {
  FULL_TERM_WEEKS,
  getBabySize,
  getCountdownText,
  getProgressPercent,
} from '@/utils/pregnancyProgress';
import { scale } from '@/utils/styling';
import type { TrimesterCardProps } from '@/types';

// Home summary: trimester, week, due date, progress and a size comparison.
// Pass the result of getGestation(); the card does no date maths of its own.
export default function TrimesterCard({ gestation, style }: TrimesterCardProps) {
  const theme = useTheme();
  const colors = theme.heroCard;

  const progress = getProgressPercent(gestation);
  const countdown = getCountdownText(gestation);
  const babySize = getBabySize(gestation.weeks);
  const dueDate = format(gestation.dueDate, 'MMM d, yyyy');
  const trimesterLabel = `${gestation.trimester} trimester`;

  const summary = [
    `${trimesterLabel}, week ${gestation.weeks} of ${FULL_TERM_WEEKS}`,
    `due ${format(gestation.dueDate, 'MMMM d, yyyy')}, ${countdown}`,
    `${progress} percent through`,
    babySize ? `baby is about the size of ${babySize}` : null,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <View
      accessible
      accessibilityLabel={summary}
      style={[styles.card, { shadowColor: theme.shadow }, style]}
    >
      {/* Background: gradient plus two soft circles */}
      <Svg style={StyleSheet.absoluteFill} preserveAspectRatio="none">
        <Defs>
          <LinearGradient id="trimesterCardGradient" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.start} />
            <Stop offset="1" stopColor={colors.end} />
          </LinearGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#trimesterCardGradient)" />
      </Svg>
      <View style={[styles.circleTop, { backgroundColor: colors.decoration }]} />
      <View style={[styles.circleBottom, { backgroundColor: colors.decoration }]} />

      <View style={styles.top}>
        <View style={styles.weekColumn}>
          <Typo size={13} fontWeight="500" color={colors.textMuted} style={styles.eyebrow}>
            {trimesterLabel.toUpperCase()}
          </Typo>
          <Typo size={40} fontWeight="900" color={colors.text} style={styles.week}>
            Week {gestation.weeks}
          </Typo>
          <Typo size={15} color={colors.textMuted}>
            of {FULL_TERM_WEEKS} weeks
          </Typo>
        </View>

        <View style={styles.dueColumn}>
          <Typo size={14} color={colors.textMuted}>
            Due date
          </Typo>
          <Typo size={18} fontWeight="800" color={colors.text}>
            {dueDate}
          </Typo>
          <Typo size={14} color={colors.textMuted} style={styles.countdown}>
            {countdown}
          </Typo>
        </View>
      </View>

      <View style={styles.progress}>
        <View style={styles.progressLabels}>
          <Typo size={14} color={colors.textMuted}>
            Progress
          </Typo>
          <Typo size={14} fontWeight="700" color={colors.text}>
            {progress}%
          </Typo>
        </View>
        <View
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: 100, now: progress }}
          style={[styles.track, { backgroundColor: colors.track }]}
        >
          <View
            style={[
              styles.fill,
              { width: `${progress}%`, backgroundColor: colors.text, shadowColor: colors.text },
            ]}
          />
        </View>
      </View>

      {babySize ? (
        <View style={[styles.chip, { backgroundColor: colors.chip }]}>
          <Icon.OrangeSliceIcon size={scale(18)} color={colors.text} weight="duotone" />
          <Typo size={14} fontWeight="500" color={colors.text}>
            Baby is the size of {babySize}
          </Typo>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.xxxl,
    padding: spacingX.xxl,
    gap: spacingY.xl,
    overflow: 'hidden',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  circleTop: {
    position: 'absolute',
    width: scale(170),
    height: scale(170),
    borderRadius: radius.full,
    top: -scale(60),
    right: -scale(50),
  },
  circleBottom: {
    position: 'absolute',
    width: scale(120),
    height: scale(120),
    borderRadius: radius.full,
    bottom: -scale(60),
    right: scale(60),
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacingX.md,
  },
  weekColumn: {
    flexShrink: 1,
    gap: spacingY.xs,
  },
  eyebrow: {
    letterSpacing: 1,
  },
  week: {
    lineHeight: scale(48),
  },
  dueColumn: {
    alignItems: 'flex-end',
    gap: spacingY.xs,
  },
  countdown: {
    marginTop: spacingY.sm,
  },
  progress: {
    gap: spacingY.sm,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  track: {
    height: 8,
    borderRadius: radius.full,
    overflow: 'visible',
  },
  fill: {
    height: '100%',
    borderRadius: radius.full,
    // Soft glow on the filled part (iOS).
    shadowOpacity: 0.6,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 0 },
  },
  chip: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacingX.sm,
    borderRadius: radius.lg,
    paddingHorizontal: spacingX.lg,
    paddingVertical: spacingY.md,
  },
});
