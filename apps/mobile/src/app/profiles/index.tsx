import { router } from 'expo-router';
import { useCallback } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { auth } from '@/config/firebase';
import { ProfileCard } from '@/modules/profile/components/ProfileCard';
import {
  useDeletePatientProfile,
  usePatientProfiles,
} from '@/modules/profile/hooks/useProfiles';

export default function ProfileListScreen() {
  const uid = auth.currentUser?.uid;

  const {
  data: profiles = [],
  isLoading,
  isError,
  error,
  failureCount,
  refetch,
} = usePatientProfiles(uid);

console.log('UID:', uid);
console.log('Profiles isError:', isError);
console.log('Profiles error object:', error);
console.log(
  'Profiles error message:',
  error instanceof Error ? error.message : error,
);
console.log('Profiles failure count:', failureCount);

    
  const deleteMutation = useDeletePatientProfile(uid);

  const handleDelete = useCallback(
    (profileId: string, fullName: string) => {
      Alert.alert(
        'Xóa hồ sơ',
        `Bạn có chắc muốn xóa hồ sơ của ${fullName}?`,
        [
          {
            text: 'Hủy',
            style: 'cancel',
          },
          {
            text: 'Xóa',
            style: 'destructive',
            onPress: async () => {
              try {
                await deleteMutation.mutateAsync(profileId);
              } catch (error) {
                Alert.alert(
                  'Không thể xóa',
                  error instanceof Error
                    ? error.message
                    : 'Đã xảy ra lỗi.',
                );
              }
            },
          },
        ],
      );
    },
    [deleteMutation],
  );

  if (!uid) {
    return (
      <View style={styles.center}>
        <Text>Bạn cần đăng nhập để xem hồ sơ.</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải danh sách hồ sơ.</Text>

        <Pressable onPress={() => refetch()}>
          <Text style={styles.retryText}>Thử lại</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}> 
        <View>
          <Text style={styles.title}>Hồ sơ bệnh nhân</Text>
          <Text style={styles.subtitle}>
            Quản lý hồ sơ của bạn và người thân
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/profiles/create')}
          style={styles.addButton}
        >
          <Text style={styles.addButtonText}>＋ Thêm</Text>
        </Pressable>
      </View>

      <FlatList
        data={profiles}
        keyExtractor={item => item.id}
        contentContainerStyle={
          profiles.length === 0
            ? styles.emptyList
            : styles.list
        }
        renderItem={({ item }) => (
          <ProfileCard
            profile={item}
            onPress={() =>
              router.replace({
                pathname: '/(tabs)',
                params: {
                  profileId: item.id,
                },
              })
            }
            onDelete={() =>
              handleDelete(item.id, item.fullName)
            }
          />
        )}
        ItemSeparatorComponent={() => (
          <View style={styles.separator} />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>
              Chưa có hồ sơ bệnh nhân
            </Text>

            <Text style={styles.emptyDescription}>
              Hãy tạo hồ sơ đầu tiên để bắt đầu đặt lịch khám.
            </Text>

            <Pressable
              onPress={() => router.push('/profiles/create')}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>
                Tạo hồ sơ
              </Text>
            </Pressable>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#f7f9fc',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    marginTop: 4,
    color: '#607d8b',
  },
  addButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1976d2',
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  list: {
    paddingBottom: 32,
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
    gap: 12,
  },
  retryText: {
    color: '#1976d2',
    fontWeight: '600',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  emptyDescription: {
    textAlign: 'center',
    color: '#607d8b',
    lineHeight: 21,
  },
  primaryButton: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#1976d2',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
