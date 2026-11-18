import { Pressable, StyleSheet, Text } from "react-native";
import theme from "../../styles/theme";

export default function StatTile({ label, value, onPress, style }) {
  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityLabel={`${label}: ${value}`}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.tile, pressed && styles.pressed, style]}
    >
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.medium,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  pressed: {
    opacity: 0.85,
  },
  value: {
    color: theme.fontColor.primary,
    fontSize: 22,
    fontWeight: theme.fontWeight.bold,
  },
  label: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    marginTop: 2,
  },
});