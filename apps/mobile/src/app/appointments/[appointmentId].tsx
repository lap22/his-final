import { useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeColors } from '@/constants/colors';
import {
  statusLabels,
  statusStyles,
} from '@/modules/appointment/constants/appointment-status';
import { useAppointment } from '@/modules/appointment/hooks/useAppointments';
import { useRealtimeAppointment } from '@/modules/appointment/hooks/useRealtimeAppointments';
import { useAuth } from '@/providers/AuthProvider';

export default function AppointmentDetailScreen() {
  const { appointmentId } = useLocalSearchParams<{
    appointmentId: string;
  }>();
  const { firebaseUser, isAuthLoading } = useAuth();
  const uid = firebaseUser?.uid;

  const {
    data: appointment,
    isLoading,
    isError,
    error,
  } = useAppointment(uid, appointmentId);

  useRealtimeAppointment(uid, appointmentId);

  if (isAuthLoading || isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.mutedText}>Đang tải lịch hẹn...</Text>
      </SafeAreaView>
    );
  }

  if (!uid) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Bạn cần đăng nhập</Text>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Không thể tải lịch hẹn</Text>
        <Text style={styles.errorText}>
          {error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi không xác định.'}
        </Text>
      </SafeAreaView>
    );
  }

  if (!appointment) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Không tìm thấy lịch hẹn</Text>
      </SafeAreaView>
    );
  }

  const statusStyle = statusStyles[appointment.status];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Chi tiết lịch hẹn</Text>
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

        <View style={styles.card}>
          <Info label="Bệnh nhân" value={appointment.patientName} />
          <Info label="Bác sĩ" value={appointment.doctorName} />
          <Info label="Chuyên khoa" value={appointment.departmentName} />
          <Info
            label="Ngày khám"
            value={appointment.appointmentDate
              .toDate()
              .toLocaleDateString('vi-VN')}
          />
          <Info label="Giờ khám" value={appointment.timeSlot} />
          <Info label="Lý do khám" value={appointment.reason} />
          <Info
            label="Triệu chứng"
            value={appointment.symptoms ?? 'Không có'}
          />
          <Info
            label="Số thứ tự"
            value={
              appointment.queueNumber
                ? String(appointment.queueNumber)
                : 'Chưa có'
            }
          />
        </View>
      </View>
    </SafeAreaView>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  content: {
    padding: 18,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: homeColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    color: homeColors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    gap: 14,
  },
  status: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    fontSize: 12,
    fontWeight: '800',
  },
  info: {
    gap: 4,
  },
  infoLabel: {
    color: homeColors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  infoValue: {
    color: homeColors.text,
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
  },
  mutedText: {
    color: homeColors.textMuted,
  },
  errorText: {
    color: homeColors.danger,
    textAlign: 'center',
  },
});

