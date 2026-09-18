import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import {
  HeartIcon,
  SparkleIcon,
  FlowerLotusIcon,
  StarIcon,
  FlowerTulipIcon,
  HeartStraightIcon,
} from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { Screen } from '@/components/ui';
import { lightTheme, spacingY } from '@/constants/theme';
import { scale } from '@/utils/styling';
import { useAuthStore } from '@/store/useAuthStore';

// Shown for a brief moment on cold start while useAuthStore.hydrate() runs.

const HAS_LAUNCHED_KEY = 'hasLaunchedBefore';

const usePulse = (duration: number) => {
  const value = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1.12,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, duration]);

  return value;
};

const useBounce = (delay: number, distance: number, duration: number) => {
  const value = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(value, {
          toValue: 1,
          duration,
          delay,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(value, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [value, delay, duration]);

  return value.interpolate({ inputRange: [0, 1], outputRange: [0, -distance] });
};

// Positions are percentages of the screen so the scatter holds up across
// device sizes. Each icon gets its own delay/duration so they drift out of
// sync instead of bobbing in unison.
const SCATTERED_ICONS = [
  {
    Icon: SparkleIcon,
    top: '10%',
    left: '12%',
    size: 22,
    weight: 'fill',
    delay: 0,
    duration: 1400,
    distance: 10,
  },
  {
    Icon: HeartIcon,
    top: '10%',
    left: '90%',
    size: 20,
    weight: 'fill',
    delay: 200,
    duration: 1600,
    distance: 8,
  },
  {
    Icon: FlowerLotusIcon,
    top: '32%',
    left: '50%',
    size: 24,
    weight: 'fill',
    delay: 400,
    duration: 1800,
    distance: 12,
  },
  {
    Icon: StarIcon,
    top: '100%',
    left: '88%',
    size: 18,
    weight: 'fill',
    delay: 100,
    duration: 1500,
    distance: 9,
  },
  {
    Icon: HeartStraightIcon,
    top: '85%',
    left: '50%',
    size: 20,
    weight: 'fill',
    delay: 300,
    duration: 1700,
    distance: 10,
  },
  {
    Icon: FlowerTulipIcon,
    top: '86%',
    left: '10%',
    size: 22,
    weight: 'fill',
    delay: 500,
    duration: 1900,
    distance: 11,
  },
  {
    Icon: SparkleIcon,
    top: '46%',
    left: '6%',
    size: 16,
    weight: 'fill',
    delay: 250,
    duration: 1300,
    distance: 7,
  },
  {
    Icon: HeartIcon,
    top: '65%',
    left: '90%',
    size: 16,
    weight: 'fill',
    delay: 450,
    duration: 1450,
    distance: 8,
  },
] as const;

const ScatteredIcon = ({
  Icon,
  top,
  left,
  size,
  weight,
  delay,
  duration,
  distance,
  color,
}: (typeof SCATTERED_ICONS)[number] & { color: string }) => {
  const translateY = useBounce(delay, distance, duration);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        top,
        left,
        transform: [{ translateY }],
      }}
    >
      <Icon size={scale(size)} color={color} weight={weight} />
    </Animated.View>
  );
};

export default function Splash() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuthStore();
  const [minDelayElapsed, setMinDelayElapsed] = useState(false);
  const hasNavigated = useRef(false);
  const babyScale = usePulse(1400);
  const babyBounce = useBounce(0, 10, 1600);
  const textScale = usePulse(2200);

  // Keep the intro animation on screen for at least 5s, then hand off to
  // wherever the auth check says the user belongs. If hydrate() is still
  // in flight past 5s, wait for it instead of guessing.
  useEffect(() => {
    const timer = setTimeout(() => setMinDelayElapsed(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!minDelayElapsed || isLoading || hasNavigated.current) return;

    if (isAuthenticated) {
      hasNavigated.current = true;
      router.replace('/(patient)/home');
      return;
    }

    (async () => {
      const hasLaunchedBefore = await SecureStore.getItemAsync(HAS_LAUNCHED_KEY);
      if (hasNavigated.current) return;
      hasNavigated.current = true;

      if (!hasLaunchedBefore) {
        // First launch ever, or a fresh install after an uninstall (which
        // wipes SecureStore) — go straight to account creation.
        await SecureStore.setItemAsync(HAS_LAUNCHED_KEY, 'true');
        router.replace('/(auth)/sign-up');
      } else {
        // Returning device, logged out — let them choose sign in vs sign up.
        router.replace('/(auth)/welcome');
      }
    })();
  }, [minDelayElapsed, isLoading, isAuthenticated, router]);

  return (
    <Screen center>
      {SCATTERED_ICONS.map((icon, index) => (
        <ScatteredIcon
          key={`${icon.top}-${icon.left}-${index}`}
          {...icon}
          color={index % 2 === 0 ? lightTheme.accent.tint : lightTheme.secondary.default}
        />
      ))}

      <Animated.View style={{ transform: [{ scale: babyScale }, { translateY: babyBounce }] }}>
        <Image
          source={require('../../assets/images/prego_logo.png')}
          style={{ width: scale(96), height: scale(96) }}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View style={{ transform: [{ scale: textScale }], marginTop: spacingY.md }}>
        <Typo color={lightTheme.accent.default} size={40} fontWeight="bold">
          Prego
        </Typo>
      </Animated.View>

      <ActivityIndicator style={{ marginTop: spacingY.xxl }} color={lightTheme.accent.default} />
    </Screen>
  );
}
