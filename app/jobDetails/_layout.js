import { Stack } from 'expo-router';
import RequireAuth from '../../components/RequireAuth';

export default function RootLayout() {
  return (
    <RequireAuth>
      <Stack>
        <Stack.Screen name="[id]" options={{ headerShown: false, animation: 'simple_push'}} />
      </Stack>
    </RequireAuth>
  );
}