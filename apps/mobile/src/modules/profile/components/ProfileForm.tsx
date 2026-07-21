import DateTimePicker from '@react-native-community/datetimepicker';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { PatientProfileSchema } from '../schemas/profile.schema';

interface ProfileFormProps {
  control: Control<PatientProfileSchema>;
  errors: FieldErrors<PatientProfileSchema>;
  isSubmitting?: boolean;
  submitLabel?: string;
  onSubmit: () => void;
}

const relationships = [
  { value: 'self', label: 'Bản thân' },
  { value: 'father', label: 'Bố' },
  { value: 'mother', label: 'Mẹ' },
  { value: 'husband', label: 'Chồng' },
  { value: 'wife', label: 'Vợ' },
  { value: 'child', label: 'Con' },
  { value: 'sibling', label: 'Anh/Chị/Em' },
  { value: 'other', label: 'Khác' },
] as const;

const genders = [
  { value: 'male', label: 'Nam' },
  { value: 'female', label: 'Nữ' },
  { value: 'other', label: 'Khác' },
] as const;

export default function ProfileForm({
  control,
  errors,
  isSubmitting = false,
  submitLabel = 'Lưu hồ sơ',
  onSubmit,
}: ProfileFormProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <FormLabel text="Họ và tên" />

      <Controller
        control={control}
        name="fullName"
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder="Nhập họ và tên"
            style={styles.input}
          />
        )}
      />

      <ErrorText message={errors.fullName?.message} />

      <FormLabel text="Mối quan hệ" />

      <Controller
        control={control}
        name="relationship"
        render={({ field: { value, onChange } }) => (
          <View style={styles.options}>
            {relationships.map(item => (
              <OptionButton
                key={item.value}
                label={item.label}
                selected={value === item.value}
                onPress={() => onChange(item.value)}
              />
            ))}
          </View>
        )}
      />

      <ErrorText message={errors.relationship?.message} />

      <FormLabel text="Giới tính" />

      <Controller
        control={control}
        name="gender"
        render={({ field: { value, onChange } }) => (
          <View style={styles.options}>
            {genders.map(item => (
              <OptionButton
                key={item.value}
                label={item.label}
                selected={value === item.value}
                onPress={() => onChange(item.value)}
              />
            ))}
          </View>
        )}
      />

      <ErrorText message={errors.gender?.message} />

      <FormLabel text="Ngày sinh" />

      <Controller
        control={control}
        name="dateOfBirth"
        render={({ field: { value, onChange } }) => (
          <>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text>{value.toLocaleDateString('vi-VN')}</Text>
            </Pressable>

            {showDatePicker && (
              <DateTimePicker
                value={value}
                mode="date"
                maximumDate={new Date()}
                onChange={(_, selectedDate) => {
                  setShowDatePicker(false);

                  if (selectedDate) {
                    onChange(selectedDate);
                  }
                }}
              />
            )}
          </>
        )}
      />

      <ErrorText message={errors.dateOfBirth?.message} />

      <ControlledTextInput
        control={control}
        name="phoneNumber"
        label="Số điện thoại"
        placeholder="Nhập số điện thoại"
        keyboardType="phone-pad"
        error={errors.phoneNumber?.message}
      />

      <ControlledTextInput
        control={control}
        name="address"
        label="Địa chỉ"
        placeholder="Nhập địa chỉ"
        error={errors.address?.message}
      />

      <ControlledTextInput
        control={control}
        name="bloodType"
        label="Nhóm máu"
        placeholder="Ví dụ: A+, B-, O+"
        error={errors.bloodType?.message}
      />

      <ControlledTextInput
        control={control}
        name="insuranceNumber"
        label="Mã bảo hiểm y tế"
        placeholder="Nhập mã BHYT"
        error={errors.insuranceNumber?.message}
      />

      <Controller
        control={control}
        name="isDefault"
        render={({ field: { value, onChange } }) => (
          <View style={styles.switchRow}>
            <View style={styles.switchContent}>
              <Text style={styles.label}>Hồ sơ mặc định</Text>
              <Text style={styles.helper}>
                Hồ sơ được chọn sẵn khi đặt lịch khám
              </Text>
            </View>

            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />

      <Pressable
        disabled={isSubmitting}
        onPress={onSubmit}
        style={[
          styles.submitButton,
          isSubmitting && styles.submitButtonDisabled,
        ]}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#ffffff" />
        ) : (
          <Text style={styles.submitText}>{submitLabel}</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

interface ControlledTextInputProps {
  control: Control<PatientProfileSchema>;
  name:
    | 'phoneNumber'
    | 'address'
    | 'bloodType'
    | 'insuranceNumber';
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'phone-pad';
  error?: string;
}

function ControlledTextInput({
  control,
  name,
  label,
  placeholder,
  keyboardType = 'default',
  error,
}: ControlledTextInputProps) {
  return (
    <>
      <FormLabel text={label} />

      <Controller
        control={control}
        name={name}
        render={({ field: { value, onChange, onBlur } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            placeholder={placeholder}
            keyboardType={keyboardType}
            style={styles.input}
          />
        )}
      />

      <ErrorText message={error} />
    </>
  );
}

function FormLabel({ text }: { text: string }) {
  return <Text style={styles.label}>{text}</Text>;
}

function ErrorText({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <Text style={styles.error}>{message}</Text>;
}

function OptionButton({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.option,
        selected && styles.optionSelected,
      ]}
    >
      <Text
        style={[
          styles.optionText,
          selected && styles.optionTextSelected,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: '#ffffff',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  helper: {
    marginTop: 3,
    color: '#607d8b',
    fontSize: 12,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#d6dde5',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
  },
  dateInput: {
    minHeight: 50,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d6dde5',
    borderRadius: 10,
    paddingHorizontal: 14,
    backgroundColor: '#ffffff',
  },
  error: {
    marginTop: 5,
    color: '#d32f2f',
    fontSize: 12,
  },
  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: '#d6dde5',
    borderRadius: 20,
  },
  optionSelected: {
    borderColor: '#1976d2',
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    color: '#455a64',
  },
  optionTextSelected: {
    color: '#1565c0',
    fontWeight: '600',
  },
  switchRow: {
    marginTop: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchContent: {
    flex: 1,
  },
  submitButton: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    borderRadius: 10,
    backgroundColor: '#1976d2',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});