import React, { memo } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { homeColors } from '@/constants/colors';
import type { NotificationContent } from '@/types/home.types';

type NotificationModalProps = {
  visible: boolean;
  content: NotificationContent;
  onClose: () => void;
};

function NotificationModalComponent({
  visible,
  content,
  onClose,
}: NotificationModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>{content.title}</Text>
          <Text style={styles.message}>{content.message}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={({ pressed }) => [styles.button, pressed && styles.pressed]}
          >
            <Text style={styles.buttonText}>Đóng</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export const NotificationModal = memo(NotificationModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.overlay,
    padding: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    padding: 20,
    gap: 14,
  },
  title: {
    color: homeColors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  message: {
    color: homeColors.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
  button: {
    minHeight: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.primary,
    marginTop: 4,
  },
  buttonText: {
    color: homeColors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
});
