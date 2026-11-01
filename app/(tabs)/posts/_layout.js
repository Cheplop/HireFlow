
import { Stack } from 'expo-router';
import { PostsProvider } from '../../../contexts/PostsContext';

export default function TabLayout() {
  return (
    <PostsProvider>
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
            title: 'post',
          }}
        />
        
      </Stack>
    </PostsProvider>
  );
}
