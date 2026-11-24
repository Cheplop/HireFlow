import { Bell } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../../contexts/AuthContext";
import { useNotifications } from "../../contexts/NotificationsContext";
import theme from "../../styles/theme";

export default function NotificationBell({ onPress, label = "View notifications", style }) {
  const { user } = useAuth();
  const { getUnreadCount } = useNotifications();
  const unreadCount = user?.id ? getUnreadCount(user.id) : 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={unreadCount ? `${label}, ${unreadCount} unread` : label}
      onPress={onPress}
      style={[styles.button, style]}
    >
      <Bell size={19} color={theme.fontColor.primary} />
      {unreadCount > 0 ? (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unreadCount > 99 ? "99+" : unreadCount}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    backgroundColor: theme.colors.cardBackground,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 9,
    backgroundColor: theme.actions.deletePrimary,
    borderWidth: 1,
    borderColor: theme.colors.cardBackground,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    lineHeight: 12,
    fontWeight: "700",
  },
});
