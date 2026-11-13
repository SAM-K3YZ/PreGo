import type { ComponentProps, ReactNode, Ref } from 'react';
import {
  TextProps,
  TextStyle,
  TextInputProps,
  ViewStyle,
  PressableProps,
  ScrollView,
  ScrollViewProps,
  ImageSourcePropType,
  ColorValue,
} from 'react-native';
import type * as Icon from 'phosphor-react-native';
import type { InternalAxiosRequestConfig } from 'axios';
import type { Tabs } from 'expo-router';

export interface TypoProps {
  size?: number;
  color?: string;
  fontWeight?: TextStyle['fontWeight'];
  children: ReactNode;
  style?: TextStyle;
  textProps?: TextProps;
  numberOfLines?: number;
  maxFontSizeMultiplier?: number;
}

export interface InputProps extends TextInputProps {
  height?: ViewStyle['height'];
  width?: ViewStyle['width'];
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: Icon.Icon;
  rightIcon?: Icon.Icon;
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
  icon?: Icon.Icon;
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
  keyboardAware?: boolean;
  scrollViewRef?: Ref<ScrollView>;
  onScrollLayout?: ScrollViewProps['onLayout'];
  center?: boolean;
  style?: ViewStyle;
  padding?: number;
  // Pull to refresh. Passing onRefresh makes the screen scrollable.
  refreshing?: boolean;
  onRefresh?: () => void;
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

export interface ProfileDetails extends PatientProfile {
  email: string;
  phone: string;
  bloodType?: string;
  hospitals: Hospital[];
}

export type Hospital = {
  id: string;
  name: string;
  shortName: string;
  location: string;
};

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
  onBlur?: () => void;
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

export type SeverityOption = {
  value: number;
  label: string;
  tone: keyof Theme['semantic'];
};

export interface SymptomEntryPayload {
  experiences: { id: number; title: string }[];
  severity: number;
  note?: string;
  loggedAt: string;
  visibility: boolean;
}

export type Doctor = {
  id: string;
  name: string;
  department?: string;
  hospital?: string;
  fee?: number;
  rating?: number;
  about?: string;
  image?: ImageSourcePropType | string;
};
export type DoctorsCardProps = Omit<Doctor, 'id' | 'about'> & { onPress?: () => void };

export type GalleryCategory = 'ultrasound' | 'belly' | 'prescription';

export type GalleryItem = {
  id: string;
  category: GalleryCategory;
  label: string;
  title: string;
  uri?: string; // local file picked this session, until uploads exist
  mimeType?: string;
};

// Permissions and device access
export type PermissionKind = 'camera' | 'location' | 'notifications';
export type PermissionResult = { granted: boolean; canAskAgain: boolean };
export type Coordinates = { latitude: number; longitude: number };
export type PickedFile = { uri: string; mimeType: string; name?: string };

// App lock
export type AppLockSupport = { available: boolean; label: string };

export interface AppLockState {
  ready: boolean; // stored setting has been read
  enabled: boolean;
  locked: boolean;
  hydrate: () => Promise<void>;
  setEnabled: (enabled: boolean) => Promise<void>;
  lock: () => void;
  unlock: () => void;
  reset: () => Promise<void>;
}

export type AppLockScreenProps = {
  visible: boolean;
  ready: boolean;
  onUnlock: () => void;
  onLogOut: () => void;
};

export type DoctorFiltersValue = {
  department: string;
  maxFee: number | null;
  minRating: number;
};

export interface DoctorFiltersProps {
  visible: boolean;
  value: DoctorFiltersValue;
  departments: string[];
  onChange: (value: DoctorFiltersValue) => void;
  onClose: () => void;
  onApply: () => void;
}

export interface Theme {
  background: { app: string; card: string; muted: string };
  text: { primary: string; secondary: string; onAccent: string };
  border: string;
  accent: { default: string; pressed: string; tint: string; soft: string };
  secondary: { default: string; dark: string; soft: string; tint: string; tintBorder: string };
  semantic: { info: string; warning: string; error: string; success: string };
  semanticSoft: { info: string; warning: string; error: string; success: string };
  overlay: string; // modal backdrop
  shadow: string;
  brand: { google: { blue: string; green: string; yellow: string; red: string } };
  rating: { star: string };
  // Gradient card on Home (trimester summary): white text on a deep pink gradient.
  heroCard: {
    start: string;
    end: string;
    text: string;
    textMuted: string;
    chip: string;
    track: string;
    decoration: string;
  };
  gallery: {
    ultrasound: { background: string; border: string; icon: string };
    belly: { background: string; border: string; icon: string };
    prescription: { background: string; border: string; icon: string };
  };
}

export interface Country {
  name: string;
  iso2: string;
  dialCode: string;
  flag: string;
}

// Auth
export type UserRole = 'patient' | 'doctor' | 'hospital_admin' | 'platform_admin';

export interface AuthUser {
  id: string;
  email: string;
  role: UserRole;
}

export interface SignUpPayload {
  email: string;
  password: string;
  role: 'patient' | 'doctor';
  fullName: string;
  phone: string;
  // Doctor-only verification details.
  licenseNumber?: string;
  specialty?: string;
  hospitalName?: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hydrate: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<AuthUser>;
  signOut: () => Promise<void>;
  clearSession: () => void;
}

export interface FontsState {
  fontsLoaded: boolean;
  setFontsLoaded: (loaded: boolean) => void;
}

// Networking
// `error` is the backend's current shape; `{ code, message, requestId }` is the target envelope.
export type ServerErrorBody = {
  code?: string;
  message?: string;
  error?: string;
  requestId?: string;
};

export interface RetriableConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// Gestation
export type Trimester = 'First' | 'Second' | 'Third';
export type GestationStatus = 'ongoing' | 'due-today' | 'overdue';

// Approximate size comparison that starts at a given gestational week.
export type BabySize = { fromWeek: number; item: string };

export type TrimesterCardProps = {
  gestation: Gestation;
  style?: ViewStyle;
};

export type Gestation = {
  weeks: number; // completed gestational weeks
  days: number; // 0-6
  trimester: Trimester;
  dueDate: Date; // estimated, from conception
  daysToGo: number; // negative once overdue
  status: GestationStatus;
  postTerm: boolean; // 42w0d or later
};

// Navigation
export type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];

