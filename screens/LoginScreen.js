import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { router, Link } from "expo-router";
import { User, KeyRound, Eye, EyeOff } from "lucide-react-native";
import theme from "../styles/theme";

import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen() {
  const { setUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState ("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = () => {
    const accounts = {
      remiel: { id: "remiel", username: "remiel", role: "employee" },
      bill: { id: "bill", username: "Bill", role: "employer" },
    };
    const account = accounts[email.toLowerCase()];

    if (!email || !password) {
      setError("Wakay gi input dol!");
      return;
    }

    if (!account || password !== "1234") {
      setError("PUK manka dol");
      return;
    }

    setError("");
    setUser(account);
    router.push("/(tabs)");
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
          label="Email"
          placeholder="name@example.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail} // Fixed the stray 'z' here
          icon={<User size={20} />} // Pass your icon component here
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
          title="Log in"
          onPress={handleLogin}
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
