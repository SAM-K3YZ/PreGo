import { View, ViewStyle, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import { CardProps } from '@/types';

const Card = ({ children, onPress, style, padding = 16 }: CardProps) => {
  const theme = useTheme();

  const cardStyle: ViewStyle = {
    backgroundColor: theme.background.card,
    borderRadius: scale(16),
    padding: scale(padding),
    borderWidth: 1,
    borderColor: theme.border,
  };

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [cardStyle, { opacity: pressed ? 0.85 : 1 }, style]}
      >
        {children}
      </Pressable>
    );
  }

  return <View style={[cardStyle, style]}>{children}</View>;
};

export default Card;
