
import { Stack } from 'expo-router';
import EmployerOnly from '../../../components/EmployerOnly';

export default function TabLayout() {
  return (
    <EmployerOnly>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            title: 'index',
          }}
        />

        <Stack.Screen
          name="[id]"
          options={{
            title: 'job',
          }}
        />
      </Stack>
    </EmployerOnly>
  );
}
