import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import RoleSelector from "@/components/common/RoleSelector";
import { useAuth } from "../../contexts/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setField = (key) => (value) => {
    setForm((current) => ({ ...current, [key]: value }));
    // Clear the error on a field as soon as the person edits it.
    setErrors((current) => ({ ...current, [key]: undefined, form: undefined }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    const result = await register(form);
    setIsSubmitting(false);

    if (!result.ok) {
      setErrors(result.errors);
      return;
    }

    // Job seekers continue with the profile steps; employers have no personal
    // profile to fill in, so they go straight to the app.
    router.replace(
      result.user.role === "employee"
        ? "/registration/basicInformation"
        : "/(tabs)",
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>
        <View style={styles.header}>
          <ChevronLeft
            size={30}
            color="black"
            style={{ marginBottom: 20 }}
            onPress={() => router.back()}
          />

          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
            Sign up to manage your applications with a cleaner workflow.
          </Text>
        </View>

        <RoleSelector
          label="I am a"
          value={form.role}
          onChange={setField("role")}
          error={errors.role}
        />

        <AuthInput
          label="Username"
          placeholder="Enter your username"
          autoCapitalize="none"
          value={form.username}
          onChangeText={setField("username")}
          error={errors.username}
        />
        <AuthInput
          label="Email"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={setField("email")}
          error={errors.email}
        />
        <AuthInput
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={form.password}
          onChangeText={setField("password")}
          error={errors.password}
        />
        <AuthInput
          label="Confirm password"
          placeholder="Re-enter your password"
          secureTextEntry
          value={form.confirmPassword}
          onChangeText={setField("confirmPassword")}
          error={errors.confirmPassword}
        />

        {errors.form ? <Text style={styles.formError}>{errors.form}</Text> : null}

        <PrimaryButton
          title={
            isSubmitting
              ? "Creating account..."
              : form.role === "employee"
                ? "Next"
                : "Create account"
          }
          onPress={handleSubmit}
          disabled={isSubmitting}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FBFBFB",
    justifyContent: "flex-start",
    alignItems: "stretch",
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  header: {
    marginBottom: 18,
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: "#5f6c7b",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 22,
  },
  formError: {
    color: "#B3261E",
    fontSize: 12,
    textAlign: "center",
    marginBottom: 10,
  },
});