import Typo from '@/components/Typo';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useMemo, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  TAB_BAR_BOTTOM_GAP,
  TAB_BAR_HEIGHT,
  TAB_BAR_MAX_WIDTH,
  TAB_BAR_SIDE_MARGIN,
  TAB_MIN_TOUCH,
} from './tabBarMetrics';
import type { TabBarProps, TabItemProps } from '@/types';

function useKeyboardVisible() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const show = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () =>
      setVisible(true),
    );
    const hide = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () =>
      setVisible(false),
    );
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);
  return visible;
}

function TabItem({ focused, label, options, onPress, onLongPress }: TabItemProps) {
  const theme = useTheme();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(focused ? 1 : 0);

  useEffect(() => {
    progress.value = withTiming(focused ? 1 : 0, {
      duration: reduceMotion ? 0 : 240,
      easing: Easing.out(Easing.cubic),
    });
  }, [focused, reduceMotion, progress]);

  const wrapperStyle = useAnimatedStyle(() => ({
    flex: interpolate(progress.value, [0, 1], [1, 2.5]),
  }));
  const pillStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      progress.value,
      [0, 1],
      [theme.background.card, theme.accent.tint],
    ),
  }));
  const labelStyle = useAnimatedStyle(() => ({
    maxWidth: interpolate(progress.value, [0, 1], [0, 72]),
    marginLeft: interpolate(progress.value, [0, 1], [0, 6]),
    opacity: progress.value,
  }));

  return (
    <Animated.View style={[{ minWidth: TAB_MIN_TOUCH }, wrapperStyle]}>
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
        testID={options.tabBarButtonTestID}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      >
        <Animated.View style={[styles.item, pillStyle]}>
          {options.tabBarIcon?.({
            focused,
            color: focused ? theme.text.primary : theme.secondary.dark,
            size: 22,
          })}
          <Animated.View style={[styles.labelWrap, labelStyle]}>
            <Typo
              size={12}
              fontWeight="semibold"
              color={theme.text.primary}
              numberOfLines={1}
              maxFontSizeMultiplier={1.2}
            >
              {label}
            </Typo>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function PatientTabBar({ state, descriptors, navigation }: TabBarProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const barStyle = useMemo(
    () => ({
      backgroundColor: theme.background.card,
      shadowColor: theme.text.primary,
    }),
    [theme],
  );

  // Hide while typing so the bar never covers inputs (Doctors search, log forms).
  if (keyboardVisible) return null;

  const activeKey = state.routes[state.index].key;
  // Respect href: null (hidden routes), like the default bar does.
  const routes = state.routes.filter(
    (route) => (descriptors[route.key].options as { href?: string | null }).href !== null,
  );

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.anchor,
        {
          left: insets.left + TAB_BAR_SIDE_MARGIN,
          right: insets.right + TAB_BAR_SIDE_MARGIN,
          bottom: insets.bottom + TAB_BAR_BOTTOM_GAP,
        },
      ]}
    >
      <View accessibilityRole="tablist" style={[styles.bar, barStyle]}>
        {routes.map((route) => {
          const { options } = descriptors[route.key];
          const focused = route.key === activeKey;
          return (
            <TabItem
              key={route.key}
              focused={focused}
              label={options.title ?? route.name}
              options={options}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: route.key,
                  canPreventDefault: true,
                });
                if (!focused && !event.defaultPrevented) {
                  navigation.navigate(route.name, route.params);
                }
              }}
              onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  anchor: { position: 'absolute', alignItems: 'center' },
  bar: {
    width: '100%',
    maxWidth: TAB_BAR_MAX_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
    height: TAB_BAR_HEIGHT,
    padding: 10,
    gap: 2,
    borderRadius: TAB_BAR_HEIGHT / 2,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 8,
  },
  item: {
    height: 52,
    borderRadius: 26,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    overflow: 'hidden',
  },
  labelWrap: { overflow: 'hidden', flexShrink: 1 },
});
