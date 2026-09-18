import { ActivityIndicator, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { scale, verticalScale } from '@/utils/styling';
import Typo from '@/components/Typo';
import { ButtonProps, ButtonSize } from '@/types';

const PADDING_BY_SIZE: Record<ButtonSize, number> = { sm: 10, md: 14, lg: 18 };
const FONT_BY_SIZE: Record<ButtonSize, number> = { sm: 13, md: 15, lg: 17 };

const Button = ({
  title,
  color,
  borderColor: customBorderColor,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: IconComponent,
  iconPosition = 'left',
  disabled,
  style,
  ...pressableProps
}: ButtonProps) => {
  const theme = useTheme();
  const isDisabled = disabled || loading;

  const backgroundColor = {
    primary: theme.accent.default,
    secondary: theme.secondary.default,
    outline: 'transparent',
    ghost: 'transparent',
  }[variant];

  const textColor = color ?? (variant === 'outline' || variant === 'ghost' ? theme.accent.default : '#FFFFFF');
  const borderColor = customBorderColor ?? (variant === 'outline' ? theme.accent.default : 'transparent');

  return (
    <Pressable
      {...pressableProps}
      disabled={isDisabled}
      style={({ pressed }) => [
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: scale(8),
          backgroundColor,
          borderWidth: variant === 'outline' ? 1 : 0,
          borderColor,
          borderRadius: scale(12),
          paddingVertical: verticalScale(PADDING_BY_SIZE[size]),
          opacity: isDisabled ? 0.5 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={textColor} />
      ) : (
        <>
          {IconComponent && iconPosition === 'left' ? (
            <IconComponent size={scale(FONT_BY_SIZE[size])} color={textColor} />
          ) : null}
          <Typo size={FONT_BY_SIZE[size]} fontWeight="600" color={textColor}>
            {title}
          </Typo>
          {IconComponent && iconPosition === 'right' ? (
            <IconComponent size={scale(FONT_BY_SIZE[size])} color={textColor} />
          ) : null}
        </>
      )}
    </Pressable>
  );
};

export default Button;
