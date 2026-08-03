import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { homeColors } from '@/constants/colors';
import type { HealthReminder } from '@/types/home.types';

type HealthReminderCardProps = {
  reminder: HealthReminder;
  onToggle: (id: string) => void;
};

function HealthReminderCardComponent({ reminder, onToggle }: HealthReminderCardProps) {
  const handlePress = useCallback(() => {
    onToggle(reminder.id);
  }, [onToggle, reminder.id]);

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked: reminder.completed }}
      onPress={handlePress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={[styles.check, reminder.completed && styles.checkDone]}>
        <Ionicons
          name={reminder.completed ? 'checkmark' : 'ellipse-outline'}
          size={18}
          color={reminder.completed ? homeColors.surface : homeColors.primary}
        />
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, reminder.completed && styles.completedText]}>
            {reminder.title}
          </Text>
          <Text style={styles.time}>{reminder.time}</Text>
        </View>
        <Text style={[styles.description, reminder.completed && styles.completedText]}>
          {reminder.description}
        </Text>
      </View>
    </Pressable>
  );
}

export const HealthReminderCard = memo(HealthReminderCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    borderWidth: 1,
    borderColor: homeColors.border,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  check: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.primarySoft,
  },
  checkDone: {
    backgroundColor: homeColors.success,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  title: {
    color: homeColors.text,
    flex: 1,
    fontSize: 15,
    fontWeight: '800',
  },
  time: {
    color: homeColors.primaryDark,
    fontSize: 13,
    fontWeight: '800',
  },
  description: {
    color: homeColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  completedText: {
    opacity: 0.55,
    textDecorationLine: 'line-through',
  },
  pressed: {
    opacity: 0.85,
  },
});
