import { Animated, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { SkeletonProps } from '@/types';
import { radius } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';

const Skeleton = ({
  width = '100%',
  height = 16,
  borderRadius = radius.md,
  style,
}: SkeletonProps) => {
  const theme = useTheme();
  const opacity = React.useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.35,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, opacity, backgroundColor: theme.border },
        style,
      ]}
    />
  );
};

export default Skeleton;

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
});
