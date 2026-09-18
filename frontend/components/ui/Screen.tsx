import { View, ScrollView, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { spacingX, spacingY } from '@/constants/theme';
import { ScreenProps } from '@/types';

const Screen = ({ children, scroll = false, center = false, style, padding = spacingX.xl }: ScreenProps) => {
  const theme = useTheme();

  const contentStyle: ViewStyle = {
    flexGrow: 1,
    paddingHorizontal: padding,
    paddingTop: padding,
    paddingBottom: spacingY.sm,
    alignItems: center ? 'center' : undefined,
    justifyContent: center ? 'center' : undefined,
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background.app }}
      edges={['top']}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={[contentStyle, style]}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>
      ) : (
        <View style={[contentStyle, style]}>{children}</View>
      )}
    </SafeAreaView>
  );
};

export default Screen;
