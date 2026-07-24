import { zodResolver } from '@hookform/resolvers/zod';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  View,
} from 'react-native';


import ProfileForm from '@/modules/profile/components/ProfileForm';
import {
  usePatientProfile,
  useUpdatePatientProfile,
} from '@/modules/profile/hooks/useProfiles';
import {
  patientProfileSchema,
  type PatientProfileSchema,
} from '@/modules/profile/schemas/profile.schema';
import { useAuth } from '@/providers/AuthProvider';


export default function ProfileDetailScreen() {
  const { profileId } = useLocalSearchParams<{
    profileId: string;
  }>();

  const { user, isAuthLoading } = useAuth();
  const uid = user?.uid;

  const {
    data: profile,
    isLoading,
    isError,
    error,
  } = usePatientProfile(uid, profileId);

  const updateMutation = useUpdatePatientProfile(uid);

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientProfileSchema>({
    resolver: zodResolver(patientProfileSchema),
    defaultValues: {
      fullName: '',
      relationship: 'self',
      gender: 'male',
      dateOfBirth: new Date(2000, 0, 1),
      phoneNumber: '',
      address: '',
      bloodType: '',
      insuranceNumber: '',
      isDefault: false,
    },
  });

  useEffect(() => {
    if (!profile) {
      return;
    }

    reset({
      fullName: profile.fullName,
      relationship: profile.relationship,
      gender: profile.gender,
      dateOfBirth: profile.dateOfBirth.toDate(),
      phoneNumber: profile.phoneNumber ?? '',
      address: profile.address ?? '',
      bloodType: profile.bloodType ?? '',
      insuranceNumber: profile.insuranceNumber ?? '',
      isDefault: profile.isDefault,
    });
  }, [profile, reset]);

  const onSubmit = async (values: PatientProfileSchema) => {
    if (!profileId) {
      Alert.alert('Lỗi', 'Không tìm thấy mã hồ sơ.');
      return;
    }

    try {
      await updateMutation.mutateAsync({
        profileId,
        values,
      });

      Alert.alert('Thành công', 'Đã cập nhật hồ sơ bệnh nhân.');
      router.back();
    } catch (updateError) {
      Alert.alert(
        'Không thể cập nhật',
        updateError instanceof Error
          ? updateError.message
          : 'Đã xảy ra lỗi không xác định.',
      );
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!uid) {
    return (
      <View style={styles.center}>
        <Text>Bạn cần đăng nhập để xem hồ sơ.</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.center}>
        <Text>Không thể tải hồ sơ.</Text>

        <Text style={styles.errorText}>
          {error instanceof Error
            ? error.message
            : 'Đã xảy ra lỗi không xác định.'}
        </Text>
      </View>
    );
  }

  if (!profile) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy hồ sơ bệnh nhân.</Text>
      </View>
    );
  }

  return (
    <ProfileForm
      control={control}
      errors={errors}
      isSubmitting={updateMutation.isPending}
      submitLabel="Cập nhật hồ sơ"
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 10,
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
});