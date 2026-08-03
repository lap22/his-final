import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  ListRenderItem,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppointmentCard } from '@/components/home/AppointmentCard';
import { AppointmentModal } from '@/components/home/AppointmentModal';
import { HealthReminderCard } from '@/components/home/HealthReminderCard';
import { NotificationModal } from '@/components/home/NotificationModal';
import { PrimaryButton } from '@/components/home/PrimaryButton';
import { SectionHeader } from '@/components/home/SectionHeader';
import { homeColors } from '@/constants/colors';
import {
  initialAppointments,
  initialHealthReminders,
  patientProfile,
} from '@/data/home.mock';
import type {
  Appointment,
  AppointmentSession,
  AppointmentStatus,
  HealthReminder,
  NotificationContent,
  PatientProfile,
  StatusConfig,
} from '@/types/home.types';

type HomeListItem =
  | {
      key: 'appointments';
      type: 'appointments';
    }
  | {
      key: 'reminders';
      type: 'reminders';
    };

type HomeHeaderProps = {
  profile: PatientProfile;
  onPressNotifications: () => void;
};

type AppointmentsSectionProps = {
  appointments: Appointment[];
  statusConfig: Record<AppointmentStatus, StatusConfig>;
  onCreateAppointment: () => void;
};

type RemindersSectionProps = {
  reminders: HealthReminder[];
  pendingCount: number;
  onToggleReminder: (id: string) => void;
  onAddReminder: () => void;
};

type AppointmentModalPayload = {
  date: string;
  session: AppointmentSession;
  reason: string;
};

const listItems: HomeListItem[] = [
  { key: 'appointments', type: 'appointments' },
  { key: 'reminders', type: 'reminders' },
];

const notificationInitialContent: NotificationContent = {
  title: '',
  message: '',
};

const appointmentTimes: Record<AppointmentSession, string> = {
  morning: '08:00',
  afternoon: '14:00',
};

function createAppointmentId() {
  return `appointment-${Date.now()}`;
}

function getComparableDate(date: string, time: string) {
  return new Date(`${date}T${time}:00`).getTime();
}

function HomeHeaderComponent({ profile, onPressNotifications }: HomeHeaderProps) {
  const avatarSource = useMemo(
    () => (profile.avatarUrl ? { uri: profile.avatarUrl } : undefined),
    [profile.avatarUrl],
  );

  return (
    <View style={styles.header}>
      <View style={styles.profileRow}>
        <View style={styles.avatar}>
          {avatarSource ? (
            <Image source={avatarSource} style={styles.avatarImage} />
          ) : (
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          )}
        </View>
        <View style={styles.profileTextWrap}>
          <Text style={styles.facility}>{profile.facilityName}</Text>
          <Text style={styles.pid}>{profile.pid}</Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onPressNotifications}
        style={({ pressed }) => [styles.notificationButton, pressed && styles.pressed]}
      >
        <Ionicons name="notifications-outline" size={23} color={homeColors.text} />
        {profile.notificationCount > 0 ? (
          <View style={styles.notificationBadge}>
            <Text style={styles.notificationBadgeText}>{profile.notificationCount}</Text>
          </View>
        ) : null}
      </Pressable>
    </View>
  );
}

const HomeHeader = memo(HomeHeaderComponent);

function AppointmentsSectionComponent({
  appointments,
  statusConfig,
  onCreateAppointment,
}: AppointmentsSectionProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Lịch hẹn của bạn" />
      <View style={styles.sectionList}>
        {appointments.map((appointment) => (
          <AppointmentCard
            key={appointment.id}
            appointment={appointment}
            statusConfig={statusConfig}
          />
        ))}
      </View>
      <PrimaryButton
        label="Đặt lịch khám mới"
        iconName="add-circle-outline"
        onPress={onCreateAppointment}
      />
    </View>
  );
}

const AppointmentsSection = memo(AppointmentsSectionComponent);

function RemindersSectionComponent({
  reminders,
  pendingCount,
  onToggleReminder,
  onAddReminder,
}: RemindersSectionProps) {
  const badgeText = pendingCount > 0 ? `${pendingCount} chưa xong` : 'Đã hoàn thành';

  return (
    <View style={styles.section}>
      <SectionHeader title="Nhắc nhở sức khỏe" badgeText={badgeText} />
      <View style={styles.sectionList}>
        {reminders.map((reminder) => (
          <HealthReminderCard
            key={reminder.id}
            reminder={reminder}
            onToggle={onToggleReminder}
          />
        ))}
      </View>
      <PrimaryButton
        label="Thêm nhắc nhở"
        iconName="alarm-outline"
        onPress={onAddReminder}
        variant="outline"
      />
    </View>
  );
}

const RemindersSection = memo(RemindersSectionComponent);

