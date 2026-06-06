//import { useAuthContext } from '@/contexts/AuthContext'
import { SplashScreen } from 'expo-router'
import { Text } from 'react-native'
import { useAuthStore } from '../features/auth/AuthStore'


SplashScreen.preventAutoHideAsync()

export function SplashScreenController() {
  const state = useAuthStore((state) => state.state)

  if (state === "booting" || state === "loadingClaims" || state === "signedInNoClaims") {
    SplashScreen.hideAsync()
  }

  return (
    <Text>Loading...</Text>
  )
}