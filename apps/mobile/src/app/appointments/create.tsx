import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';
import { router, type Href } from 'expo-router';
import { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { homeColors } from '@/constants/colors';
import { AppointmentDateModal } from '@/modules/appointment/components/AppointmentDateModal';
import { BookingSummary } from '@/modules/appointment/components/BookingSummary';
import { TimeSlotPicker } from '@/modules/appointment/components/TimeSlotPicker';
import {
  getAppointmentErrorMessage,
  useCreateAppointment,
  useDepartments,
  useDoctors,
  useTimeSlots,
} from '@/modules/appointment/hooks/useAppointments';
import {
  appointmentSchema,
  type AppointmentFormValues,
} from '@/modules/appointment/schemas/appointment.schema';
import type { PatientProfile } from '@/modules/profile/types/profile.types';
import { useAuth } from '@/providers/AuthProvider';
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

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export default function CreateAppointmentScreen() {
  const { firebaseUser, isAuthLoading } = useAuth();
  const selectedProfile = useSessionStore(state => state.selectedProfile);
  const [isDateModalVisible, setDateModalVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      patientProfileId: selectedProfile?.id ?? '',
      departmentId: '',
      doctorId: '',
      appointmentDate: startOfToday(),
      timeSlot: '',
      reason: '',
      symptoms: '',
    },
  });

  const departmentId = useWatch({ control, name: 'departmentId' });
  const doctorId = useWatch({ control, name: 'doctorId' });
  const appointmentDate = useWatch({
    control,
    name: 'appointmentDate',
  });
  const timeSlot = useWatch({ control, name: 'timeSlot' });

  const {
    data: departments = [],
    isLoading: isLoadingDepartments,
    isError: isDepartmentsError,
  } = useDepartments();
  const {
    data: doctors = [],
    isLoading: isLoadingDoctors,
  } = useDoctors(departmentId);

  const selectedDepartment = departments.find(
    department => department.id === departmentId,
  );
  const selectedDoctor = doctors.find(doctor => doctor.id === doctorId);

  const {
    data: timeSlots = [],
    isLoading: isLoadingSlots,
    refetch: refetchSlots,
  } = useTimeSlots(selectedDoctor, appointmentDate);

  const createMutation = useCreateAppointment(firebaseUser?.uid);

  useEffect(() => {
    setValue('patientProfileId', selectedProfile?.id ?? '', {
      shouldValidate: true,
    });
  }, [selectedProfile?.id, setValue]);

  const handleSelectDepartment = (nextDepartmentId: string) => {
    setValue('departmentId', nextDepartmentId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('doctorId', '', { shouldDirty: true });
    setValue('timeSlot', '', { shouldDirty: true });
  };

  const handleSelectDoctor = (nextDoctorId: string) => {
    setValue('doctorId', nextDoctorId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('timeSlot', '', { shouldDirty: true });
  };

  const handleConfirmDate = (date: Date) => {
    setValue('appointmentDate', date, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue('timeSlot', '', { shouldDirty: true });
    setDateModalVisible(false);
  };

  const onSubmit = async (values: AppointmentFormValues) => {
    if (!firebaseUser || !selectedProfile || !selectedDepartment || !selectedDoctor) {
      Alert.alert('Thiếu thông tin', 'Vui lòng kiểm tra lại lịch khám.');
      return;
    }

    try {
      const appointmentId = await createMutation.mutateAsync({
        accountUid: firebaseUser.uid,
        patientProfileId: selectedProfile.id,
        patientName: selectedProfile.fullName,
        department: selectedDepartment,
        doctor: selectedDoctor,
        appointmentDate: values.appointmentDate,
        timeSlot: values.timeSlot,
        reason: values.reason,
        symptoms: values.symptoms,
      });

      Alert.alert('Thành công', 'Lịch khám đã được tạo.');
      router.replace(`/appointments/${appointmentId}` as Href);
    } catch (error) {
      await refetchSlots();
      Alert.alert('Không thể đặt lịch', getAppointmentErrorMessage(error));
    }
  };

  if (isAuthLoading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  if (!firebaseUser) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Bạn cần đăng nhập</Text>
        <Text style={styles.description}>
          Đăng nhập để đặt lịch khám.
        </Text>
      </SafeAreaView>
    );
  }

  if (!selectedProfile) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={styles.title}>Chưa chọn bệnh nhân</Text>
        <Text style={styles.description}>
          Vui lòng chọn hoặc tạo hồ sơ bệnh nhân trước khi đặt lịch.
        </Text>
        <Pressable
          onPress={() => router.push('/profiles')}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Quản lý hồ sơ</Text>
        </Pressable>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Đặt lịch khám</Text>
          <Text style={styles.description}>
            Chọn chuyên khoa, bác sĩ, ngày khám và khung giờ phù hợp.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bệnh nhân</Text>
          <View style={styles.patientBox}>
            <Text style={styles.patientName}>{selectedProfile.fullName}</Text>
            <Text style={styles.patientMeta}>
              {relationshipLabels[selectedProfile.relationship]}
            </Text>
          </View>
          {errors.patientProfileId ? (
            <Text style={styles.errorText}>
              {errors.patientProfileId.message}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Chuyên khoa</Text>
          {isLoadingDepartments ? (
            <ActivityIndicator />
          ) : isDepartmentsError ? (
            <Text style={styles.errorText}>
              Không thể tải danh sách chuyên khoa.
            </Text>
          ) : (
            <View style={styles.optionList}>
              {departments.map(department => (
                <Pressable
                  key={department.id}
                  onPress={() => handleSelectDepartment(department.id)}
                  style={[
                    styles.option,
                    department.id === departmentId && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      department.id === departmentId &&
                        styles.optionSelectedText,
                    ]}
                  >
                    {department.name}
                  </Text>
                  {department.description ? (
                    <Text style={styles.optionDescription}>
                      {department.description}
                    </Text>
                  ) : null}
                </Pressable>
              ))}
            </View>
          )}
          {errors.departmentId ? (
            <Text style={styles.errorText}>
              {errors.departmentId.message}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bác sĩ</Text>
          {isLoadingDoctors ? (
            <ActivityIndicator />
          ) : (
            <View style={styles.optionList}>
              {doctors.map(doctor => (
                <Pressable
                  key={doctor.id}
                  onPress={() => handleSelectDoctor(doctor.id)}
                  style={[
                    styles.option,
                    doctor.id === doctorId && styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionTitle,
                      doctor.id === doctorId &&
                        styles.optionSelectedText,
                    ]}
                  >
                    {doctor.name}
                  </Text>
                  <Text style={styles.optionDescription}>
                    {doctor.specialty ?? doctor.title ?? 'Bác sĩ phụ trách'}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          {!departmentId ? (
            <Text style={styles.helperText}>
              Chọn chuyên khoa để xem bác sĩ.
            </Text>
          ) : null}
          {errors.doctorId ? (
            <Text style={styles.errorText}>
              {errors.doctorId.message}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ngày khám</Text>
          <Pressable
            onPress={() => setDateModalVisible(true)}
            style={styles.dateButton}
          >
            <Text style={styles.dateText}>
              {appointmentDate.toLocaleDateString('vi-VN')}
            </Text>
            <Ionicons
              name="calendar-outline"
              size={22}
              color={homeColors.primary}
            />
          </Pressable>
          {errors.appointmentDate ? (
            <Text style={styles.errorText}>
              {errors.appointmentDate.message}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giờ khám</Text>
          {isLoadingSlots ? (
            <ActivityIndicator />
          ) : (
            <TimeSlotPicker
              selectedSlot={timeSlot}
              slots={timeSlots}
              onSelect={slot =>
                setValue('timeSlot', slot, {
                  shouldDirty: true,
                  shouldValidate: true,
                })
              }
            />
          )}
          {errors.timeSlot ? (
            <Text style={styles.errorText}>
              {errors.timeSlot.message}
            </Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lý do khám</Text>
          <Controller
            control={control}
            name="reason"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Nhập lý do khám"
                style={styles.textArea}
                textAlignVertical="top"
                value={value}
              />
            )}
          />
          {errors.reason ? (
            <Text style={styles.errorText}>{errors.reason.message}</Text>
          ) : null}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Triệu chứng</Text>
          <Controller
            control={control}
            name="symptoms"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                multiline
                onBlur={onBlur}
                onChangeText={onChange}
                placeholder="Triệu chứng nếu có"
                style={styles.textArea}
                textAlignVertical="top"
                value={value}
              />
            )}
          />
        </View>

        <BookingSummary
          appointmentDate={appointmentDate}
          department={selectedDepartment}
          doctor={selectedDoctor}
          patientName={selectedProfile.fullName}
          relationship={relationshipLabels[selectedProfile.relationship]}
          timeSlot={timeSlot}
        />

        <Pressable
          disabled={createMutation.isPending}
          onPress={handleSubmit(onSubmit)}
          style={[
            styles.submitButton,
            createMutation.isPending && styles.submitButtonDisabled,
          ]}
        >
          <Text style={styles.submitButtonText}>
            {createMutation.isPending ? 'Đang đặt lịch...' : 'Xác nhận đặt lịch'}
          </Text>
        </Pressable>
      </ScrollView>

      {isDateModalVisible ? (
        <AppointmentDateModal
          key={appointmentDate.toISOString()}
          onClose={() => setDateModalVisible(false)}
          onConfirm={handleConfirmDate}
          value={appointmentDate}
          visible={isDateModalVisible}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: homeColors.background,
  },
  content: {
    padding: 18,
    paddingBottom: 40,
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
    gap: 5,
  },
  title: {
    color: homeColors.text,
    fontSize: 24,
    fontWeight: '800',
  },
  description: {
    color: homeColors.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    color: homeColors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  patientBox: {
    padding: 16,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    gap: 4,
  },
  patientName: {
    color: homeColors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  patientMeta: {
    color: homeColors.textMuted,
    fontWeight: '700',
  },
  optionList: {
    gap: 10,
  },
  option: {
    padding: 14,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    gap: 4,
  },
  optionSelected: {
    borderColor: homeColors.primary,
    backgroundColor: homeColors.primarySoft,
  },
  optionTitle: {
    color: homeColors.text,
    fontSize: 16,
    fontWeight: '800',
  },
  optionSelectedText: {
    color: homeColors.primaryDark,
  },
  optionDescription: {
    color: homeColors.textMuted,
    lineHeight: 20,
  },
  helperText: {
    color: homeColors.textMuted,
  },
  dateButton: {
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
  },
  dateText: {
    color: homeColors.text,
    fontSize: 17,
    fontWeight: '800',
  },
  textArea: {
    minHeight: 96,
    padding: 14,
    borderWidth: 1,
    borderColor: homeColors.border,
    borderRadius: 8,
    backgroundColor: homeColors.surface,
    color: homeColors.text,
    fontSize: 15,
    lineHeight: 21,
  },
  errorText: {
    color: homeColors.danger,
    lineHeight: 20,
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
  submitButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: homeColors.primary,
  },
  submitButtonDisabled: {
    backgroundColor: homeColors.disabled,
  },
  submitButtonText: {
    color: homeColors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
});
