import { useAuthContext } from '@/contexts/AuthContext'
import { SplashScreen } from 'expo-router'
import { Text } from 'react-native'


SplashScreen.preventAutoHideAsync()

export function SplashScreenController() {
  const { isLoading, isLoggedIn } = useAuthContext()

  if (!isLoading) {
    SplashScreen.hideAsync()
  }

  return (
    <Text>Loading...</Text>
  )
}