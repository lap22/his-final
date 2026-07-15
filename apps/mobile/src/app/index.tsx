import { router } from 'expo-router';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>HIS Healthcare</Text>

        <Text style={styles.description}>
          Đặt lịch khám, theo dõi hồ sơ bệnh án và quản lý sức
          khỏe của bạn.
        </Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() =>
            router.push({
              pathname: '/(auth)/login',
              params: {
                mode: 'login',
              },
            })
          }
        >
          <Text style={styles.primaryButtonText}>
            Đăng nhập
          </Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() =>
            router.push({
              pathname: '/(auth)/register',
              params: {
                mode: 'register',
              },
            })
          }
        >
          <Text style={styles.secondaryButtonText}>
            Tạo tài khoản
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    gap: 16,
  },

  title: {
    color: '#0F172A',
    fontSize: 36,
    fontWeight: '800',
    textAlign: 'center',
  },

  description: {
    marginBottom: 24,
    color: '#64748B',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },

  primaryButton: {
    minHeight: 54,
    borderRadius: 14,
    backgroundColor: '#0284C7',
    justifyContent: 'center',
    alignItems: 'center',
  },

  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    minHeight: 54,
    borderWidth: 1,
    borderColor: '#0284C7',
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#0284C7',
    fontSize: 16,
    fontWeight: '700',
  },
});