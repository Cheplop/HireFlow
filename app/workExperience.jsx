import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { ChevronLeft } from "lucide-react-native";

export default function WorkExperienceScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginBottom: 20, alignSelf: "flex-start" }}
          activeOpacity={0.7}
        >
          <ChevronLeft size={30} color="black" />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.brand}>Work Experience</Text>
          <View style={styles.description}>
            <Text style={styles.subtitle}>
              Add your most recent role so we can match you with similar jobs.
            </Text>
          </View>
        </View>

        <AuthInput label="Job title" placeholder="Ex: Web Developer" />
        <AuthInput label="Company" placeholder="Ex: Brightline Labs" />
        <AuthInput label="Location" placeholder="Ex: Cebu" />

        <View style={{ flexDirection: "row", width: "100%", gap: 12 }}>
          <AuthInput
            style={{ flex: 1 }}
            label="Start date"
            placeholder="MM/YYYY"
          />
          <AuthInput
            style={{ flex: 1 }}
            label="End date"
            placeholder="MM/YYYY"
          />
        </View>

        <AuthInput
          label="Description"
          placeholder="What did you work on?"
          multiline
        />

        <PrimaryButton title="Confirm" onPress={() => router.back()} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
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
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  subtitle: {
    color: "#5f6c7b",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 40,
  },
  description: {
    width: 250,
  },
});
