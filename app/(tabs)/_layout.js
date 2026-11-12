import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function TabLayout() {
  const { user } = useAuth();
  const isEmployer = user?.role === "employer";

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#4B5694",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home-sharp" : "home-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="applications"
        options={{
          title: "Applications",
          headerShown: false,
          href: isEmployer ? null : "/applications",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "newspaper-sharp" : "newspaper-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person-sharp" : "person-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="posts"
        options={{
          title: "My Jobs",
          headerShown: false,
          href: isEmployer ? "/posts" : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-sharp" : "add-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="applicants"
        options={{
          title: "Applicants",
          headerShown: false,
          href: isEmployer ? "/applicants" : null,
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "people-sharp" : "people-outline"}
              color={color}
              size={24}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    alignSelf: "center",

    marginHorizontal: 20,

    bottom: 20,
    height: 60,
    borderRadius: 20,
    borderTopWidth: 0,

    backgroundColor: "white",

    elevation: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
});
