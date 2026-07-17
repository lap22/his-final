import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />

      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />

        <Stack.Screen
          name="tabs"
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="auth-modal"
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
            gestureEnabled: true,
          }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{
            presentation: 'transparentModal',
            animation: 'slide_from_bottom',
            headerShown: false,
            gestureEnabled: true,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}