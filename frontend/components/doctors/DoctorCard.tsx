import { Image, Pressable, StyleSheet, View } from 'react-native';
import { useState } from 'react';
import * as Icon from 'phosphor-react-native';
import { Card } from '@/components/ui';
import { DoctorsCardProps } from '@/types';
import Typo from '@/components/Typo';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';

const DoctorCard = ({
  name,
  image,
  department,
  fee,
  rating,
  hospital,
  onPress,
}: DoctorsCardProps) => {
  const theme = useTheme();
  const source = typeof image === 'string' ? { uri: image.trim() } : image;
  const imageKey = JSON.stringify(source);
  const [failedImage, setFailedImage] = useState<string>();
  const hasImage = !!source && (typeof source !== 'object' || !('uri' in source) || !!source.uri);
  const nameParts = (name ?? '')
    .replace(/^\s*(?:dr\.?|doctor)\s+/i, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = nameParts.length
    ? `${nameParts[0][0]}${nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : ''}`.toUpperCase()
    : '?';
  const numericRating = Number(rating);
  const hasRating =
    rating !== undefined && String(rating).trim() !== '' && Number.isFinite(numericRating);
  const average = hasRating ? Math.min(5, Math.max(0, numericRating)) : 0;
  const filledStars = Math.round(average);

  const feeText =
    fee !== undefined && Number.isFinite(fee) ? `consultation fee ${fee} naira` : undefined;

  const a11yLabel = [
    name ?? 'Doctor',
    department,
    hospital,
    hasRating ? `rated ${average} out of 5` : 'no ratings yet',
    feeText,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={a11yLabel}
      accessibilityHint="Opens the doctor's profile"
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <Card style={styles.container}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor: theme.secondary.soft,
              borderColor: theme.secondary.default,
            },
          ]}
        >
          {hasImage && failedImage !== imageKey ? (
            <Image
              source={source}
              style={styles.photo}
              resizeMode="cover"
              accessibilityLabel={`${name ?? 'Doctor'} profile photo`}
              onError={() => setFailedImage(imageKey)}
            />
          ) : (
            <Typo size={16} fontWeight="700" color={theme.secondary.dark}>
              {initials}
            </Typo>
          )}
        </View>
        <View style={styles.details}>
          <View style={styles.heading}>
            <Typo size={14} fontWeight="700" style={styles.name}>
              {name ?? 'Doctor'}
            </Typo>
            {fee !== undefined && Number.isFinite(fee) && (
              <Typo size={12} fontWeight="600">
                ₦{fee.toLocaleString('en-NG', { maximumFractionDigits: 2 })}
              </Typo>
            )}
          </View>
          {!!department && (
            <Typo size={12} color={theme.text.secondary}>
              {department}
            </Typo>
          )}
          <View
            style={styles.rating}
            accessible
            accessibilityLabel={hasRating ? `${average} out of 5 stars` : 'No ratings yet'}
          >
            <View style={styles.stars}>
              {Array.from({ length: 5 }, (_, index) => (
                <Icon.StarIcon
                  key={index}
                  size={scale(13)}
                  color={theme.rating.star}
                  weight={index < filledStars ? 'fill' : 'regular'}
                />
              ))}
            </View>
            <Typo size={11} color={theme.text.secondary}>
              {hasRating
                ? average.toLocaleString('en-NG', { maximumFractionDigits: 1 })
                : 'No ratings yet'}
            </Typo>
          </View>
          {!!hospital && (
            <View style={styles.hospital}>
              <Icon.MapPinIcon size={scale(13)} color={theme.text.secondary} />
              <Typo size={12} color={theme.text.secondary} style={styles.name} numberOfLines={1}>
                {hospital}
              </Typo>
            </View>
          )}
        </View>
      </Card>
    </Pressable>
  );
};

export default DoctorCard;

const styles = StyleSheet.create({
  container: { gap: scale(12), flexDirection: 'row', alignItems: 'flex-start' },
  avatar: {
    width: scale(48),
    height: scale(48),
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  photo: { width: '100%', height: '100%' },
  details: { flex: 1, minWidth: 0, gap: 6 },
  heading: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'flex-start', gap: 8 },
  name: { flex: 1, minWidth: 0 },
  rating: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6 },
  stars: { flexDirection: 'row', gap: 2 },
  hospital: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
