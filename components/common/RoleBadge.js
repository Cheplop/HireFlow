import { StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";

export const ROLE_LABELS = {
  employee: "Job seeker",
  employer: "Employer",
};

export default function RoleBadge({ role, style }) {
  if (!ROLE_LABELS[role]) return null;

  return (
    <View style={[styles.badge, style]}>
      <Text style={styles.text}>{ROLE_LABELS[role]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: "flex-start",
    backgroundColor: theme.colors.mutedBackground,
    borderRadius: theme.radius.large,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  text: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.xsmall,
    fontWeight: theme.fontWeight.bold,
  },
});