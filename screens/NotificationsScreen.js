import { router } from "expo-router";
import { Bell, ChevronLeft, Clock } from "lucide-react-native";
import { useEffect } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import theme from "../styles/theme";

function formatTimestamp(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { getNotificationsForUser, markAllAsRead } = useNotifications();
  const items = user ? getNotificationsForUser(user.id) : [];

  useEffect(() => {
    if (user?.id) markAllAsRead(user.id);
  }, [markAllAsRead, user?.id]);

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <Pressable accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.circleButton}>
          <ChevronLeft size={22} color={theme.fontColor.primary} />
        </Pressable>
        <Text style={styles.heading}>Notifications</Text>
      </View>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.cards}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.iconBox}><Bell size={24} color={theme.colors.primary} /></View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.metaRow}><Clock size={14} color={theme.fontColor.secondary} /><Text style={styles.meta}>{formatTimestamp(item.createdAt)}</Text></View>
              <Text style={styles.message}>{item.message}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<View style={styles.empty}><Bell size={28} color={theme.colors.primary} /><Text style={styles.emptyTitle}>No notifications yet</Text><Text style={styles.meta}>Updates about applications and job offers will appear here.</Text></View>}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  header: { flexDirection: "row", alignItems: "center", gap: theme.spacing.small, paddingHorizontal: 22, paddingVertical: theme.spacing.small },
  circleButton: { width: 48, height: 48, alignItems: "center", justifyContent: "center", backgroundColor: theme.colors.cardBackground, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.large },
  heading: { color: theme.fontColor.primary, fontSize: theme.fontSize.large, fontWeight: "700" },
  cards: { gap: 12, padding: 22, paddingTop: 2, paddingBottom: 130, flexGrow: 1 },
  card: { flexDirection: "row", gap: 12, padding: 12, borderRadius: theme.radius.large, backgroundColor: theme.colors.cardBackground },
  iconBox: { width: 52, height: 52, alignItems: "center", justifyContent: "center", borderRadius: 12, backgroundColor: theme.colors.background },
  cardContent: { flex: 1 },
  cardTitle: { color: theme.fontColor.primary, fontSize: theme.fontSize.medium, fontWeight: "700", marginBottom: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 5 },
  meta: { color: theme.fontColor.secondary, fontSize: theme.fontSize.small },
  message: { color: theme.fontColor.secondary, fontSize: theme.fontSize.small, lineHeight: 18 },
  empty: { alignItems: "center", gap: theme.spacing.small, paddingTop: 80, paddingHorizontal: theme.spacing.large },
  emptyTitle: { color: theme.fontColor.primary, fontSize: theme.fontSize.large, fontWeight: "700" },
});
