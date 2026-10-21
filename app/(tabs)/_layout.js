import { Tabs, router } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4B5694',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home', 
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />),
        }}
      />
      
      <Tabs.Screen
        name="applications"
        options={{
          title: 'Applications', 
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'newspaper-sharp' : 'newspaper-outline'} color={color} size={24} />),
        }}
      />

    <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile', 
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (<Ionicons name={focused ? 'person-sharp' : 'person-outline'} color={color} size={24} />),
        }}
      />

    </Tabs>
  );
}
