import { Stack } from 'expo-router';

export default function AppLayout() {
  // This renders the navigation stack for all authenticated app routes.
  return ( 
  <Stack.Screen
    name="index"
    options={{ 
        title: 'Home',
        headerStyle: { backgroundColor: '#f4511e' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: 'bold' },
    }}
  /> 
  )
}
