import { useCallback, useState } from "react";
import {
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useFocusEffect } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import EmployeeOnly from "../../components/EmployeeOnly";
import { useAuth } from "../../contexts/AuthContext";
import { loadSavedProfile, saveProfileData } from "../../data/profileStorage";
import theme from "../../styles/theme";

function BasicInformationScreen() {
  const { user, logout } = useAuth();

  // Back returns to the Create account form. Navigate first: once the user is
  // cleared, EmployeeOnly would redirect this screen to /login.
  const handleBack = useCallback(async () => {
    router.replace("/registration");
    await logout();
  }, [logout]);

  // Make Android's back button behave the same as the arrow.
  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener("hardwareBackPress", () => {
        handleBack();
        return true;
      });
      return () => subscription.remove();
    }, [handleBack]),
  );

  const [values, setValues] = useState({
    fullName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    contactNumber: "",
  });
  const setField = (key) => (text) =>
    setValues((current) => ({ ...current, [key]: text }));

  const handleNext = async () => {
    const name = [values.fullName, values.middleName, values.lastName, values.suffix]
      .map((part) => part.trim())
      .filter(Boolean)
      .join(" ");
    const patch = { contactNumber: values.contactNumber.trim() };

    // Only replace the profile name if something was typed.
    if (name) {
      const saved = await loadSavedProfile(user?.id);
      patch.profile = {
        location: saved?.profile?.location ?? "",
        name,
        firstName: values.fullName.trim(),
        lastName: values.lastName.trim(),
      };
    }

    await saveProfileData(user?.id, patch);
    router.push("/registration/birthDate");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <ChevronLeft size={30} color="black" style={styles.back} onPress={handleBack} />
            <Text style={styles.title}>Basic Information</Text>
            <Text style={styles.subtitle}>Please provide your basic information to get started.</Text>
          </View>

          <AuthInput
            label="Full name"
            placeholder="Jane Doe"
            value={values.fullName}
            onChangeText={setField("fullName")}
          />
          <AuthInput
            label="Middle Name"
            placeholder="Ex: Cruz"
            value={values.middleName}
            onChangeText={setField("middleName")}
          />
          <View style={styles.row}>
            <AuthInput
              style={{ flex: 3 }}
              label="Last Name"
              placeholder="Ex: Doe"
              value={values.lastName}
              onChangeText={setField("lastName")}
            />
            <AuthInput
              style={{ flex: 1 }}
              label="Suffix"
              placeholder="Ex: Jr."
              value={values.suffix}
              onChangeText={setField("suffix")}
            />
          </View>
          <AuthInput
            label="Contact Number"
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            value={values.contactNumber}
            onChangeText={setField("contactNumber")}
          />

          <PrimaryButton title="NEXT" onPress={handleNext} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function BasicInformationRoute() {
  return (
    <EmployeeOnly>
      <BasicInformationScreen />
    </EmployeeOnly>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  card: { backgroundColor: theme.colors.cardBackground, padding: 22 },
  header: { marginBottom: 18 },
  back: { marginBottom: 20 },
  title: {
    color: theme.colors.title,
    fontSize: theme.fontSize.title,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.subtitle,
    fontSize: theme.fontSize.medium,
    lineHeight: 22,
  },
  row: { flexDirection: "row", width: "100%", gap: 12 },
});