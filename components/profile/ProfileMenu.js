import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import theme from "../../styles/theme";

export default function ProfileMenu({
  visible,
  onClose,
  onNotifications,
  onLogout,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.menu}>
          <Pressable
            style={styles.item}
            onPress={() => {
              onClose();
              onNotifications();
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={18}
              color={theme.fontColor.primary}
            />

            <Text style={styles.text}>
              Notifications
            </Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.item}
            onPress={() => {
              onClose();
              onLogout();
            }}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color={theme.actions.deletePrimary}
            />

            <Text style={[styles.text, styles.logoutText]}>
              Log out
            </Text>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
  },

  menu: {
    position: "absolute",
    top: 90,
    right: 26,
    minWidth: 170,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.cardBackground,
    paddingVertical: 4,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
  },

  text: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semibold,
  },

  logoutText: {
    color: theme.actions.deletePrimary,
  },

  divider: {
    height: 1,
    backgroundColor: theme.colors.mutedBackground,
  },
});