export type TabItemProps = {
  focused: boolean;
  label: string;
  options: TabBarProps['descriptors'][string]['options'];
  onPress: () => void;
  onLongPress: () => void;
};

export type TabIconProps = { focused: boolean; color: ColorValue; size: number };

export type GoogleLogoProps = { size?: number };

export type GalleryTab = { category: GalleryCategory; label: string };

// Shared by the Gallery tab and the Add to Gallery screen.
export interface GalleryUiState {
  category: GalleryCategory;
  setCategory: (category: GalleryCategory) => void;
}

export type AddMethod = 'camera' | 'library' | 'scan' | 'pdf';

export type AddMethodOption = {
  method: AddMethod;
  title: string;
  subtitle: string;
  icon: Icon.Icon;
  category?: GalleryCategory;
};

export type GalleryCategoryOption = {
  category: GalleryCategory;
  title: string;
  subtitle: string;
};
export type GalleryTileProps = { item: GalleryItem; onPress: () => void };
export type PrescriptionRowProps = { item: GalleryItem; onPress: () => void };
export type GalleryItemModalProps = { item: GalleryItem | null; onClose: () => void };

export type ProfileHeaderProps = {
  profile: ProfileDetails;
  weeks?: number;
  onEditPhoto: () => void;
};

export type PregnancyDetailsCardProps = {
  dueDate?: string;
  bloodType?: string;
  hospital?: string;
};

export type SettingsSectionProps = { tileColor: string; title: string; children: ReactNode };

export type SettingsRowProps = {
  label: string;
  onPress: () => void;
  color?: string;
  backgroundColor?: string;
  trailing?: ReactNode;
};

export type SettingsToggleProps = {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
};

// Overlays and shared controls
export type OptionCardProps = {
  icon: Icon.Icon;
  iconColor: string;
  tileColor?: string;
  title: string;
  subtitle?: string;
  selected: boolean;
  disabled?: boolean;
  onPress: () => void;
};

export type ConfirmDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel?: string;
  destructive?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export type BannerTone = 'success' | 'error';

export type BannerProps = {
  message: string;
  tone?: BannerTone;
  onClose: () => void;
};

export type BannerState = { message: string; tone: BannerTone } | null;

export type BottomSheetProps = {
  visible: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export type LinkHospitalSheetProps = {
  visible: boolean;
  linkedIds: string[];
  onClose: () => void;
  onLink: (hospital: Hospital) => void;
};
