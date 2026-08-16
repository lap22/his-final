import { router, type Href } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeColors } from '@/constants/colors';
import { AppointmentCard } from '@/modules/appointment/components/AppointmentCard';
import { useAppointments } from '@/modules/appointment/hooks/useAppointments';
import { useRealtimeAppointments } from '@/modules/appointment/hooks/useRealtimeAppointments';
import { useAuth } from '@/providers/AuthProvider';

export default function AppointmentListScreen() {
  const { firebaseUser, isAuthLoading } = useAuth();
  const uid = firebaseUser?.uid;

  const {
    data: appointments = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useAppointments(uid);

  useRealtimeAppointments(uid);

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
        <Text style={styles.description}>
          Đăng nhập để xem và đặt lịch khám.
        </Text>
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
        <Pressable onPress={() => refetch()} style={styles.outlineButton}>
          <Text style={styles.outlineButtonText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Lịch hẹn</Text>
          <Text style={styles.description}>
            Theo dõi trạng thái khám theo thời gian thực.
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/appointments/create' as Href)}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>Đặt lịch</Text>
        </Pressable>
      </View>

      <FlatList
        data={appointments}
        keyExtractor={item => item.id}
        contentContainerStyle={
          appointments.length === 0
            ? styles.emptyList
            : styles.list
        }
        renderItem={({ item }) => (
          <AppointmentCard appointment={item} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.title}>Chưa có lịch hẹn</Text>
            <Text style={styles.description}>
              Chọn bệnh nhân, chuyên khoa, bác sĩ và khung giờ để tạo lịch khám đầu tiên.
            </Text>
            <Pressable
              onPress={() => router.push('/appointments/create' as Href)}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Đặt lịch khám</Text>
            </Pressable>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    gap: 14,
  },
  headerText: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: homeColors.text,
    fontSize: 22,
    fontWeight: '800',
  },
  description: {
    color: homeColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  list: {
    padding: 18,
    paddingTop: 0,
    paddingBottom: 36,
  },
  emptyList: {
    flexGrow: 1,
  },
  separator: {
    height: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
    backgroundColor: homeColors.background,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  mutedText: {
    color: homeColors.textMuted,
  },
  errorText: {
    color: homeColors.danger,
    textAlign: 'center',
  },
  addButton: {
    minHeight: 42,
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: homeColors.primary,
  },
  addButtonText: {
    color: homeColors.surface,
    fontWeight: '800',
  },
  primaryButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: homeColors.primary,
  },
  primaryButtonText: {
    color: homeColors.surface,
    fontWeight: '800',
  },
  outlineButton: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: homeColors.primary,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
  },
  outlineButtonText: {
    color: homeColors.primary,
    fontWeight: '800',
  },
});
