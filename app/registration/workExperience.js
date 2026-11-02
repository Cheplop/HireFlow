import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { PrimaryButton } from "@/components/PrimaryButton";

const FIELDS = [
  { key: "company", label: "Company", placeholder: "Ex: Meta" },
  { key: "position", label: "Position", placeholder: "Ex: Senior UX Designer" },
];

export default function WorkExperienceScreen() {

  const [values, setValues] = useState({ company: "", position: "" });

  const setField = (key, text) => setValues((prev) => ({ ...prev, [key]: text }));

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <ChevronLeft
            size={30}
            color="black"
            style={{ marginBottom: 20 }}
            onPress={() => router.replace("/registration/educationalBackground")}
          />

          <View style={styles.header}>
            <Text style={styles.heading}>Work Experience</Text>
            <View style={styles.description}>
              <Text style={styles.subtitle}>Any work experience to add to your resume</Text>
            </View>
          </View>

          {FIELDS.map((f) => (
            <View key={f.key} style={styles.fieldWrap}>
              <Text style={styles.fieldLabel}>{f.label}</Text>
              <TextInput
                style={[
                  styles.input,
                  { fontStyle: values[f.key] ? "normal" : "italic" },
                ]}
                placeholder={f.placeholder}
                placeholderTextColor="#abb0b7"
                value={values[f.key]}
                onChangeText={(text) => setField(f.key, text)}
              />
            </View>
          ))}

          <PrimaryButton
            title="NEXT"
            style={styles.nextButton}
            onPress={() => router.replace("/")}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  // Whole screen
  screen: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 40,
  },

  // Title + subtitle
  header: {
    marginBottom: 24,
  },
  heading: {
    color: "black",
    fontSize: 26,
    fontWeight: "500",
    marginBottom: 8,
  },
  description: {
    width: 250,
  },
  subtitle: {
    color: "#6b7280",
    fontSize: 15,
    lineHeight: 20,
  },

  // Black label + rounded input
  fieldWrap: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: "black",
    fontSize: 13,
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#ffffff",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 22,
    height: 46,
    paddingHorizontal: 16,
    fontSize: 13,
    color: "#112033",
  },

  // NEXT button: overrides PrimaryButton's border and adds the soft shadow
  nextButton: {
    marginTop: 14,
    borderRadius: 22,
    borderColor: "#7288AE",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

