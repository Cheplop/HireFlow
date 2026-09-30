import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useLocalSearchParams, router } from "expo-router";

import { getJobById } from "@/data/jobs";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const job = getJobById(id);

  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Job listing</Text>
      <Text style={styles.title}>{job.name}</Text>
      <Text style={styles.meta}>
        {job.company} · {job.location}
      </Text>
      <Text style={styles.description}>{job.description}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f4f7fb",
  },
  eyebrow: {
    color: "#184a9e",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#112033",
    marginBottom: 8,
  },
  meta: {
    fontSize: 16,
    color: "#184a9e",
    fontWeight: "600",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: "#1f2d3d",
    marginBottom: 30,
    lineHeight: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#112033",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});