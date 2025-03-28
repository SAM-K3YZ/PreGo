import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import HomeScreen from './Screens/HomeScreen';
import { GlobalColor } from './constants/style';
import BabyScreen from './Screens/BabyScreen';
import ProfileScreen from './Screens/ProfileScreen';
import DoctorScreen from './Screens/DoctorScreen';
import { PregnancyProvider } from './store/PregnancyContext';





//bottomTabs object
const BottomTab = createBottomTabNavigator();

export default function App() {
  return (
    <PregnancyProvider>
      <NavigationContainer>
        <BottomTab.Navigator
          initialRouteName='home'
          screenOptions={{
            headerStyle: { backgroundColor: GlobalColor.lightColors.primary },
            headerTintColor: GlobalColor.lightColors.white,
            tabBarActiveTintColor: GlobalColor.darkColors.primary,
            headerTitleAlign: 'center'
          }}
        >
          {/* screens */}
          <BottomTab.Screen
            name="home"
            component={HomeScreen}
            options={{
              title: "Home",
              tabBarIcon: ({ color }) => (
                <Ionicons name="home" size={24} color={color} />
              ),
            }}
          />

          <BottomTab.Screen
            name="baby"
            component={BabyScreen}
            options={{
              title: "Baby",
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name="baby" size={24} color={color} />
              ),
            }}
          />

          <BottomTab.Screen
            name="doctor"
            component={DoctorScreen}
            options={{
              title: "Doctor",
              tabBarIcon: ({ color }) => (
                <FontAwesome6 name="user-doctor" size={24} color={color} />
              ),
            }}
          />

          <BottomTab.Screen
            name='profile'
            component={ProfileScreen}
            options={{
              title: 'Profile',
              tabBarIcon: ({ color }) => (
                <FontAwesome5 name='user-alt' size={24} color={color} />
              )
            }}
          />

        </BottomTab.Navigator>
      </NavigationContainer>
    </PregnancyProvider>
  );
}

