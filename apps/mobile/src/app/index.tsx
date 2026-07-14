import {  router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
<Pressable onPress={() => router.push('/register')}>
  <Text>Đi đến trang đăng ký</Text>
</Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
  },
  link: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});