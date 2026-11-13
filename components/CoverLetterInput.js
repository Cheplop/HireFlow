
import { StyleSheet, Text, TextInput, View } from "react-native";
import theme from "../styles/theme";

export default function CoverLetterInput({
  value,
  onChangeText,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cover Letter</Text>

      <Text style={styles.description}>
        Introduce yourself and explain why you are suitable
        for this position.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Write your cover letter here..."
        placeholderTextColor="#999"
        multiline
        textAlignVertical="top"
        value={value}
        onChangeText={onChangeText}
        maxLength={1000}
      />

      <View style={styles.footer}>
        <Text style={styles.helperText}>
          Minimum 50 characters
        </Text>

        <Text style={styles.characterCount}>
          {value.length}/1000
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: theme.spacing.small,
  },

  heading: {
    fontSize: theme.fontSize.large,
    fontWeight: "700",
    color: theme.fontColor.primary,
  },

  description: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
  },

  input: {
    width: "100%",
    minHeight: 180,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 14,
    fontSize: theme.fontSize.medium,
    color: theme.fontColor.primary,
    backgroundColor: "#FFFFFF",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  helperText: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },

  characterCount: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },
});
