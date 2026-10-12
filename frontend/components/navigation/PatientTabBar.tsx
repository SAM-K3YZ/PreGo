import Typo from '@/components/Typo';
import { lightTheme } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { ComponentProps, useEffect, useRef } from 'react';
import { Animated, Easing, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type TabBarProps = Parameters<NonNullable<ComponentProps<typeof Tabs>['tabBar']>>[0];
type TabItemProps = {
  focused: boolean;
  label: string;
  options: TabBarProps['descriptors'][string]['options'];
  onPress: () => void;
  onLongPress: () => void;
};

function TabItem({ focused, label, options, onPress, onLongPress }: TabItemProps) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    const animation = Animated.timing(progress, {
      toValue: focused ? 1 : 0,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    });
    animation.start();
    return () => animation.stop();
  }, [focused, progress]);

  return (
    <Animated.View
      style={{ flex: progress.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }}
    >
      <Pressable
        accessibilityRole="tab"
        accessibilityState={{ selected: focused }}
        accessibilityLabel={options.tabBarAccessibilityLabel ?? label}
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => ({ opacity: pressed ? 0.75 : 1 })}
      >
        <Animated.View
          style={[
            styles.item,
            {
              backgroundColor: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [lightTheme.background.card, lightTheme.accent.tint],
              }),
            },
          ]}
        >
          {options.tabBarIcon?.({
            focused,
            color: focused ? lightTheme.text.primary : lightTheme.secondary.dark,
            size: 22,
          })}
          <Animated.View
            style={{
              maxWidth: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 72] }),
              marginLeft: progress.interpolate({ inputRange: [0, 1], outputRange: [0, 6] }),
              opacity: progress,
              overflow: 'hidden',
              flexShrink: 1,
            }}
          >
            <Typo size={12} fontWeight="semibold" numberOfLines={1}>
              {label}
            </Typo>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

export default function PatientTabBar({ state, descriptors, navigation }: TabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.bar,
        { left: insets.left + 20, right: insets.right + 20, bottom: insets.bottom + 4 },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;

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
              if (!focused && !event.defaultPrevented)
                navigation.navigate(route.name, route.params);
            }}
            onLongPress={() => navigation.emit({ type: 'tabLongPress', target: route.key })}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    height: 72,
    padding: 10,
    gap: 2,
    borderRadius: 36,
    backgroundColor: lightTheme.background.card,
    shadowColor: lightTheme.text.primary,
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
});
