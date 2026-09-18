import { scale, verticalScale } from '@/utils/styling';

export interface Theme {
  background: { app: string; card: string };
  text: { primary: string; secondary: string };
  border: string;
  accent: { default: string; pressed: string; tint: string };
  secondary: { default: string; dark: string };
  semantic: { info: string; warning: string; error: string; success: string };
}

export const lightTheme: Theme = {
  background: { app: '#FFF8F5', card: '#FFFFFF' },
  text: { primary: '#2B2422', secondary: '#7A7168' },
  border: '#EDE3DE',
  accent: { default: '#E8998D', pressed: '#C97567', tint: '#F2BDB5' },
  secondary: { default: '#A8C3A0', dark: '#7FA377' },
  semantic: {
    info: '#8AA9C9',
    warning: '#E0A458',
    error: '#D96C6C',
    success: '#7FA377',
  },
};

export const darkTheme: Theme = {
  background: { app: '#1E1A18', card: '#2B2422' },
  text: { primary: '#F5EDE9', secondary: '#B8AFA8' },
  border: '#3A322E',
  accent: { default: '#E8998D', pressed: '#F2BDB5', tint: '#4A332E' },
  secondary: { default: '#A8C3A0', dark: '#C3D9BC' },
  semantic: {
    info: '#9DBEDD',
    warning: '#E0A458',
    error: '#E68989',
    success: '#8FBF86',
  },
};

export const typography = {
  fontFamily: {
    regular: 'Inter_400Regular',
    medium: 'Inter_500Medium',
    semibold: 'Inter_600SemiBold',
    bold: 'Inter_700Bold',
  },
  fontSize: {
    xs: scale(12),
    sm: scale(14),
    md: scale(16),
    lg: scale(18),
    xl: scale(20),
    '2xl': scale(24),
    '3xl': scale(30),
    '4xl': scale(36),
  },
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.625,
  },
};

// --------------------------------------------------
// HORIZONTAL SPACING
// Use for:
// - paddingHorizontal
// - marginHorizontal
// - gaps
// - widths
// - icon sizes
// --------------------------------------------------

export const spacingX = {
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(20),
  xxl: scale(24),
  xxxl: scale(32),
  huge: scale(40),
};

// --------------------------------------------------
// VERTICAL SPACING
// Use for:
// - marginTop
// - marginBottom
// - paddingVertical
// - heights
// - section spacing
// --------------------------------------------------

export const spacingY = {
  xs: verticalScale(4),
  sm: verticalScale(8),
  md: verticalScale(12),
  lg: verticalScale(16),
  xl: verticalScale(20),
  xxl: verticalScale(24),
  xxxl: verticalScale(32),
  huge: verticalScale(40),
  massive: verticalScale(56),
};

// --------------------------------------------------
// BORDER RADIUS
// DO NOT SCALE THESE
// Keep visually consistent
// --------------------------------------------------

export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  full: 999,
};
