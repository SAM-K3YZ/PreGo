import { ReactNode } from 'react';
import { TextProps, TextStyle, TextInputProps, ViewStyle, PressableProps } from 'react-native';
import type { Icon } from 'phosphor-react-native';
import type { Country } from '@/constants/countries';
import { number } from 'zod';

export interface TypoProps {
  size?: number;
  color?: string;
  fontWeight?: TextStyle['fontWeight'];
  children: ReactNode;
  style?: TextStyle;
  textProps?: TextProps;
  numberOfLines?: number;
}

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: Icon;
  rightIcon?: Icon;
  onRightIconPress?: () => void;
  variant?: 'outline' | 'search';
  clearable?: boolean;
  onClear?: () => void;
  containerStyle?: ViewStyle;
}

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  title: string;
  color?: string;
  borderColor?: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: Icon;
  iconPosition?: 'left' | 'right';
  style?: ViewStyle;
}

export interface CardProps {
  children: ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  padding?: number;
}

export interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
  center?: boolean;
  style?: ViewStyle;
  padding?: number;
}

export interface AvatarProps {
  uri?: string;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export interface PatientProfile {
  fullName: string;
  conceptionDate?: string;
}

export type BadgeVariant = 'info' | 'warning' | 'error' | 'success' | 'neutral';

export interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export type SignUpRole = 'patient' | 'doctor';

export interface PhoneInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  country: Country;
  onCountryChange: (country: Country) => void;
  helperText?: string;
  errorText?: string;
  containerStyle?: ViewStyle;
}

export interface SkeletonProps {
  width?: number | '100%' | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}
