import { Briefcase, User } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";

const OPTIONS = [
  {
    value: "employee",
    title: "Job seeker",
    description: "Browse and apply for jobs",
    Icon: User,
  },
  {
    value: "employer",
    title: "Employer",
    description: "Post jobs and review applicants",
    Icon: Briefcase,
  },
];

export default function RoleSelector({ label, value, onChange, error }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.row}>
        {OPTIONS.map(({ value: optionValue, title, description, Icon }) => {
          const selected = value === optionValue;

          return (
            <Pressable
              key={optionValue}
              accessibilityRole="radio"
              accessibilityState={{ selected }}
              onPress={() => onChange(optionValue)}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Icon
                size={20}
                color={selected ? theme.fontColor.dark : theme.colors.primary}
              />
              <Text style={[styles.title, selected && styles.textSelected]}>
                {title}
              </Text>
              <Text
                style={[styles.description, selected && styles.textSelected]}
              >
                {description}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    color: "#1d1f22",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  option: {
    flex: 1,
    gap: 4,
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: 14,
    padding: 14,
  },
  optionSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  title: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.bold,
    marginTop: 4,
  },
  description: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
  textSelected: {
    color: theme.fontColor.dark,
  },
  error: {
    color: "#d94c4c",
    fontSize: 12,
    marginTop: 6,
  },
});