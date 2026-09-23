import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";

import { ChevronLeft } from "lucide-react-native";


export default function RegisterScreen() {


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <ChevronLeft size={30} color="black" style={{ marginBottom: 20 }} onPress={() => router.replace("/")} />
          <Text style={styles.title}>Create account</Text>
          <Text style={styles.subtitle}>
              Sign up to manage your applications with a cleaner workflow.
          </Text>
        </View>

        <AuthInput
          label="Username"
          placeholder="Enter your username"
        />
        <AuthInput
          label="Password"
          placeholder="Create a password"
          secureTextEntry
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
