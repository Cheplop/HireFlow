import { router } from "expo-router";
import { Bell, ChevronLeft, Clock } from "lucide-react-native";
import { useEffect } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import theme from "../styles/theme";

function formatTimestamp(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const diffMinutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

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
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.headerContainer}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.circleButton}
        >
          <ChevronLeft size={22} color={theme.fontColor.primary} />
        </Pressable>
        <Text style={styles.heading}>Notifications</Text>
      </View>

      <FlatList
        data={userNotifications}
        keyExtractor={(item) => item.id}
        style={styles.list}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.wrapper}>
              <View style={styles.imageContainer}>
                <Bell size={26} color={theme.colors.primary} />
              </View>

              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{item.title}</Text>

                <View style={styles.metaRow}>
                  <Clock size={14} color={theme.fontColor.secondary} />
                  <Text style={styles.metaText}>
                    {formatTimestamp(item.createdAt)}
                  </Text>
                </View>

                <Text style={styles.cardDescription}>{item.message}</Text>
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View style={styles.emptyIconBox}>
              <Bell size={28} color={theme.colors.primary} />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyText}>
              Updates about applications and job offers will appear here.
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.small,
    paddingHorizontal: 22,
    paddingVertical: theme.spacing.small,
  },
  circleButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.large,
  },
  heading: {
    fontSize: theme.fontSize.large,
    fontWeight: "700",
    color: theme.fontColor.primary,
    marginLeft: 4,
  },
  list: {
    flex: 1,
  },
  cards: {
    gap: 12,
    paddingBottom: 130,
    paddingHorizontal: 22,
    paddingTop: 2,
    flexGrow: 1,
  },
  card: {
    flexDirection: "column",
    alignSelf: "stretch",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
    boxShadow: theme.boxShadow.default,
  },
  wrapper: {
    flexDirection: "row",
    gap: theme.spacing.medium,
    padding: 10,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
  },
  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 64,
    height: 64,
    borderRadius: 12,
    boxShadow: theme.boxShadow.default,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    alignSelf: "flex-start",
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
    color: theme.fontColor.primary,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  metaText: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: theme.fontColor.secondary,
    fontWeight: theme.fontWeight.muted,
  },
  emptyState: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.large,
    paddingTop: 80,
    gap: theme.spacing.small,
  },
  emptyIconBox: {
    backgroundColor: theme.colors.cardBackground,
    width: 64,
    height: 64,
    borderRadius: 12,
    boxShadow: theme.boxShadow.default,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: "700",
    color: theme.fontColor.primary,
    textAlign: "center",
  },
  emptyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 19,
    textAlign: "center",
  },
});