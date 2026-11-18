import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import theme from "../../styles/theme";
import { useAuth } from "../../contexts/AuthContext";
import { saveProfileData } from "../../data/profileStorage";

import { ChevronLeft } from "lucide-react-native";

export default function BasicInformationScreen() {
  const { user } = useAuth();
  const [birthDate, setBirthDate] = useState("");

  const handleNext = async () => {
    await saveProfileData(user?.id, { birthDate: birthDate.trim() });
    router.push("/registration/educationalBackground");
  };

  return (
    <ScrollView style>
      <View style={styles.card}>
        <ChevronLeft size={30} color="black" style={{ marginBottom: 20 }} onPress={() => router.replace("/registration/basicInformation")} />
        <View style={styles.header}>
          <Text style={styles.brand}>Birthdate</Text>
          <View style={styles.description}>
            <Text style={styles.subtitle}>
              Tell us when you were born.
            </Text>
          </View>
        </View>

        <AuthInput
          label="Birthdate"
          placeholder="MM/DD/YYYY"
          keyboardType="numeric"
          value={birthDate}
          onChangeText={setBirthDate}
        />

        <PrimaryButton title="NEXT" onPress={handleNext} />
      </View>
    </ScrollView>
  );
}

// ...your existing `const styles = StyleSheet.create({ ... });` stays here

  const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "stretch",
  },
  header: {
    marginBottom: 18,
  },
  brand: {
    color: "black",
    fontSize: 30,
    fontWeight: "500",
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  title: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.xl,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.medium,
    lineHeight: theme.spacing.large,
  },
  card: {
    backgroundColor: theme.colors.background,
    padding: 40,
  },
  description:{
    width: 250
  }
});
