import { Modal, Pressable, StyleSheet, View } from 'react-native';
import Typo from '@/components/Typo';
import Button from '@/components/ui/Button';
import { radius, spacingX, spacingY } from '@/constants/theme';
import { useTheme } from '@/hooks/useTheme';
import type { ConfirmDialogProps } from '@/types';

// Centered confirmation popup for actions that need a deliberate "yes".
export default function ConfirmDialog({
  visible,
  title,
  message,
  confirmLabel,
  cancelLabel = 'Cancel',
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const theme = useTheme();
  const close = () => {
    if (!loading) onCancel();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={close}>
      <View style={[styles.overlay, { backgroundColor: theme.overlay }]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={close}
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
        />
        <View
          accessibilityViewIsModal
          accessibilityRole="alert"
          style={[styles.card, { backgroundColor: theme.background.app }]}
        >
          <Typo size={22} fontWeight="700" color={theme.text.primary}>
            {title}
          </Typo>
          <Typo size={14} color={theme.text.secondary} style={styles.message}>
            {message}
          </Typo>
          <View style={styles.actions}>
            <Button
              title={cancelLabel}
              variant="outline"
              color={theme.text.primary}
              borderColor={theme.border}
              disabled={loading}
              onPress={onCancel}
              style={{ ...styles.action, backgroundColor: theme.background.card }}
            />
            <Button
              title={confirmLabel}
              loading={loading}
              onPress={onConfirm}
              style={{
                ...styles.action,
                ...(destructive && { backgroundColor: theme.semantic.error }),
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacingX.lg,
  },
  card: {
    borderRadius: radius.xxl,
    padding: spacingX.xxl,
    gap: spacingY.md,
  },
  message: {
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    gap: spacingX.md,
    marginTop: spacingY.md,
  },
  action: {
    flex: 1,
    borderRadius: radius.lg,
    minHeight: 52,
  },
});
