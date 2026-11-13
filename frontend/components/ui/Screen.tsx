import {
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  View,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { spacingX, spacingY } from '@/constants/theme';
import { ScreenProps } from '@/types';

const Screen = ({
  children,
  scroll = false,
  keyboardAware = false,
  scrollViewRef,
  onScrollLayout,
  center = false,
  style,
  padding = spacingX.xl,
  refreshing = false,
  onRefresh,
}: ScreenProps) => {
  const theme = useTheme();
  const scrollable = scroll || !!onRefresh;

  const contentStyle: ViewStyle = {
    flexGrow: 1,
    paddingHorizontal: padding,
    paddingTop: padding,
    paddingBottom: spacingY.sm,
    alignItems: center ? 'center' : undefined,
    justifyContent: center ? 'center' : undefined,
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={keyboardAware && Platform.OS === 'android'}
      behavior="height"
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.app }} edges={['top']}>
        {scrollable ? (
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            onLayout={onScrollLayout}
            contentContainerStyle={[contentStyle, style]}
            automaticallyAdjustKeyboardInsets={keyboardAware && Platform.OS === 'ios'}
            keyboardDismissMode={keyboardAware ? 'on-drag' : 'none'}
            keyboardShouldPersistTaps="handled"
            alwaysBounceVertical={!!onRefresh}
            refreshControl={
              onRefresh ? (
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  tintColor={theme.accent.default}
                  colors={[theme.accent.default]}
                  progressBackgroundColor={theme.background.card}
                />
              ) : undefined
            }
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[contentStyle, style]}>{children}</View>
        )}
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default Screen;
