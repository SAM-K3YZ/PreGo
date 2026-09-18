import { Image, ImageStyle, View, ViewStyle } from 'react-native';
import { UserIcon } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import Typo from '@/components/Typo';
import { AvatarProps } from '@/types';

const getInitials = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
};

const Avatar = ({ uri, name, size = 48, style }: AvatarProps) => {
  const theme = useTheme();
  const dimension = scale(size);
  const initials = getInitials(name);

  const dimensionStyle = {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    backgroundColor: theme.accent.tint,
  };

  if (uri) {
    const imageStyle: ImageStyle = { ...dimensionStyle, ...style, overflow: 'hidden' };
    return <Image source={{ uri }} style={imageStyle} />;
  }

  const viewStyle: ViewStyle = { ...dimensionStyle, ...style, overflow: 'hidden' };

  return (
    <View style={viewStyle}>
      {initials ? (
        <Typo size={size * 0.4} fontWeight="700" color={theme.accent.pressed}>
          {initials}
        </Typo>
      ) : (
        <UserIcon size={dimension * 0.55} color={theme.accent.pressed} weight="fill" />
      )}
    </View>
  );
};

export default Avatar;
