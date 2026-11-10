import { Stack } from 'expo-router';
import { ApplicationsProvider } from '../contexts/ApplicationsContext';

export default function RootLayout() {
  return (
    <ApplicationsProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="registration" options={{ headerShown: false, animation: 'simple_push'}} />
        <Stack.Screen name="jobDetails" options={{ headerShown: false, animation: 'simple_push'}} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </ApplicationsProvider>
  );
}
