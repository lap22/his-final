import { Pressable, StyleSheet, Text, View } from 'react-native';

import { homeColors } from '@/constants/colors';
import type { TimeSlot } from '../types/appointment.types';

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedSlot: string;
  onSelect: (slot: string) => void;
}

export function TimeSlotPicker({
  slots,
  selectedSlot,
  onSelect,
}: TimeSlotPickerProps) {
  if (slots.length === 0) {
    return (
      <Text style={styles.emptyText}>
        Không có khung giờ khả dụng cho ngày này.
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {slots.map(slot => {
        const isSelected = slot.value === selectedSlot;
        const isDisabled = !slot.isAvailable;

        return (
          <Pressable
            key={slot.value}
            accessibilityRole="button"
            accessibilityState={{
              disabled: isDisabled,
              selected: isSelected,
            }}
            disabled={isDisabled}
            onPress={() => onSelect(slot.value)}
            style={[
              styles.slot,
              isSelected && styles.selectedSlot,
              isDisabled && styles.disabledSlot,
            ]}
          >
            <Text
              style={[
                styles.slotText,
                isSelected && styles.selectedSlotText,
                isDisabled && styles.disabledSlotText,
              ]}
            >
              {slot.value}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  slot: {
    minWidth: 76,
    minHeight: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
  },
  selectedSlot: {
    borderColor: homeColors.primary,
    backgroundColor: homeColors.primary,
  },
  disabledSlot: {
    borderColor: homeColors.disabled,
    backgroundColor: '#F1F5F9',
  },
  slotText: {
    color: homeColors.text,
    fontWeight: '800',
  },
  selectedSlotText: {
    color: homeColors.surface,
  },
  disabledSlotText: {
    color: homeColors.textMuted,
    textDecorationLine: 'line-through',
  },
  emptyText: {
    color: homeColors.textMuted,
    lineHeight: 21,
  },
});

