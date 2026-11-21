import { Stack } from "expo-router";

export default function RegistrationLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="basicInformation" options={{ gestureEnabled: false }} />
      <Stack.Screen name="birthDate" />
      <Stack.Screen name="educationalBackground" />
      <Stack.Screen name="workExperience" />
      <Stack.Screen name="setupProfile" />
    </Stack>
  );
}