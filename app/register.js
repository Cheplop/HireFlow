import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { useState } from "react";

import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";

export default function RegisterScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    Alert.alert(
      "Register",
      `Name: ${fullName || "not provided"}\nEmail: ${email || "not provided"}\nPassword: ${password || "not provided"}`,
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
              Sign up to manage your applications with a cleaner workflow.
          </Text>
        </View>

        <AuthInput
          label="Username"
          placeholder="Enter your username"
          value={fullName}
          onChangeText={setFullName}
        />
        <AuthInput
          label="Password"
          placeholder="Create a password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <PrimaryButton title="Next" onPress={() => router.replace("/registration/basicInformation")} />


      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#FBFBFB",
    justifyContent: "center",
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


});
