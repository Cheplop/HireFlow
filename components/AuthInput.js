import { Text, TextInput, View, StyleSheet } from "react-native";

export function AuthInput({ label, error, style, ...props }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        {...props}
        style={[styles.input, error ? styles.inputError : null, style]}
        placeholderTextColor="#abb0b7"
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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
  input: {
    backgroundColor: "#FFFFF",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#112033",
  },
  inputError: {
    borderColor: "#e86c6c",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#d94c4c",
    fontSize: 12,
    marginTop: 6,
  },
});
