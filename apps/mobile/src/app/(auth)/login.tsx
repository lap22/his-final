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
import { loginWithEmail } from '@/services/auth.service';



export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (password.length < 6) {
      Alert.alert(
        'Mật khẩu sai',
      );
      return;
    }

    try {
      setIsSubmitting(true);
      await loginWithEmail({
        email,
        password,
      });

      Alert.alert('Thành công', 'Đăng nhập thành công.');
      router.replace('/');
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Không thể đăng nhập.';

      Alert.alert('Đăng nhập thất bại', message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đăng nhập</Text>
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
        onPress={handleLogin}
        disabled={isSubmitting}
        style={styles.button}
      >
        {isSubmitting ? (
          <ActivityIndicator />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
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