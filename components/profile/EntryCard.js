import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme from "../../styles/theme";

export default function EntryCard({ item, isEditing, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      {/* University Logo or fallback grey placeholder box */}
      {item.logo ? (
        <Image source={item.logo} style={styles.logo} />
      ) : (
        <View style={[styles.logo, styles.placeholderLogo]} />
      )}

      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
          <Text style={styles.period}>{item.period}</Text>
        </View>
        <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
      </View>

      {isEditing && (
        <View style={styles.editActions}>
          <Pressable onPress={onEdit} style={styles.iconButton}>
            <Ionicons name="pencil" size={14} color={theme.colors.primary} />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={14} color={theme.actions.deletePrimary} />
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.small,
    padding: theme.spacing.small,
    marginBottom: theme.spacing.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: theme.radius.small,
    marginRight: theme.spacing.small,
    resizeMode: "contain",
  },
  placeholderLogo: {
    backgroundColor: theme.colors.mutedBackground, // Uses your theme's muted color
  },
  contentContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.primary,
    flex: 1,
  },
  subtitle: {
    fontSize: theme.fontSize.xsmall,
    color: theme.fontColor.secondary,
    marginTop: 2,
  },
  period: {
    fontSize: theme.fontSize.xsmall,
    color: theme.fontColor.secondary,
    marginLeft: theme.spacing.small,
  },
  editActions: {
    flexDirection: "row",
    marginLeft: theme.spacing.small,
  },
  iconButton: {
    padding: 4,
    marginLeft: 4,
  },
});