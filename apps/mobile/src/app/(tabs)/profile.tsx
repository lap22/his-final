import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { usePatientProfiles } from '@/modules/profile/hooks/useProfiles';
import type { PatientProfile } from '@/modules/profile/types/profile.types';
import { useAuth } from '@/providers/AuthProvider';
import { logout } from '@/services/auth.service';
import { useSessionStore } from '@/store/session.store';

const relationshipLabels: Record<PatientProfile['relationship'], string> = {
  self: 'Bản thân',
  father: 'Bố',
  mother: 'Mẹ',
  husband: 'Chồng',
  wife: 'Vợ',
  child: 'Con',
  sibling: 'Anh/Chị/Em',
  other: 'Khác',
};

const genderLabels: Record<PatientProfile['gender'], string> = {
  male: 'Nam',
  female: 'Nữ',
  other: 'Khác',
};

function formatDate(profile: PatientProfile) {
  return profile.dateOfBirth.toDate().toLocaleDateString('vi-VN');
}

function displayValue(value: string | null) {
  return value?.trim() || 'Chưa cập nhật';
}

interface InfoRowProps {
  label: string;
  value: string;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

interface ProfileSwitcherProps {
  profiles: PatientProfile[];
  visible: boolean;
  selectedProfileId?: string;
  onClose: () => void;
  onSelect: (profile: PatientProfile) => void;
}

function ProfileSwitcher({
  profiles,
  visible,
  selectedProfileId,
  onClose,
  onSelect,
}: ProfileSwitcherProps) {
  return (
    <Modal
      animationType="slide"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.modalBackdrop}>
        <SafeAreaView style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đổi hồ sơ</Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Text style={styles.closeText}>Đóng</Text>
            </Pressable>
          </View>

          <FlatList
            data={profiles}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.switcherList}
            renderItem={({ item }) => {
              const isSelected = item.id === selectedProfileId;

              return (
                <Pressable
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => onSelect(item)}
                  style={[
                    styles.switcherItem,
                    isSelected && styles.switcherItemSelected,
                  ]}
                >
                  <View style={styles.smallAvatar}>
                    <Text style={styles.smallAvatarText}>
                      {item.fullName.charAt(0).toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.switcherContent}>
                    <Text style={styles.switcherName}>{item.fullName}</Text>
                    <Text style={styles.switcherMeta}>
                      {relationshipLabels[item.relationship]}
                    </Text>
                  </View>

                  {item.isDefault && (
                    <Text style={styles.switcherBadge}>Mặc định</Text>
                  )}
                </Pressable>
              );
            }}
          />
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default function ProfileTabScreen() {
  const { firebaseUser, isAuthLoading } = useAuth();
  const selectedProfile = useSessionStore(state => state.selectedProfile);
  const setSelectedProfile = useSessionStore(
    state => state.setSelectedProfile,
  );
  const [isSwitcherVisible, setSwitcherVisible] = useState(false);

  const {
    data: profiles = [],
    isLoading,
    isError,
    error,
    refetch,
  } = usePatientProfiles(firebaseUser?.uid);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (profiles.length === 0) {
      if (selectedProfile) {
        setSelectedProfile(null);
      }

      return;
    }

    const freshSelectedProfile = selectedProfile
      ? profiles.find(profile => profile.id === selectedProfile.id)
      : undefined;

    if (freshSelectedProfile) {
      if (freshSelectedProfile !== selectedProfile) {
        setSelectedProfile(freshSelectedProfile);
      }

      return;
    }

    setSelectedProfile(
      profiles.find(profile => profile.isDefault) ?? profiles[0],
    );
  }, [isLoading, profiles, selectedProfile, setSelectedProfile]);

  const handleEdit = useCallback(() => {
    if (!selectedProfile) {
      return;
    }

    router.push(`/profiles/${selectedProfile.id}`);
  }, [selectedProfile]);

  const handleLogout = useCallback(async () => {
    try {
      await logout();
      setSelectedProfile(null);
      router.replace('/');
    } catch (logoutError) {
      Alert.alert(
        'Không thể đăng xuất',
        logoutError instanceof Error
          ? logoutError.message
          : 'Đã xảy ra lỗi không xác định.',
      );
    }
  }, [setSelectedProfile]);

  const handleSelectProfile = useCallback(
    (profile: PatientProfile) => {
      setSelectedProfile(profile);
      setSwitcherVisible(false);
    },
    [setSelectedProfile],
  );

  if (isAuthLoading || isLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.mutedText}>Đang tải hồ sơ...</Text>
      </SafeAreaView>
    );
  }

  if (!firebaseUser) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyTitle}>Bạn cần đăng nhập</Text>
        <Pressable
          onPress={() =>
            router.push({
              pathname: '/auth-modal',
              params: { mode: 'login' },
            })
          }
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Đăng nhập</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.emptyTitle}>Không thể tải hồ sơ</Text>
        <Text style={styles.errorText}>
          {error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi không xác định.'}
        </Text>
        <Pressable onPress={() => refetch()} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Thử lại</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  if (!selectedProfile) {
    return (
      <SafeAreaView style={styles.center}>
        <View style={styles.emptyAvatar}>
          <Text style={styles.emptyAvatarText}>+</Text>
        </View>
        <Text style={styles.emptyTitle}>Chưa có hồ sơ bệnh nhân</Text>
        <Text style={styles.emptyDescription}>
          Tạo hồ sơ bệnh nhân để đặt lịch khám và theo dõi thông tin y tế.
        </Text>
        <Pressable
          onPress={() => router.push('/profiles/create')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Tạo hồ sơ bệnh nhân</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {selectedProfile.fullName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.headerContent}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>{selectedProfile.fullName}</Text>
              {selectedProfile.isDefault && (
                <Text style={styles.defaultBadge}>Mặc định</Text>
              )}
            </View>
            <Text style={styles.relationship}>
              {relationshipLabels[selectedProfile.relationship]}
            </Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <InfoRow label="Ngày sinh" value={formatDate(selectedProfile)} />
          <InfoRow
            label="Giới tính"
            value={genderLabels[selectedProfile.gender]}
          />
          <InfoRow
            label="Số điện thoại"
            value={displayValue(selectedProfile.phoneNumber)}
          />
          <InfoRow
            label="Địa chỉ"
            value={displayValue(selectedProfile.address)}
          />
          <InfoRow
            label="Nhóm máu"
            value={displayValue(selectedProfile.bloodType)}
          />
          <InfoRow
            label="Số bảo hiểm"
            value={displayValue(selectedProfile.insuranceNumber)}
          />
        </View>

        <View style={styles.actionsCard}>
          <Pressable onPress={handleEdit} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Chỉnh sửa hồ sơ</Text>
          </Pressable>

          <Pressable
            onPress={() => setSwitcherVisible(true)}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Đổi hồ sơ</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/profiles')}
            style={styles.secondaryButton}
          >
            <Text style={styles.secondaryButtonText}>Quản lý hồ sơ</Text>
          </Pressable>

          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          </Pressable>
        </View>
      </ScrollView>

      <ProfileSwitcher
        profiles={profiles}
        selectedProfileId={selectedProfile.id}
        visible={isSwitcherVisible}
        onClose={() => setSwitcherVisible(false)}
        onSelect={handleSelectProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 20,
    paddingBottom: 36,
    gap: 16,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 14,
    backgroundColor: '#F8FAFC',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
  },
  avatarText: {
    color: '#0369A1',
    fontSize: 26,
    fontWeight: '800',
  },
  headerContent: {
    flex: 1,
    gap: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  name: {
    color: '#0F172A',
    fontSize: 22,
    fontWeight: '800',
  },
  relationship: {
    color: '#475569',
    fontSize: 15,
  },
  defaultBadge: {
    overflow: 'hidden',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: '#DCFCE7',
    color: '#166534',
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  sectionTitle: {
    marginBottom: 4,
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  infoRow: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 4,
  },
  infoLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    color: '#0F172A',
    fontSize: 16,
    lineHeight: 22,
  },
  actionsCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  primaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#0284C7',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  secondaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: '#0284C7',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  secondaryButtonText: {
    color: '#0369A1',
    fontSize: 16,
    fontWeight: '800',
  },
  logoutButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: '#FEF2F2',
  },
  logoutButtonText: {
    color: '#B91C1C',
    fontSize: 16,
    fontWeight: '800',
  },
  mutedText: {
    color: '#64748B',
  },
  errorText: {
    color: '#B91C1C',
    textAlign: 'center',
  },
  emptyAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
  },
  emptyAvatarText: {
    color: '#0369A1',
    fontSize: 34,
    fontWeight: '700',
  },
  emptyTitle: {
    color: '#0F172A',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyDescription: {
    maxWidth: 320,
    color: '#64748B',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(15, 23, 42, 0.38)',
  },
  modalSheet: {
    maxHeight: '78%',
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    color: '#0F172A',
    fontSize: 18,
    fontWeight: '800',
  },
  closeText: {
    color: '#0369A1',
    fontWeight: '800',
  },
  switcherList: {
    padding: 16,
    gap: 10,
  },
  switcherItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  switcherItemSelected: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  smallAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F2FE',
  },
  smallAvatarText: {
    color: '#0369A1',
    fontSize: 18,
    fontWeight: '800',
  },
  switcherContent: {
    flex: 1,
    gap: 3,
  },
  switcherName: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '800',
  },
  switcherMeta: {
    color: '#64748B',
  },
  switcherBadge: {
    color: '#166534',
    fontSize: 12,
    fontWeight: '800',
  },
});