export default function HomeScreen() {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [reminders, setReminders] = useState<HealthReminder[]>(initialHealthReminders);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notificationContent, setNotificationContent] =
    useState<NotificationContent>(notificationInitialContent);

  const statusConfig = useMemo<Record<AppointmentStatus, StatusConfig>>(
    () => ({
      pending: {
        label: 'Đang chờ',
        backgroundColor: homeColors.warningSoft,
        color: homeColors.warning,
      },
      confirmed: {
        label: 'Đã xác nhận',
        backgroundColor: homeColors.successSoft,
        color: homeColors.success,
      },
      cancelled: {
        label: 'Đã hủy',
        backgroundColor: homeColors.dangerSoft,
        color: homeColors.danger,
      },
    }),
    [],
  );

  const upcomingAppointments = useMemo(() => {
    return [...appointments]
      .sort(
        (first, second) =>
          getComparableDate(first.date, first.time) - getComparableDate(second.date, second.time),
      )
      .slice(0, 2);
  }, [appointments]);

  const pendingReminderCount = useMemo(
    () => reminders.filter((reminder) => !reminder.completed).length,
    [reminders],
  );

  const flatListData = useMemo(() => listItems, []);

  const showNotification = useCallback((content: NotificationContent) => {
    setNotificationContent(content);
    setNotificationVisible(true);
  }, []);

  const handleOpenAppointmentModal = useCallback(() => {
    setAppointmentModalVisible(true);
  }, []);

  const handleCloseAppointmentModal = useCallback(() => {
    setAppointmentModalVisible(false);
  }, []);

  const handleCloseNotification = useCallback(() => {
    setNotificationVisible(false);
  }, []);

  const handlePressNotifications = useCallback(() => {
    showNotification({
      title: 'Thông báo',
      message: 'Trung tâm thông báo đang được hoàn thiện.',
    });
  }, [showNotification]);

  const handleAddReminder = useCallback(() => {
    showNotification({
      title: 'Thêm nhắc nhở',
      message: 'Chức năng thêm nhắc nhở sẽ sớm được cập nhật.',
    });
  }, [showNotification]);

  const handleToggleReminder = useCallback((id: string) => {
    setReminders((currentReminders) =>
      currentReminders.map((reminder) =>
        reminder.id === id
          ? {
              ...reminder,
              completed: !reminder.completed,
            }
          : reminder,
      ),
    );
  }, []);

  const handleSubmitAppointment = useCallback(
    ({ date, session, reason }: AppointmentModalPayload) => {
      const nextAppointment: Appointment = {
        id: createAppointmentId(),
        clinicName: 'Phòng khám Đăng ký mới',
        department: 'Khoa Khám bệnh',
        bookedBy: patientProfile.name,
        time: appointmentTimes[session],
        date,
        status: 'pending',
        reason,
        createdAt: new Date().toISOString(),
      };

      setAppointments((currentAppointments) => [nextAppointment, ...currentAppointments]);
      setAppointmentModalVisible(false);
      showNotification({
        title: 'Đặt lịch thành công',
        message: 'Lịch khám mới đã được ghi nhận và đang chờ xác nhận.',
      });
    },
    [showNotification],
  );

  const renderItem = useCallback<ListRenderItem<HomeListItem>>(
    ({ item }) => {
      if (item.type === 'appointments') {
        return (
          <AppointmentsSection
            appointments={upcomingAppointments}
            statusConfig={statusConfig}
            onCreateAppointment={handleOpenAppointmentModal}
          />
        );
      }

      return (
        <RemindersSection
          reminders={reminders}
          pendingCount={pendingReminderCount}
          onToggleReminder={handleToggleReminder}
          onAddReminder={handleAddReminder}
        />
      );
    },
    [
      handleAddReminder,
      handleOpenAppointmentModal,
      handleToggleReminder,
      pendingReminderCount,
      reminders,
      statusConfig,
      upcomingAppointments,
    ],
  );

  const keyExtractor = useCallback((item: HomeListItem) => item.key, []);

  const listHeader = useMemo(
    () => (
      <HomeHeader profile={patientProfile} onPressNotifications={handlePressNotifications} />
    ),
    [handlePressNotifications],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={flatListData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={listHeader}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      />

      <AppointmentModal
        visible={appointmentModalVisible}
        onClose={handleCloseAppointmentModal}
        onSubmit={handleSubmitAppointment}
      />

      <NotificationModal
        visible={notificationVisible}
        content={notificationContent}
        onClose={handleCloseNotification}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 36,
    gap: 22,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 2,
  },
  profileRow: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.primary,
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: homeColors.surface,
    fontSize: 22,
    fontWeight: '800',
  },
  profileTextWrap: {
    flex: 1,
    gap: 4,
  },
  facility: {
    color: homeColors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  pid: {
    color: homeColors.textMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.surface,
    borderWidth: 1,
    borderColor: homeColors.border,
  },
  notificationBadge: {
    position: 'absolute',
    top: 5,
    right: 5,
    minWidth: 18,
    height: 18,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: homeColors.danger,
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: homeColors.surface,
    fontSize: 10,
    fontWeight: '800',
  },
  section: {
    gap: 14,
  },
  sectionList: {
    gap: 10,
  },
  pressed: {
    opacity: 0.82,
  },
});
