import { View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { scale, verticalScale } from '@/utils/styling';
import Typo from '@/components/Typo';
import { BadgeProps } from '@/types';

const Badge = ({ label, variant = 'neutral', style }: BadgeProps) => {
  const theme = useTheme();

  const color = variant === 'neutral' ? theme.text.secondary : theme.semantic[variant];
  const backgroundColor = variant === 'neutral' ? theme.border : `${color}22`;

  return (
    <View
      style={[
        {
          alignSelf: 'flex-start',
          backgroundColor,
          borderRadius: 999,
          paddingHorizontal: scale(10),
          paddingVertical: verticalScale(4),
        },
        style,
      ]}
    >
      <Typo size={11} fontWeight="600" color={color}>
        {label}
      </Typo>
    </View>
  );
};

export default Badge;
