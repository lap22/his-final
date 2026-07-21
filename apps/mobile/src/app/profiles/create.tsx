import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useForm } from 'react-hook-form';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { auth } from '@/config/firebase';
import ProfileForm from '@/modules/profile/components/ProfileForm';
import { useCreatePatientProfile } from '@/modules/profile/hooks/useProfiles';
import {
  patientProfileSchema,
  type PatientProfileSchema,
} from '@/modules/profile/schemas/profile.schema';

export default function CreateProfileScreen() {
  const uid = auth.currentUser?.uid;
  const createMutation = useCreatePatientProfile(uid);

  const {
    control,
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

  const onSubmit = async (values: PatientProfileSchema) => {
    try {
      await createMutation.mutateAsync(values);

      Alert.alert('Thành công', 'Đã tạo hồ sơ bệnh nhân.');
      router.back();
    } catch (error) {
      console.error('Create profile error:', error);

      Alert.alert(
        'Không thể tạo hồ sơ',
        error instanceof Error
          ? error.message
          : 'Đã xảy ra lỗi không xác định.',
      );
    }
  };

  if (!uid) {
    return (
      <View style={styles.center}>
        <Text>Bạn cần đăng nhập để tạo hồ sơ.</Text>
      </View>
    );
  }

  return (
    <ProfileForm
      control={control}
      errors={errors}
      isSubmitting={createMutation.isPending}
      submitLabel="Tạo hồ sơ"
      onSubmit={handleSubmit(onSubmit)}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});