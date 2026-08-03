import { Ionicons } from '@expo/vector-icons';
import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { homeColors } from '@/constants/colors';
import type { Appointment, AppointmentStatus, StatusConfig } from '@/types/home.types';

type AppointmentCardProps = {
  appointment: Appointment;
  statusConfig: Record<AppointmentStatus, StatusConfig>;
};

function AppointmentCardComponent({ appointment, statusConfig }: AppointmentCardProps) {
  const status = statusConfig[appointment.status];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.titleWrap}>
          <Text style={styles.clinicName}>{appointment.clinicName}</Text>
          <Text style={styles.department}>{appointment.department}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.backgroundColor }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <Ionicons name="person-outline" size={16} color={homeColors.textMuted} />
        <Text style={styles.infoText}>Người đặt: {appointment.bookedBy}</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.infoRow}>
          <Ionicons name="time-outline" size={16} color={homeColors.primary} />
          <Text style={styles.footerText}>{appointment.time}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color={homeColors.primary} />
          <Text style={styles.footerText}>{appointment.date}</Text>
        </View>
      </View>
    </View>
  );
}

export const AppointmentCard = memo(AppointmentCardComponent);

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    borderWidth: 1,
    borderColor: homeColors.border,
    padding: 16,
    gap: 12,
  },
  cardHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  clinicName: {
    color: homeColors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  department: {
    color: homeColors.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
  statusBadge: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '800',
  },
  infoRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  infoText: {
    color: homeColors.textMuted,
    flex: 1,
    fontSize: 14,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: homeColors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    gap: 12,
  },
  footerText: {
    color: homeColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
