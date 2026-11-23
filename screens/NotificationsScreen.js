import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Bell, ChevronLeft, Clock } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useApplications } from "../contexts/ApplicationsContext";
import { useAuth } from "../contexts/AuthContext";
import { useNotifications } from "../contexts/NotificationsContext";
import { PHOTO_STORAGE_KEY } from "../data/ProfileScreen.data";
import theme from "../styles/theme";

const DEFAULT_AVATAR = require("../assets/images/Hireflow.png");

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
  const { getApplicationById } = useApplications();
  const {
    getNotificationsForUser,
    markAsRead,
    markAllAsRead,
    seedDefaultNotifications,
  } = useNotifications();

  useEffect(() => {
    if (user) {
      seedDefaultNotifications(user);
    }
  }, [user, seedDefaultNotifications]);

  const userNotifications = useMemo(
    () => (user ? getNotificationsForUser(user.id) : []),
    [user, getNotificationsForUser],
  );
  const [senderPhotos, setSenderPhotos] = useState({});

  useEffect(() => {
    let active = true;
    const senderIds = [
      ...new Set(
        userNotifications.map((item) => item.senderId).filter(Boolean),
      ),
    ];

    if (!senderIds.length) {
      return () => {
        active = false;
      };
    }

    AsyncStorage.multiGet(senderIds.map((id) => `${PHOTO_STORAGE_KEY}:${id}`))
      .then((entries) => {
        if (!active) return;
        const photos = {};
        entries.forEach(([key, value]) => {
          if (!value) return;
          try {
            const avatarUri = JSON.parse(value)?.avatarUri;
            const senderId = key.slice(`${PHOTO_STORAGE_KEY}:`.length);
            if (typeof avatarUri === "string" && avatarUri.trim()) {
              photos[senderId] = { uri: avatarUri };
            }
          } catch {
            // Ignore malformed photo entries
          }
        });
        setSenderPhotos(photos);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [userNotifications]);

  const handleBack = () => {
    if (user?.id) {
      markAllAsRead(user.id);
    }
    router.back();
  };

  const handleNotificationPress = (item) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }

    if (user?.role === "employer" || item.type === "application") {
      const targetApplication = item.relatedId
        ? getApplicationById(item.relatedId)
        : null;

      if (targetApplication) {
        router.push(`/applicants/${targetApplication.id}`);
      } else {
        router.push("/applicants");
      }
      return;
    }

    router.push("/(tabs)/applications");
  };

  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.headerContainer}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={handleBack}
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
        renderItem={({ item }) => {
          const avatarSource =
            (item.senderId && senderPhotos[item.senderId]) || DEFAULT_AVATAR;

          return (
            <Pressable
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
              onPress={() => handleNotificationPress(item)}
            >
              <View style={styles.wrapper}>
                <View style={styles.imageContainer}>
                  <Image
                    source={avatarSource}
                    style={styles.avatar}
                    resizeMode="cover"
                  />
                </View>

                <View style={styles.cardContent}>
                  <View style={styles.titleRow}>
                    <Text style={styles.cardTitle} numberOfLines={1}>
                      {item.title}
                    </Text>
                    {!item.isRead && <View style={styles.unreadDot} />}
                  </View>

                  <View style={styles.metaRow}>
                    <Clock size={14} color={theme.fontColor.secondary} />
                    <Text style={styles.metaText}>
                      {formatTimestamp(item.createdAt)}
                    </Text>
                  </View>

                  <Text style={styles.cardDescription}>{item.message}</Text>
                </View>
              </View>
            </Pressable>
          );
        }}
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
  cardPressed: {
    opacity: 0.85,
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
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    alignSelf: "flex-start",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
    marginBottom: 4,
  },
  cardTitle: {
    flex: 1,
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
    color: theme.fontColor.primary,
  },
  unreadDot: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: "#B3261E",
    flexShrink: 0,
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
