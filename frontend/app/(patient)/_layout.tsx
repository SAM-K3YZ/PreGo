import { lightTheme } from '@/constants/theme';
import { Tabs } from 'expo-router';
import * as Icon from 'phosphor-react-native';

const createTabIcon = (IconComponent: any) => {
  return ({ focused, color, size }: { focused: boolean; color: string; size: number }) => (
    <IconComponent size={size} color={color} weight={focused ? 'fill' : 'regular'} />
  );
};

// Bottom tab navigator for the patient role — matches the 5-tab layout
// from the Notion Phase 10 master style prompt (Home, Log, Doctors, Gallery, Profile).
export default function PatientLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: lightTheme.background.card,
          borderTopWidth: 0,
          height: 74,
          paddingTop: 10,
          paddingBottom: 15,
        },
        tabBarItemStyle: {
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarLabelStyle: {
          fontSize: 12,
          marginTop: 2,
        },
        tabBarIconStyle: {
          width: 20,
          height: 20,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.HouseIcon),
          tabBarInactiveTintColor: lightTheme.secondary.dark,
          tabBarActiveTintColor: lightTheme.accent.default,
        }}
      />
      <Tabs.Screen
        name="pregnancy-log"
        options={{
          title: 'Log',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.ClipboardIcon),
          tabBarInactiveTintColor: lightTheme.secondary.dark,
          tabBarActiveTintColor: lightTheme.accent.default,
        }}
      />
      <Tabs.Screen
        name="doctors"
        options={{
          title: 'Doctors',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.StethoscopeIcon),
          tabBarInactiveTintColor: lightTheme.secondary.dark,
          tabBarActiveTintColor: lightTheme.accent.default,
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.ImageSquareIcon),
          tabBarInactiveTintColor: lightTheme.secondary.dark,
          tabBarActiveTintColor: lightTheme.accent.default,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          headerShown: false,
          tabBarIcon: createTabIcon(Icon.UserIcon),
          tabBarInactiveTintColor: lightTheme.secondary.dark,
          tabBarActiveTintColor: lightTheme.accent.default,
        }}
      />
    </Tabs>
  );
}
