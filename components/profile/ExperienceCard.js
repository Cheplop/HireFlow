import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from '../../styles/theme';


function DetailRow({ icon, text }) {
  if (!text) return null;

  return (
    <View style={styles.detailRow}>
      <Ionicons name={icon} size={14} color={theme.fontColor.primary} />
      <Text style={styles.detailText}>{text}</Text>
    </View>
  );
}

export default function ExperienceCard({ item, isEditing, onEdit, onDelete }) {
  const { title, date, subtitle, description, details = [] } = item;
  const [location, type] = details;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.thumbnail} />

        <View style={styles.headerContent}>
          <View style={styles.titleRow}>
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
            <Text style={styles.date}>{date}</Text>
          </View>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>

      <DetailRow icon="location-outline" text={location} />
      <DetailRow icon="briefcase-outline" text={type} />

      {!!description && <Text style={styles.description}>{description}</Text>}

      {isEditing && (
        <View style={styles.actions}>
          <Pressable style={styles.actionButton} onPress={onEdit}>
            <Ionicons name="create-outline" size={13} color={theme.actions.editPrimary} />
            <Text style={styles.actionButtonText}>Edit</Text>
          </Pressable>

          <Pressable
            style={[styles.actionButton, styles.deleteButton]}
            onPress={onDelete}
          >
            <Ionicons name="trash-outline" size={13} color={theme.actions.deletePrimary} />
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
              Delete
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 14,
    backgroundColor: theme.colors.cardBackground,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    gap: 10,
  },
  thumbnail: {
    width: 34,
    height: 34,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  headerContent: {
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
    marginTop: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 8,
  },
  detailText: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.small,
  },
  description: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.regular,
    lineHeight: 23,
    marginTop: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 18,
    backgroundColor: theme.actions.editBg,
  },
  actionButtonText: {
    color: theme.actions.editPrimary,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
  },
  deleteButton: {
    backgroundColor: theme.actions.deleteBg,
  },
  deleteButtonText: {
    color: theme.actions.deletePrimary,
  },
});