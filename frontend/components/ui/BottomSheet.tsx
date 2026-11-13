import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Icon from 'phosphor-react-native';
import Typo from '@/components/Typo';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import { scale } from '@/utils/styling';
import type { BottomSheetProps } from '@/types';

// Slide-up sheet with a title, scrollable content and an optional pinned footer.
export default function BottomSheet({
  visible,
  title,
  subtitle,
  onClose,
  children,
  footer,
}: BottomSheetProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <KeyboardAvoidingView
        style={[styles.overlay, { backgroundColor: theme.overlay }]}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel={`Close ${title}`}
        />
        <View
          accessibilityViewIsModal
          style={[
            styles.sheet,
            {
              backgroundColor: theme.background.app,
              paddingBottom: Math.max(insets.bottom, spacingY.lg),
            },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Typo size={22} fontWeight="700" color={theme.text.primary}>
                {title}
              </Typo>
              {subtitle ? (
                <Typo size={14} color={theme.text.secondary}>
                  {subtitle}
                </Typo>
              ) : null}
            </View>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel={`Close ${title}`}
              style={({ pressed }) => [
                styles.close,
                { backgroundColor: theme.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Icon.XIcon size={scale(18)} color={theme.text.primary} weight="bold" />
            </Pressable>
          </View>
          <ScrollView
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          {footer ? <View style={styles.footer}>{footer}</View> : null}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: radius.xxxl,
    borderTopRightRadius: radius.xxxl,
    paddingHorizontal: spacingX.xl,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: radius.full,
    alignSelf: 'center',
    marginTop: spacingY.md,
    marginBottom: spacingY.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacingX.md,
    marginBottom: spacingY.lg,
  },
  headerText: {
    flex: 1,
    gap: spacingY.xs,
    paddingTop: spacingY.sm,
  },
  close: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: spacingY.md,
    paddingBottom: spacingY.md,
  },
  footer: {
    paddingTop: spacingY.md,
  },
});
