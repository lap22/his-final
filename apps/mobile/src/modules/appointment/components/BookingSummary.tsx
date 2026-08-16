import { StyleSheet, Text, View } from 'react-native';

import { homeColors } from '@/constants/colors';
import type {
  Department,
  Doctor,
} from '../types/appointment.types';

interface BookingSummaryProps {
  patientName: string;
  relationship: string;
  department?: Department;
  doctor?: Doctor;
  appointmentDate: Date;
  timeSlot: string;
}

export function BookingSummary({
  patientName,
  relationship,
  department,
  doctor,
  appointmentDate,
  timeSlot,
}: BookingSummaryProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Xác nhận lịch khám</Text>
      <SummaryRow label="Bệnh nhân" value={`${patientName} · ${relationship}`} />
      <SummaryRow label="Chuyên khoa" value={department?.name ?? 'Chưa chọn'} />
      <SummaryRow label="Bác sĩ" value={doctor?.name ?? 'Chưa chọn'} />
      <SummaryRow
        label="Ngày khám"
        value={appointmentDate.toLocaleDateString('vi-VN')}
      />
      <SummaryRow label="Giờ khám" value={timeSlot || 'Chưa chọn'} />
    </View>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    gap: 10,
  },
  title: {
    color: homeColors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  row: {
    gap: 3,
  },
  label: {
    color: homeColors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  value: {
    color: homeColors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});

