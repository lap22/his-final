import DateTimePicker, {
  DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeColors } from '@/constants/colors';

interface AppointmentDateModalProps {
  visible: boolean;
  value: Date;
  onClose: () => void;
  onConfirm: (date: Date) => void;
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export function AppointmentDateModal({
  visible,
  value,
  onClose,
  onConfirm,
}: AppointmentDateModalProps) {
  const [temporaryDate, setTemporaryDate] = useState(value);
  const [showAndroidPicker, setShowAndroidPicker] = useState(
    Platform.OS === 'android',
  );

  const handleChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    if (Platform.OS === 'android') {
      setShowAndroidPicker(false);
    }

    if (event.type === 'set' && selectedDate) {
      setTemporaryDate(selectedDate);
    }
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <SafeAreaView style={styles.sheet}>
          <Text style={styles.title}>Chọn ngày khám</Text>

          {Platform.OS === 'ios' || showAndroidPicker ? (
            <DateTimePicker
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              minimumDate={startOfToday()}
              mode="date"
              onChange={handleChange}
              value={temporaryDate}
            />
          ) : (
            <Pressable
              onPress={() => setShowAndroidPicker(true)}
              style={styles.dateButton}
            >
              <Text style={styles.dateButtonText}>
                {temporaryDate.toLocaleDateString('vi-VN')}
              </Text>
            </Pressable>
          )}

          <View style={styles.actions}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Hủy</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(temporaryDate)}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Xác nhận</Text>
            </Pressable>
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: homeColors.overlay,
  },
  sheet: {
    borderRadius: 8,
    padding: 18,
    backgroundColor: homeColors.surface,
    gap: 16,
  },
  title: {
    color: homeColors.text,
    fontSize: 19,
    fontWeight: '800',
  },
  dateButton: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
  },
  dateButtonText: {
    color: homeColors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
  },
  cancelText: {
    color: homeColors.text,
    fontWeight: '800',
  },
  confirmButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: homeColors.primary,
  },
  confirmText: {
    color: homeColors.surface,
    fontWeight: '800',
  },
});
