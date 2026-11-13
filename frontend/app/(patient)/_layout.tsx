import { useEffect } from 'react';
import PatientTabBar from '@/components/navigation/PatientTabBar';
import AppLockGate from '@/components/security/AppLockGate';
import Typo from '@/components/Typo';
import { Button, Screen } from '@/components/ui';
import { spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { useAuthStore } from '@/store/useAuthStore';
import { Redirect, Tabs } from 'expo-router';
import * as ScreenCapture from 'expo-screen-capture';
import * as Icon from 'phosphor-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TAB_BAR_CONTENT_CLEARANCE,
  TAB_BAR_HEIGHT,
  getTabBarOffset,
} from '@/components/navigation/tabBarMetrics';
import type { TabIconProps } from '@/types';

const createTabIcon = (IconComponent: any) => {
  const TabIcon = ({ focused, color, size }: TabIconProps) => (
    <IconComponent size={size} color={color} weight={focused ? 'fill' : 'regular'} />
  );
  return TabIcon;
};

// Bottom tab navigator for the patient role — matches the 5-tab layout
// from the Notion Phase 10 master style prompt (Home, Log, Doctors, Gallery, Profile).
export default function PatientLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { isLoading, isAuthenticated, user, signOut } = useAuthStore();

  // Health data: block screenshots/recording and blur the app-switcher preview.
  ScreenCapture.usePreventScreenCapture();
  useEffect(() => {
    ScreenCapture.enableAppSwitcherProtectionAsync().catch(() => {});
    return () => {
      ScreenCapture.disableAppSwitcherProtectionAsync().catch(() => {});
    };
  }, []);

  // Never render patient screens (or start their queries) without a session.
  if (isLoading) return null;
  if (!isAuthenticated) return <Redirect href="/(onboarding)/splash" />;

  // The server enforces roles too; this keeps other accounts out of patient UI.
  if (user?.role !== 'patient') {
    return (
      <Screen center style={{ gap: spacingY.lg }}>
        <Typo color={theme.text.secondary} style={{ textAlign: 'center' }}>
          This app currently supports patient accounts only.
        </Typo>
        <Button title="Log out" onPress={() => signOut()} />
      </Screen>
    );
  }

  return (
    <>
    <Tabs
      tabBar={(props) => <PatientTabBar {...props} />}
      screenOptions={{
        sceneStyle: {
          backgroundColor: theme.background.app,
          paddingBottom:
            TAB_BAR_HEIGHT + getTabBarOffset(insets.bottom) + TAB_BAR_CONTENT_CLEARANCE,
        },
        tabBarInactiveTintColor: theme.secondary.dark,
        tabBarActiveTintColor: theme.accent.default,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.HouseIcon),
        }}
      />
      <Tabs.Screen
        name="pregnancy-log"
        options={{
          title: 'Log',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.ClipboardIcon),
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: 'Doctors',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.StethoscopeIcon),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.ImageSquareIcon),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.UserIcon),
        }}
      />
    </Tabs>
    <AppLockGate />
    </>
  );
}
