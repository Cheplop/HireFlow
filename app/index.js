import { useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import { router, Link } from "expo-router";
import { User, KeyRound } from "lucide-react-native";

import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState ("");


  const handleLogin = () => {

    if (email !==  'remiel' || password !== '1234'){
        setError("PUK manka dol");
        return;
    }
    if (!email || !password){
        setError("Wakay gi input dol!");
        return;
    }

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
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          icon={<KeyRound size={20} />}
        />

        <PrimaryButton
          title="Log in"
          onPress={handleLogin}
        />

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
    backgroundColor: "#FBFBFB",
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
    color: "#000000",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 0,
  },
  title: {
    color: "#111827",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    width: 200,
    color: "#5f6c7b",
    fontSize: 15,
    lineHeight: 22,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  registerText: {
    color: "#667085",
    fontSize: 14,
  },
  registerLink: {
    color: "#1c5ce6",
    fontSize: 14,
    fontWeight: "700",
  },
});
