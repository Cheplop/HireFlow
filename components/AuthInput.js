
import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";

export function AuthInput({label, error, style, children, icon,rightIcon,
  ...props
}) {
  return (
    <View style={[styles.container, style]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={styles.inputWrapper}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}

        <TextInput
          {...props}
          style={[
            styles.input,
            icon && styles.inputWithIcon,
            rightIcon && styles.inputWithRightIcon,
            error && styles.inputError
          ]}
          placeholderTextColor="#abb0b7"
        />

        {rightIcon && (
          <View style={styles.rightIconContainer}>
            {rightIcon}
          </View>
        )}

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
    justifyContent: "center",
  },
  iconContainer: {
    position: "absolute",
    left: 14,
    zIndex: 2,
  },
  rightIconContainer: {
    position: "absolute",
    right: 14,
    zIndex: 2,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 15,
    color: "#112033",
  },
  inputWithIcon: {
    paddingLeft: 50,
  },
  inputWithRightIcon: {
    paddingRight: 50,
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
