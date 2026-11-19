import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { Link } from "expo-router";
import { User, KeyRound, Eye, EyeOff } from "lucide-react-native";
import theme from "../styles/theme";

import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  // AuthContext now provides login(), not setUser()
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError("Wakay gi input dol!");
      return;
    }

    setIsSubmitting(true);
    const result = await login(email, password);
    setIsSubmitting(false);

    if (!result.ok) {
      setError("PUK manka dol");
      return;
    }

    // Success: PublicOnly (components/PublicOnly.js) redirects to the tabs once the user is set.
    setError("");
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.logoHeader}>
          <View>
            <Image
              source={require("../assets/images/Hireflow.png")}
              style={styles.logo}
            />
          </View>
          <View style={styles.header}>
            <Text style={styles.brand}>HireFlow</Text>
            <Text style={styles.subtitle}>
              Sign in to get started with flowing jobs!
            </Text>
          </View>
        </View>

        <AuthInput
          label="Username or email"
          placeholder="Username or name@example.com"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          icon={<User size={20} />}
        />

        <AuthInput
          label="Password"
          placeholder="Enter your password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          icon={<KeyRound size={20} />}
          rightIcon={
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <EyeOff size={20} color="gray" />
              ) : (
                <Eye size={20} color="gray" />
              )}
            </Pressable>
          }
        />

        <PrimaryButton
          title={isSubmitting ? "Logging in..." : "Log in"}
          onPress={handleLogin}
          disabled={isSubmitting}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Don’t have an account? </Text>
          <Link href="/registration">
            <Text style={styles.registerLink}>register here</Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}



const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    paddingHorizontal: 22,
    paddingVertical: 22,
  },
  card: {
    padding: 22,
  },
  logoHeader: {
    flexDirection: "row",
    gap: 20,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  logo: {
    width: 75,
    height: 75,
    resizeMode: "contain",
  },
  header: {
    marginBottom: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  brand: {
    color: theme.colors.text,
    fontSize: theme.fontSize.large,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 0,
  },
  title: {
    color: theme.colors.text,
    fontSize: theme.fontSize.xl,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    width: 200,
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.medium,
    lineHeight: theme.spacing.large,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  registerText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
  registerLink: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.small,
    fontWeight: "700",
  },
  error: {
    color: "#B3261E",
    fontSize: theme.fontSize.small,
    textAlign: "center",
    marginTop: 10,
  },
});