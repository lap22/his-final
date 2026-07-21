// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';

// import { AuthProvider } from '@/contexts/AuthContext';
// import { useColorScheme } from 'react-native/Libraries/Utilities/Appearance';

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
  
//   return (
//     <AuthProvider>
//       <StatusBar style="dark" />

//       <Stack
//         screenOptions={{
//           headerShown: false,
//         }}
//       >
//         <Stack.Screen name="index" />

//         <Stack.Screen
//           name="tabs"
//           options={{
//             headerShown: false,
//           }}
//         />

//         <Stack.Screen
//           name="auth-modal"
//           options={{
//             presentation: 'transparentModal',
//             animation: 'slide_from_bottom',
//             headerShown: false,
//             gestureEnabled: true,
//           }}
//         />
//         <Stack.Screen
//           name="forgot-password"
//           options={{
//             presentation: 'transparentModal',
//             animation: 'slide_from_bottom',
//             headerShown: false,
//             gestureEnabled: true,
//           }}
//         />
//       </Stack>
//     </AuthProvider>
//   );
// }
import {
  DarkTheme,
  DefaultTheme,
  Stack,
  ThemeProvider,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppProviders from '@/providers/AppProviders';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AppProviders>
      <ThemeProvider
        value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      >
        <AnimatedSplashOverlay />

        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="profiles" />
        </Stack>
      </ThemeProvider>
    </AppProviders>
  );
}