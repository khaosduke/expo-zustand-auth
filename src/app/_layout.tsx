import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { SplashScreenController } from '@/components/SplashScreen'
import { useAuthContext } from '@/contexts/AuthContext'
import AuthProvider from '@/providers/AuthProvider'
import { useColorScheme } from 'react-native'

// Separate RootNavigator so we can access the AuthContext
function RootNavigator() {
  const { isLoggedIn, hasSession } = useAuthContext()

  return (
    <Stack>
      <Stack.Protected guard={hasSession}>
        <Stack.Screen name="(app)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!hasSession}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}

export default function RootLayout() {
  const colorScheme = useColorScheme()

  return (
    <AuthProvider>
        <SplashScreenController />
        <RootNavigator />
        <StatusBar style="auto" />
    </AuthProvider>
    
  )
}