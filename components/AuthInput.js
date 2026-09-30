import React from "react"; // Changed from import { Children } to standard React import
import { Text, TextInput, View, StyleSheet } from "react-native";


export function AuthInput({ label, error, style, children, icon, ...props }) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={{ position: 'relative', justifyContent: 'center' }}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          {...props}
          style={[
            styles.input, 
            icon && styles.inputWithIcon,
            error && styles.inputError
          ]}
          placeholderTextColor="#abb0b7"
        />
        {children}
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}
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
  inputWrapper: {
    position: "relative",
    justifyContent: "center", // Vertically centers the absolute icon
  },
  iconContainer: {
    position: "absolute",
    left: 14, // Aligns perfectly with your paddingHorizontal
    zIndex: 2, // Keeps it layer-wise above the input field
  },

  input: {
    backgroundColor: "#FFFFFF", // Fixed: Added missing "F" to make it valid hex
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#112033",
  },
  // 4. Pushes text to the right so it never overlaps your icon
  inputWithIcon: {
    paddingLeft: 50, // 14px (left boundary) + ~20px (icon width) + 10px (spacing)
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
