import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { homeColors } from '@/constants/colors';
import type { AppointmentSession } from '@/types/home.types';

type AppointmentModalSubmit = {
  date: string;
  session: AppointmentSession;
  reason: string;
};

type AppointmentModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (payload: AppointmentModalSubmit) => void;
};

type CalendarDay = {
  id: string;
  label: string;
  dateString: string;
  isCurrentMonth: boolean;
  isPast: boolean;
};

type CalendarDayButtonProps = {
  day: CalendarDay;
  selectedDate: string;
  onSelectDate: (dateString: string) => void;
};

const weekDays = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
const sessionOptions: AppointmentSession[] = ['morning', 'afternoon'];
const sessionLabels: Record<AppointmentSession, string> = {
  morning: 'Buổi sáng',
  afternoon: 'Buổi chiều',
};

function toDateString(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function getStartOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return today;
}

function createMonthCalendar(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const startOffset = (firstDate.getDay() + 6) % 7;
  const startDate = new Date(year, month, 1 - startOffset);
  const today = getStartOfToday();
  const days: CalendarDay[] = [];

  for (let position = 0; position < 42; position += 1) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + position);
    date.setHours(0, 0, 0, 0);

    const dateString = toDateString(date);
    days.push({
      id: dateString,
      label: `${date.getDate()}`,
      dateString,
      isCurrentMonth: date.getMonth() === month,
      isPast: date < today,
    });
  }

  return days;
}

function CalendarDayButtonComponent({
  day,
  selectedDate,
  onSelectDate,
}: CalendarDayButtonProps) {
  const isSelected = selectedDate === day.dateString;

  const handlePress = useCallback(() => {
    onSelectDate(day.dateString);
  }, [day.dateString, onSelectDate]);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={day.isPast || !day.isCurrentMonth}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.dayCell,
        !day.isCurrentMonth && styles.dayOutside,
        day.isPast && styles.dayDisabled,
        isSelected && styles.daySelected,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.dayText,
          !day.isCurrentMonth && styles.dayOutsideText,
          day.isPast && styles.dayDisabledText,
          isSelected && styles.daySelectedText,
        ]}
      >
        {day.label}
      </Text>
    </Pressable>
  );
}

const CalendarDayButton = memo(CalendarDayButtonComponent);

