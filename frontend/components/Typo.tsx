import { lightTheme } from '@/constants/theme';
import { TypoProps } from '@/types';
import { verticalScale } from '@/utils/styling';
import { useFontsStore } from '@/store/useFontsStore';
import React from 'react';
import { Text, TextStyle } from 'react-native';

// Inter covers body text, form fields, captions, and secondary labels
// (400–600). Nunito covers headings, screen titles, bold labels, and the
// PREGO wordmark (700–900) — picked by weight since the two ranges don't
// overlap, so callers don't need a separate "variant" prop.
const getFontFamily = (fontWeight: string | number = '400') => {
  const weight = String(fontWeight);
  switch (weight) {
    case '400':
    case 'normal':
      return 'Inter_400Regular';
    case '500':
    case 'medium':
      return 'Inter_500Medium';
    case '600':
    case 'semibold':
      return 'Inter_600SemiBold';
    case '700':
    case 'bold':
      return 'Nunito_700Bold';
    case '800':
    case 'extrabold':
      return 'Nunito_800ExtraBold';
    case '900':
    case 'black':
      return 'Nunito_900Black';
    default:
      return 'Inter_400Regular';
  }
};

const Typo = ({
  size = 16,
  color = lightTheme.text.primary,
  fontWeight = '400',
  children,
  style,
  textProps = {},
  numberOfLines,
}: TypoProps) => {
  const fontsLoaded = useFontsStore((s) => s.fontsLoaded);

  const textStyle: TextStyle = {
    fontSize: verticalScale(size),
    color,
    fontFamily: fontsLoaded ? getFontFamily(fontWeight) : undefined,
  };

  return (
    <Text style={[textStyle, style]} numberOfLines={numberOfLines} {...textProps}>
      {children}
    </Text>
  );
};

export default Typo;
