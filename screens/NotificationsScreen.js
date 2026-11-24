import { router } from "expo-router";
import {
  Bell,
  BriefcaseBusiness,
  Check,
  CheckCheck,
  ChevronLeft,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Trash2,
  UserRound,
} from "lucide-react-native";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuth } from "../contexts/AuthContext";
import { useApplications } from "../contexts/ApplicationsContext";
import { useJobs } from "../contexts/JobsContext";
import { useNotifications } from "../contexts/NotificationsContext";
import theme from "../styles/theme";

function formatTimestamp(isoString) {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "Date unavailable";
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getNotificationIcon(type) {
  if (["success", "accepted"].includes(type)) return CircleCheck;
  if (["error", "declined"].includes(type)) return CircleX;
  if (["new_application", "application_updated", "application_withdrawn"].includes(type)) return UserRound;
  if (["job_published", "job_updated", "job_unavailable", "job_inactive"].includes(type)) return BriefcaseBusiness;
  if (type === "profile_updated") return CheckCheck;
  if (type === "warning") return CircleAlert;
  return Bell;
}

function getNotificationRoute(item, user, getApplicationById, getJobById) {
  if (item.type === "profile_updated") return "/(tabs)/profile";
  if (user?.role === "employer" && ["job_published", "job_updated", "job_inactive"].includes(item.type)) {
    return "/(tabs)/posts";
  }
  if (user?.role === "employee" && item.type === "job_unavailable") {
    return "/(tabs)/applications";
  }

  const applicationId = item.applicationId ?? item.relatedId;
  const application = applicationId ? getApplicationById(applicationId) : null;
  const job = item.jobId ? getJobById(item.jobId) : application && getJobById(application.jobId);

  if (user?.role === "employer") {
    if (
      application && job && job.employerId === user.id &&
      application.jobId === job.id
    ) {
      return `/applicants/${application.id}?jobId=${job.id}`;
    }
    return "/(tabs)/applicants";
  }

  if (application && application.employeeId === user?.id && job) {
    return `/jobDetails/${job.id}`;
  }
  return "/(tabs)/applications";
}

export default function NotificationsScreen() {
  const { user } = useAuth();
  const { getApplicationById } = useApplications();
  const { getJobById } = useJobs();
  const {
    getNotificationsForUser,
    getUnreadCount,
    hasLoadedNotifications,
    loadError,
    saveError,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearNotifications,
  } = useNotifications();
  const userNotifications = user ? getNotificationsForUser(user.id) : [];
  const unreadCount = user?.id ? getUnreadCount(user.id) : 0;

  function openNotification(item) {
    if (!user) return;
    markAsRead(item.id, user.id);
    router.push(getNotificationRoute(item, user, getApplicationById, getJobById));
  }

  function confirmClearAll() {
    if (!user?.id || userNotifications.length === 0) return;
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm("Clear all notifications?")) {
        clearNotifications(user.id);
      }
      return;
    }
    Alert.alert("Clear all notifications?", "This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear all", style: "destructive", onPress: () => clearNotifications(user.id) },
    ]);
  }

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
        <View style={styles.headingBlock}>
          <Text style={styles.heading}>Notifications</Text>
          <Text style={styles.headingSubtitle}>
            {unreadCount ? `${unreadCount} unread` : "You're all caught up"}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {unreadCount > 0 ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => markAllAsRead(user.id)}
              style={styles.headerAction}
            >
              <CheckCheck size={18} color={theme.colors.primary} />
              <Text style={styles.headerActionText}>Read all</Text>
            </Pressable>
          ) : null}
          {userNotifications.length > 0 ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Clear all notifications"
              onPress={confirmClearAll}
              style={styles.headerAction}
            >
              <Trash2 size={17} color={theme.actions.deletePrimary} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {loadError || saveError ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {[loadError, saveError].filter(Boolean).join(" ")}
        </Text>
      ) : null}

      {!hasLoadedNotifications && userNotifications.length === 0 ? (
        <View style={styles.loadingState}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.emptyText}>Loading notifications…</Text>
        </View>
      ) : (
        <FlatList
          data={userNotifications}
          keyExtractor={(item) => item.id}
          style={styles.list}
          contentContainerStyle={styles.cards}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const Icon = getNotificationIcon(item.type);
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${item.isRead ? "Read" : "Unread"}: ${item.title}. ${item.message}`}
                onPress={() => openNotification(item)}
                style={[styles.card, !item.isRead && styles.unreadCard]}
              >
                <View style={styles.wrapper}>
                  <View style={[styles.imageContainer, !item.isRead && styles.unreadIconContainer]}>
                    <Icon size={23} color={item.type === "error" || item.type === "declined"
                      ? theme.actions.deletePrimary
                      : item.type === "success" || item.type === "accepted"
                        ? "#3A8B63"
                        : theme.colors.primary} />
                  </View>
                  <View style={styles.cardContent}>
                    <View style={styles.titleRow}>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      {!item.isRead ? <View style={styles.unreadDot} /> : null}
                    </View>
                    <View style={styles.metaRow}>
                      <Clock size={13} color={theme.fontColor.secondary} />
                      <Text style={styles.metaText}>{formatTimestamp(item.createdAt)}</Text>
                    </View>
                    <Text style={styles.cardDescription}>{item.message}</Text>
                    <View style={styles.itemActions}>
                      {!item.isRead ? (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel="Mark notification as read"
                          hitSlop={8}
                          onPress={(event) => {
                            event.stopPropagation();
                            markAsRead(item.id, user.id);
                          }}
                          style={styles.itemAction}
                        >
                          <Check size={14} color={theme.colors.primary} />
                          <Text style={styles.itemActionText}>Mark as read</Text>
                        </Pressable>
                      ) : null}
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Delete notification"
                        hitSlop={8}
                        onPress={(event) => {
                          event.stopPropagation();
                          deleteNotification(item.id, user.id);
                        }}
                        style={styles.itemAction}
                      >
                        <Trash2 size={14} color={theme.fontColor.secondary} />
                        <Text style={styles.itemActionText}>Delete</Text>
                      </Pressable>
                    </View>
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
                Application and job updates will appear here.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: { flex: 1, backgroundColor: theme.colors.background },
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
    width: 44,
    height: 44,
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.large,
  },
  headingBlock: { flex: 1 },
  heading: { fontSize: theme.fontSize.large, fontWeight: "700", color: theme.fontColor.primary },
  headingSubtitle: { marginTop: 2, fontSize: theme.fontSize.xsmall, color: theme.fontColor.secondary },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 12 },
  headerAction: { flexDirection: "row", alignItems: "center", gap: 4, padding: 5 },
  headerActionText: { color: theme.colors.primary, fontSize: theme.fontSize.xsmall, fontWeight: "600" },
  errorText: { color: theme.actions.deletePrimary, fontSize: theme.fontSize.small, paddingHorizontal: 22, paddingBottom: 8 },
  loadingState: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  list: { flex: 1 },
  cards: { gap: 12, paddingBottom: 130, paddingHorizontal: 22, paddingTop: 2, flexGrow: 1 },
  card: {
    alignSelf: "stretch",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
    boxShadow: theme.boxShadow.default,
    borderWidth: 1,
    borderColor: "transparent",
  },
  unreadCard: { borderColor: "#DCE3EF", backgroundColor: "#F7F9FC" },
  wrapper: { flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.medium, padding: 12 },
  imageContainer: {
    backgroundColor: theme.colors.mutedBackground,
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  unreadIconContainer: { backgroundColor: "#E8EDF5" },
  cardContent: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  cardTitle: { flex: 1, fontSize: theme.fontSize.medium, fontWeight: "700", color: theme.fontColor.primary },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 5, marginBottom: 6 },
  metaText: { fontSize: theme.fontSize.xsmall, color: theme.fontColor.secondary },
  cardDescription: { fontSize: theme.fontSize.small, lineHeight: 18, color: theme.fontColor.secondary },
  itemActions: { flexDirection: "row", alignItems: "center", gap: 16, marginTop: 10 },
  itemAction: { flexDirection: "row", alignItems: "center", gap: 5, paddingVertical: 3 },
  itemActionText: { fontSize: theme.fontSize.xsmall, color: theme.fontColor.secondary },
  emptyState: { flex: 1, alignItems: "center", paddingHorizontal: theme.spacing.large, paddingTop: 80, gap: theme.spacing.small },
  emptyIconBox: {
    backgroundColor: theme.colors.cardBackground,
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: theme.fontSize.large, fontWeight: "700", color: theme.fontColor.primary, textAlign: "center" },
  emptyText: { color: theme.fontColor.secondary, fontSize: theme.fontSize.small, lineHeight: 19, textAlign: "center" },
});
