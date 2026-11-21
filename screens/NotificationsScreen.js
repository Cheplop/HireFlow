import { router } from "expo-router";
import { Bell, ChevronLeft } from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import theme from "../styles/theme";

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { getNotificationsForUser, markAllAsRead } = useNotifications();
  const userNotifications = user ? getNotificationsForUser(user.id) : [];

  useEffect(() => {
    if (user?.id) {
      markAllAsRead(user.id);
    }
  }, [user?.id, markAllAsRead]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <ChevronLeft size={28} color="black" onPress={() => router.back()} />
        <Text style={styles.heading}>Notifications</Text>
      </View>

      <FlatList
        data={userNotifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.time}>{item.createdAt}</Text>
            </View>
            <Text style={styles.message}>{item.message}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Bell size={36} color={theme.fontColor.secondary} />
            <Text style={styles.emptyText}>No notifications yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: theme.spacing.medium,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.fontColor.primary,
  },
  list: {
    gap: theme.spacing.small,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: theme.colors.cardBackground,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 6,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: theme.fontSize.medium,
    fontWeight: "700",
    color: theme.fontColor.primary,
  },
  time: {
    fontSize: 11,
    color: theme.fontColor.secondary,
  },
  message: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
    lineHeight: 19,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
    gap: 10,
  },
  emptyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
});