function AppointmentModalComponent({
  visible,
  onClose,
  onSubmit,
}: AppointmentModalProps) {
  const [displayedMonth, setDisplayedMonth] = useState(() => getStartOfToday());
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSession, setSelectedSession] = useState<AppointmentSession>('morning');
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!visible) {
      setError('');
      return;
    }

    setDisplayedMonth(getStartOfToday());
  }, [visible]);

  const calendarDays = useMemo(
    () => createMonthCalendar(displayedMonth),
    [displayedMonth],
  );

  const monthTitle = useMemo(
    () => `Tháng ${displayedMonth.getMonth() + 1}/${displayedMonth.getFullYear()}`,
    [displayedMonth],
  );

  const handlePreviousMonth = useCallback(() => {
    setDisplayedMonth((current) => new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }, []);

  const handleNextMonth = useCallback(() => {
    setDisplayedMonth((current) => new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }, []);

  const handleSelectDate = useCallback((dateString: string) => {
    setSelectedDate(dateString);
    setError('');
  }, []);

  const handleSelectMorning = useCallback(() => {
    setSelectedSession('morning');
  }, []);

  const handleSelectAfternoon = useCallback(() => {
    setSelectedSession('afternoon');
  }, []);

  const handleReasonChange = useCallback((value: string) => {
    setReason(value);
    setError('');
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmedReason = reason.trim();

    if (!selectedDate) {
      setError('Vui lòng chọn ngày khám.');
      return;
    }

    if (!trimmedReason) {
      setError('Vui lòng nhập lý do khám.');
      return;
    }

    onSubmit({
      date: selectedDate,
      session: selectedSession,
      reason: trimmedReason,
    });
    setSelectedDate('');
    setReason('');
    setSelectedSession('morning');
  }, [onSubmit, reason, selectedDate, selectedSession]);

  const sessionPressHandlers = useMemo(
    () => ({
      morning: handleSelectMorning,
      afternoon: handleSelectAfternoon,
    }),
    [handleSelectAfternoon, handleSelectMorning],
  );

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.title}>Chọn lịch khám</Text>
            <Pressable accessibilityRole="button" onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={homeColors.text} />
            </Pressable>
          </View>

          <View style={styles.monthHeader}>
            <Pressable
              accessibilityRole="button"
              onPress={handlePreviousMonth}
              style={styles.monthButton}
            >
              <Ionicons name="chevron-back" size={20} color={homeColors.primary} />
            </Pressable>
            <Text style={styles.monthTitle}>{monthTitle}</Text>
            <Pressable
              accessibilityRole="button"
              onPress={handleNextMonth}
              style={styles.monthButton}
            >
              <Ionicons name="chevron-forward" size={20} color={homeColors.primary} />
            </Pressable>
          </View>

          <View style={styles.weekRow}>
            {weekDays.map((day) => (
              <Text key={day} style={styles.weekText}>
                {day}
              </Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {calendarDays.map((day) => (
              <CalendarDayButton
                key={day.id}
                day={day}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
              />
            ))}
          </View>

          <View style={styles.sessionGroup}>
            {sessionOptions.map((session) => {
              const isSelected = selectedSession === session;

              return (
                <Pressable
                  key={session}
                  accessibilityRole="button"
                  onPress={sessionPressHandlers[session]}
                  style={[styles.sessionButton, isSelected && styles.sessionSelected]}
                >
                  <Text style={[styles.sessionText, isSelected && styles.sessionSelectedText]}>
                    {sessionLabels[session]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            multiline
            value={reason}
            onChangeText={handleReasonChange}
            placeholder="Nhập lý do khám"
            placeholderTextColor={homeColors.textMuted}
            style={styles.reasonInput}
            textAlignVertical="top"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Pressable
            accessibilityRole="button"
            onPress={handleSubmit}
            style={({ pressed }) => [styles.submitButton, pressed && styles.pressed]}
          >
            <Text style={styles.submitText}>Xác nhận đặt lịch</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export const AppointmentModal = memo(AppointmentModalComponent);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: homeColors.overlay,
  },
  sheet: {
    maxHeight: '92%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: homeColors.surface,
    padding: 20,
    gap: 16,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: homeColors.text,
    fontSize: 20,
    fontWeight: '800',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.surfaceMuted,
  },
  monthHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.primarySoft,
  },
  monthTitle: {
    color: homeColors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  weekRow: {
    flexDirection: 'row',
  },
  weekText: {
    width: `${100 / 7}%`,
    color: homeColors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 8,
  },
  dayCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOutside: {
    opacity: 0.35,
  },
  dayDisabled: {
    opacity: 0.25,
  },
  daySelected: {
    borderRadius: 8,
    backgroundColor: homeColors.primary,
  },
  dayText: {
    color: homeColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  dayOutsideText: {
    color: homeColors.textMuted,
  },
  dayDisabledText: {
    color: homeColors.disabled,
  },
  daySelectedText: {
    color: homeColors.surface,
  },
  sessionGroup: {
    flexDirection: 'row',
    gap: 10,
  },
  sessionButton: {
    minHeight: 44,
    flex: 1,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: homeColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.surface,
  },
  sessionSelected: {
    borderColor: homeColors.primary,
    backgroundColor: homeColors.primarySoft,
  },
  sessionText: {
    color: homeColors.textMuted,
    fontSize: 14,
    fontWeight: '700',
  },
  sessionSelectedText: {
    color: homeColors.primaryDark,
  },
  reasonInput: {
    minHeight: 92,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: homeColors.border,
    color: homeColors.text,
    fontSize: 15,
    lineHeight: 22,
    padding: 12,
  },
  errorText: {
    color: homeColors.danger,
    fontSize: 13,
    fontWeight: '700',
  },
  submitButton: {
    minHeight: 48,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.primary,
  },
  submitText: {
    color: homeColors.surface,
    fontSize: 15,
    fontWeight: '800',
  },
  pressed: {
    opacity: 0.82,
  },
});
