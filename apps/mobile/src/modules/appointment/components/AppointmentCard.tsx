import { router, type Href } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { homeColors } from '@/constants/colors';
import type {
  Appointment,
  AppointmentStatus,
} from '../types/appointment.types';

const statusLabels: Record<AppointmentStatus, string> = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  checked_in: 'Đã check-in',
  in_progress: 'Đang khám',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const statusStyles: Record<
  AppointmentStatus,
  { backgroundColor: string; color: string }
> = {
  pending: {
    backgroundColor: homeColors.warningSoft,
    color: homeColors.warning,
  },
  confirmed: {
    backgroundColor: homeColors.primarySoft,
    color: homeColors.primaryDark,
  },
  checked_in: {
    backgroundColor: '#EDE9FE',
    color: '#6D28D9',
  },
  in_progress: {
    backgroundColor: '#DBEAFE',
    color: '#1D4ED8',
  },
  completed: {
    backgroundColor: homeColors.successSoft,
    color: homeColors.success,
  },
  cancelled: {
    backgroundColor: homeColors.dangerSoft,
    color: homeColors.danger,
  },
};

interface AppointmentCardProps {
  appointment: Appointment;
}

export function AppointmentCard({ appointment }: AppointmentCardProps) {
  const statusStyle = statusStyles[appointment.status];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push(`/appointments/${appointment.id}` as Href)
      }
      style={styles.card}
    >
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.doctor}>{appointment.doctorName}</Text>
          <Text style={styles.department}>
            {appointment.departmentName}
          </Text>
        </View>
        <Text
          style={[
            styles.status,
            {
              backgroundColor: statusStyle.backgroundColor,
              color: statusStyle.color,
            },
          ]}
        >
          {statusLabels[appointment.status]}
        </Text>
      </View>

      <View style={styles.meta}>
        <Info label="Bệnh nhân" value={appointment.patientName} />
        <Info
          label="Ngày"
          value={appointment.appointmentDate
            .toDate()
            .toLocaleDateString('vi-VN')}
        />
        <Info label="Giờ" value={appointment.timeSlot} />
        {appointment.queueNumber ? (
          <Info
            label="Số thứ tự"
            value={String(appointment.queueNumber)}
          />
        ) : null}
      </View>
    </Pressable>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.info}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export { statusLabels, statusStyles };

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  doctor: {
    color: homeColors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  department: {
    color: homeColors.textMuted,
    fontSize: 14,
  },
  status: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '800',
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  info: {
    minWidth: '42%',
    gap: 2,
  },
  infoLabel: {
    color: homeColors.textMuted,
    fontSize: 12,
    fontWeight: '700',
  },
  infoValue: {
    color: homeColors.text,
    fontSize: 14,
    fontWeight: '700',
  },
});
