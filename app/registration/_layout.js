import { Stack } from 'expo-router';

export default function RootLayout() {
 return (
    <Stack>
      <Stack.Screen name="index" options={{headerShown:false}} />
      <Stack.Screen name="basicInformation" options={{headerShown:false}}/>
      <Stack.Screen name="birthDate" options={{headerShown:false}} />
      <Stack.Screen name="educationalBackground" options={{headerShown:false}}/>
      <Stack.Screen name="workExperience" options={{headerShown:false}}/>
    </Stack>
  );
}
