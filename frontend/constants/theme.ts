import { scale, verticalScale } from '@/utils/styling';
import type { Theme } from '@/types';

// Brand marks keep their official colours in every theme.
const brand = {
  google: { blue: '#4285F4', green: '#34A853', yellow: '#FBBC05', red: '#EA4335' },
};

export const lightTheme: Theme = {
  background: { app: '#FFF8F5', card: '#FFFFFF', muted: '#F0E9E7' },
  text: { primary: '#2B2422', secondary: '#7A7168', onAccent: '#FFFFFF' },
  border: '#EDE3DE',
  accent: { default: '#E8998D', pressed: '#C97567', tint: '#F2BDB5', soft: '#E8998D22' },
  secondary: {
    default: '#A8C3A0',
    dark: '#7FA377',
    soft: '#7FA37722',
    tint: '#E8F2E5',
    tintBorder: '#D8E8D3',
  },
  semantic: {
    info: '#8AA9C9',
    warning: '#E0A458',
    error: '#D96C6C',
    success: '#7FA377',
  },
  semanticSoft: {
    info: '#8AA9C922',
    warning: '#E0A45822',
    error: '#D96C6C22',
    success: '#7FA37722',
  },
  overlay: 'rgba(43, 36, 34, 0.4)',
  shadow: '#000000',
  brand,
  rating: { star: '#F5B638' },
  heroCard: {
    start: '#E3A193',
    end: '#C97567',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.85)',
    chip: 'rgba(255, 255, 255, 0.2)',
    track: 'rgba(255, 255, 255, 0.3)',
    decoration: 'rgba(255, 255, 255, 0.1)',
  },
  gallery: {
    ultrasound: { background: '#ECE8FA', border: '#E2DDF2', icon: '#7B6FC4' },
    belly: { background: '#FBE6E0', border: '#F4D7CE', icon: '#C97567' },
    prescription: { background: '#EAF1E6', border: '#DCE7D6', icon: '#6E9566' },
  },
};

export const darkTheme: Theme = {
  background: { app: '#1E1A18', card: '#2B2422', muted: '#352D2A' },
  text: { primary: '#F5EDE9', secondary: '#B8AFA8', onAccent: '#FFFFFF' },
  border: '#3A322E',
  accent: { default: '#E8998D', pressed: '#F2BDB5', tint: '#4A332E', soft: '#E8998D22' },
  secondary: {
    default: '#A8C3A0',
    dark: '#C3D9BC',
    soft: '#C3D9BC22',
    tint: '#2A3328',
    tintBorder: '#384435',
  },
  semantic: {
    info: '#9DBEDD',
    warning: '#E0A458',
    error: '#E68989',
    success: '#8FBF86',
  },
  semanticSoft: {
    info: '#9DBEDD22',
    warning: '#E0A45822',
    error: '#E6898922',
    success: '#8FBF8622',
  },
  overlay: 'rgba(0, 0, 0, 0.6)',
  shadow: '#000000',
  brand,
  rating: { star: '#F5B638' },
  heroCard: {
    start: '#B56F62',
    end: '#86493F',
    text: '#FFFFFF',
    textMuted: 'rgba(255, 255, 255, 0.8)',
    chip: 'rgba(255, 255, 255, 0.16)',
    track: 'rgba(255, 255, 255, 0.25)',
    decoration: 'rgba(255, 255, 255, 0.07)',
  },
  gallery: {
    ultrasound: { background: '#2F2B40', border: '#3E3954', icon: '#B3A9F0' },
    belly: { background: '#3D2C28', border: '#4F3A34', icon: '#F2BDB5' },
    prescription: { background: '#2A3328', border: '#384435', icon: '#A8C3A0' },
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
