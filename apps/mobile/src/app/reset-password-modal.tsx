import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { FirebaseError } from 'firebase/app';
import { router, useLocalSearchParams } from 'expo-router';

import { resetPassword } from '@/services/auth.service';

type ResetPasswordParams = {
  email?: string;
};

function getResetPasswordErrorMessage(error: unknown): string {
  if (!(error instanceof FirebaseError)) {
    return error instanceof Error
      ? error.message
      : 'Không thể gửi email đặt lại mật khẩu.';
  }

  switch (error.code) {
    case 'auth/invalid-email':
      return 'Email không đúng định dạng.';

    case 'auth/missing-email':
      return 'Vui lòng nhập email.';

    case 'auth/user-not-found':
      /*
       * Một số cấu hình Firebase có thể không trả mã này
       * để tránh tiết lộ email có tồn tại hay không.
       */
      return 'Không tìm thấy tài khoản tương ứng với email này.';

    case 'auth/too-many-requests':
      return 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.';

    case 'auth/network-request-failed':
      return 'Không thể kết nối mạng. Vui lòng kiểm tra Internet.';

    default:
      return 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.';
  }
}

export default function ResetPasswordModalScreen() {
  const params = useLocalSearchParams<ResetPasswordParams>();

  const [email, setEmail] = useState(
    typeof params.email === 'string' ? params.email : '',
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: '/auth-modal',
      params: {
        mode: 'login',
      },
    });
  };

  const handleResetPassword = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Alert.alert('Thông báo', 'Vui lòng nhập email.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      Alert.alert('Thông báo', 'Email không đúng định dạng.');
      return;
    }

    try {
      setIsLoading(true);

      await resetPassword({
        email: normalizedEmail,
      });

      Alert.alert(
        'Kiểm tra email',
        'Nếu email này đã được đăng ký, bạn sẽ nhận được liên kết đặt lại mật khẩu.',
        [
          {
            text: 'Đồng ý',
            onPress: handleClose,
          },
        ],
      );
    } catch (error) {
      console.error('Reset password error:', error);

      Alert.alert(
        'Không thể gửi email',
        getResetPasswordErrorMessage(error),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.overlay}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={handleClose}
      />

      <View style={styles.modal}>
        <View style={styles.header}>
          <Text style={styles.title}>Quên mật khẩu</Text>

          <Pressable
            onPress={handleClose}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Đóng"
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>
        </View>

        <Text style={styles.description}>
          Nhập email đã đăng ký. Hệ thống sẽ gửi cho bạn liên kết để
          tạo mật khẩu mới.
        </Text>

        <Text style={styles.label}>Email</Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!isLoading}
          returnKeyType="send"
          onSubmitEditing={handleResetPassword}
          style={styles.input}
        />

        <Pressable
          onPress={handleResetPassword}
          disabled={isLoading}
          style={({ pressed }) => [
            styles.submitButton,
            pressed && !isLoading && styles.buttonPressed,
            isLoading && styles.buttonDisabled,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.submitButtonText}>
              Gửi email đặt lại mật khẩu
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={handleClose}
          disabled={isLoading}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>
            Quay lại đăng nhập
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  modal: {
    width: '100%',
    maxWidth: 430,
    alignSelf: 'center',
    padding: 24,
    borderRadius: 24,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    color: '#0f172a',
    fontSize: 24,
    fontWeight: '700',
  },
  closeText: {
    color: '#64748b',
    fontSize: 22,
    fontWeight: '600',
  },
  description: {
    marginTop: 12,
    marginBottom: 24,
    color: '#64748b',
    fontSize: 15,
    lineHeight: 22,
  },
  label: {
    marginBottom: 8,
    color: '#334155',
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    height: 52,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 14,
    color: '#0f172a',
    backgroundColor: '#f8fafc',
    fontSize: 16,
  },
  submitButton: {
    minHeight: 52,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: '#0284c7',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#0284c7',
    fontSize: 15,
    fontWeight: '600',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});