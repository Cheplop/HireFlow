import { Bell, Search } from "lucide-react-native";
import { Pressable, StyleSheet, View } from "react-native";

import { AuthInput } from "./AuthInput";
import theme from "../../styles/theme";

export default function SearchRow({
  value,
  onChangeText,
  placeholder,
  notificationLabel,
  onNotificationPress,
  containerStyle,
}) {
  return (
    <View style={[styles.row, containerStyle]}>
      <AuthInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        style={styles.searchInput}
        inputStyle={styles.searchInputField}
        rightIcon={<Search size={18} color={theme.fontColor.primary} />}
      />

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={notificationLabel}
        style={styles.notificationButton}
        onPress={onNotificationPress}
      >
        <Bell size={18} color={theme.fontColor.primary} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: theme.spacing.medium,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchInputField: {
    height: 44,
    paddingVertical: 0,
    paddingRight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    backgroundColor: theme.colors.cardBackground,
    fontSize: theme.fontSize.xsmall,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  notificationButton: {
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
});
