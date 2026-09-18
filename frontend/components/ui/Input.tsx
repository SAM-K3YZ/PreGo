import { useState } from 'react';
import { View, TextInput, Pressable } from 'react-native';
import { EyeIcon, EyeSlashIcon, MagnifyingGlassIcon, XCircleIcon } from 'phosphor-react-native';
import { useTheme } from '@/hooks/useTheme';
import { scale, verticalScale } from '@/utils/styling';
import Typo from '@/components/Typo';
import { InputProps } from '@/types';

const Input = ({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  variant = 'outline',
  clearable,
  onClear,
  containerStyle,
  secureTextEntry,
  value,
  onChangeText,
  editable = true,
  ...textInputProps
}: InputProps) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureVisible, setIsSecureVisible] = useState(false);

  const isSearch = variant === 'search';
  const LeftIcon = leftIcon ?? (isSearch ? MagnifyingGlassIcon : undefined);
  const RightIcon = rightIcon;
  const showClear = (clearable ?? isSearch) && !!value;

  const borderColor = errorText
    ? theme.semantic.error
    : isFocused
      ? theme.accent.default
      : theme.border;

  return (
    <View style={containerStyle}>
      {label ? (
        <Typo
          size={13}
          fontWeight="600"
          color={theme.text.secondary}
          style={{ marginBottom: verticalScale(6) }}
        >
          {label}
        </Typo>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor,
          borderRadius: isSearch ? 999 : scale(12),
          backgroundColor: theme.background.card,
          paddingHorizontal: scale(14),
          opacity: editable ? 1 : 0.6,
        }}
      >
        {LeftIcon ? (
          <LeftIcon
            size={scale(18)}
            color={theme.text.secondary}
            style={{ marginRight: scale(8) }}
          />
        ) : null}

        <TextInput
          {...textInputProps}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          secureTextEntry={secureTextEntry && !isSecureVisible}
          placeholderTextColor={theme.text.secondary}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          style={{
            flex: 1,
            paddingVertical: verticalScale(14),
            fontSize: verticalScale(15),
            color: theme.text.primary,
          }}
        />

        {secureTextEntry ? (
          <Pressable
            onPress={() => setIsSecureVisible((v) => !v)}
            hitSlop={8}
            style={{ marginLeft: scale(8) }}
          >
            {isSecureVisible ? (
              <EyeSlashIcon size={scale(18)} color={theme.text.secondary} />
            ) : (
              <EyeIcon size={scale(18)} color={theme.text.secondary} />
            )}
          </Pressable>
        ) : showClear ? (
          <Pressable onPress={onClear} hitSlop={8} style={{ marginLeft: scale(8) }}>
            <XCircleIcon size={scale(18)} color={theme.text.secondary} weight="fill" />
          </Pressable>
        ) : RightIcon ? (
          <Pressable
            onPress={onRightIconPress}
            hitSlop={8}
            disabled={!onRightIconPress}
            style={{ marginLeft: scale(8) }}
          >
            <RightIcon size={scale(18)} color={theme.text.secondary} />
          </Pressable>
        ) : null}
      </View>

      {errorText ? (
        <Typo size={12} color={theme.semantic.error} style={{ marginTop: verticalScale(4) }}>
          {errorText}
        </Typo>
      ) : helperText ? (
        <Typo size={12} color={theme.text.secondary} style={{ marginTop: verticalScale(4) }}>
          {helperText}
        </Typo>
      ) : null}
    </View>
  );
};

export default Input;
