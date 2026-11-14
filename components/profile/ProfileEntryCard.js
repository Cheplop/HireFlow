import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import theme from "../../styles/theme";

export default function EntryCard({
  item,
  isEditing,
  onEdit,
  onDelete,
}) {
  return (
    <View style={styles.card}>
      <View style={styles.thumb} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>

          <Text style={styles.date}>
            {item.date}
          </Text>
        </View>

        <Text style={styles.subtitle}>
          {item.subtitle}
        </Text>

        {isEditing && (
          <View style={styles.actions}>
            <Pressable
              style={styles.btn}
              onPress={onEdit}
            >
              <Ionicons
                name="create-outline"
                size={13}
                color={theme.actions.editPrimary}
              />

              <Text style={styles.btnText}>
                Edit
              </Text>
            </Pressable>

            <Pressable
              style={[styles.btn, styles.del]}
              onPress={onDelete}
            >
              <Ionicons
                name="trash-outline"
                size={13}
                color={theme.actions.deletePrimary}
              />

              <Text style={[styles.btnText, styles.deleteText]}>
                Delete
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 10,
    padding: 11,
    borderRadius: 14,
    backgroundColor: theme.colors.cardBackground,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  thumb: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: theme.colors.coverBackground,
  },

  body: {
    flex: 1,
    minWidth: 0,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 6,
  },

  title: {
    flex: 1,
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.bold,
  },

  date: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },

  subtitle: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    marginTop: 3,
  },

  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: theme.radius.large,
    backgroundColor: theme.actions.editBg,
  },

  del: {
    backgroundColor: theme.actions.deleteBg,
  },

  btnText: {
    color: theme.actions.editPrimary,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
  },

  deleteText: {
    color: theme.actions.deletePrimary,
  },
});