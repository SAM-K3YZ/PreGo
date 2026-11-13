import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'PREGO',
  slug: 'prego',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'automatic',
  scheme: 'prego',
  icon: './assets/images/prego_logo.png',
  // Permissions: purpose strings say exactly why; nothing is requested at launch
  // (see services/permissions.ts). Location is foreground-only, no microphone.
  plugins: [
    'expo-router',
    [
      'expo-notifications',
      {
        icon: './assets/images/prego_logo.png',
        color: '#E8998D',
      },
    ],
    [
      'expo-image-picker',
      {
        cameraPermission:
          'PREGO uses your camera so you can take bump photos and photograph ultrasound scans or prescriptions for your private gallery.',
        photosPermission:
          'PREGO lets you add photos of your bump, scans and prescriptions from your library to your private gallery.',
        microphonePermission: false,
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'PREGO uses your location only while you use the app, to show hospitals and antenatal clinics near you.',
        locationAlwaysPermission: false,
        locationAlwaysAndWhenInUsePermission: false,
        isIosBackgroundLocationEnabled: false,
        isAndroidBackgroundLocationEnabled: false,
      },
    ],
    'expo-document-picker',
    [
      'expo-local-authentication',
      {
        faceIDPermission: 'PREGO uses Face ID to unlock the app and keep your health records private.',
      },
    ],
    'expo-secure-store',
    'expo-font',
    'expo-status-bar',
    [
      'expo-splash-screen',
      {
        image: './assets/images/prego_logo.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#FFF8F5',
      },
    ],
    '@react-native-community/datetimepicker',
    'expo-sqlite',
  ],
  extra: {
    apiUrl: process.env.API_URL,
  },
  ios: {
    bundleIdentifier: 'com.exypnos.prego',
    supportsTablet: false,
  },
  android: {
    package: 'com.exypnos.prego',
    softwareKeyboardLayoutMode: 'resize',
    // Added by dependencies but never used by the app.
    blockedPermissions: [
      'android.permission.RECORD_AUDIO',
      'android.permission.ACCESS_BACKGROUND_LOCATION',
    ],
    adaptiveIcon: {
      foregroundImage: './assets/images/prego_logo.png',
      backgroundColor: '#FFF8F5',
    },
  },
};

export default config;
