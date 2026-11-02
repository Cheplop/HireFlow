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

const SECTIONS = [
  {
    title: "Tertiary",
    fields: [
      { key: "tertiaryInstitution", label: "Institution", placeholder: "Enter the name of your school" },
      { key: "tertiaryDegree", label: "Degree", placeholder: "Enter your degree here" },
    ],
  },
  {
    title: "High School",
    fields: [
      { key: "highSchool", label: "Institution", placeholder: "Enter the name of your school" },
    ],
  },
  {
    title: "Elementary",
    fields: [
      { key: "elementary", label: null, placeholder: "Enter the name of your school" },
    ],
  },
];

export default function EducationalBackgroundScreen() {
  const [values, setValues] = useState({
    tertiaryInstitution: "",
    tertiaryDegree: "",
    highSchool: "",
    elementary: "",
  });


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
            onPress={() => router.replace("/registration/birthDate")}
          />

          <View style={styles.header}>
            <Text style={styles.heading}>Educational Background</Text>
            <View style={styles.description}>
              <Text style={styles.subtitle}>A quick background from your alma mater</Text>
            </View>
          </View>

          {SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <Text style={styles.sectionTitle}>{section.title}</Text>

              {section.fields.map((f) => (
                <View key={f.key} style={styles.fieldWrap}>
                  {f.label ? <Text style={styles.fieldLabel}>{f.label}</Text> : null}
                  <TextInput
                    style={[
                      styles.input,
                      // placeholder is italic in the design; typed text is normal
                      { fontStyle: values[f.key] ? "normal" : "italic" },
                    ]}
                    placeholder={f.placeholder}
                    placeholderTextColor="#abb0b7"
                    value={values[f.key]}
                    onChangeText={(text) => setField(f.key, text)}
                  />
                </View>
              ))}
            </View>
          ))}

          {/* NEXT button (gray-blue with shadow, like the design) */}
          <PrimaryButton
            title="NEXT"
            style={styles.nextButton}
            onPress={() => router.replace("/registration/workExperience")}
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
    marginBottom: 14,
  },
  heading: {
    color: "black",
    fontSize: 26,
    fontWeight: "400",
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

  section: {
    marginTop: 14,
  },
  sectionTitle: {
    color: "black",
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
  },

  fieldWrap: {
    marginBottom: 12,
  },
  fieldLabel: {
    color: "#8a8f98",
    fontSize: 12,
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

