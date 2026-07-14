import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { registerPatient } from '@/services/auth.service';



export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRegister = async () => {
    if (!displayName.trim() || !email.trim() || !password) {
      Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ thông tin.');
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        'Mật khẩu không hợp lệ',
        'Mật khẩu phải có ít nhất 6 ký tự.',
      );
      return;
    }

    try {
      setIsSubmitting(true);

      await registerPatient({
        displayName,
        phoneNumber,
        email,
        password,
      });

      Alert.alert('Thành công', 'Đăng ký tài khoản thành công.');
      router.replace('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đăng ký tài khoản.';

      Alert.alert('Đăng ký thất bại', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo tài khoản</Text>

      <TextInput
        value={displayName}
        onChangeText={setDisplayName}
        placeholder="Họ và tên"
        style={styles.input}
      />

      <TextInput
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Số điện thoại"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        secureTextEntry
        style={styles.input}
      />

      <Pressable
        onPress={handleRegister}
        disabled={isSubmitting}
        style={styles.button}
      >
        {isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Đăng ký</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    gap: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    minHeight: 50,
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  button: {
    minHeight: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1976d2',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});