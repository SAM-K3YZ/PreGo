import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
  name: 'PREGO',
  slug: 'prego',
  version: '1.0.0',
  orientation: 'portrait',
  scheme: 'prego',
  icon: './assets/images/prego_logo.png',
  plugins: [
    'expo-router',
    'expo-notifications',
    'expo-secure-store',
    'expo-font',
    [
      'expo-splash-screen',
      {
        image: './assets/images/prego_logo.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#FFF8F5',
      },
    ],
  ],
  extra: {
    // Public, non-sensitive config only. Never put secrets here —
    // anything in `extra` ships inside the client bundle and is extractable.
    apiUrl:
      process.env.API_URL ||
      `http://${process.env.EXPO_PUBLIC_LOCAL_IP || '10.245.127.67'}:4000/api/v1`,
  },
  ios: {
    bundleIdentifier: 'com.exypnos.prego',
    supportsTablet: false,
  },
  android: {
    package: 'com.exypnos.prego',
    adaptiveIcon: {
      foregroundImage: './assets/images/prego_logo.png',
      backgroundColor: '#FFF8F5',
    },
  },
};

export default config;
