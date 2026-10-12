import { useMemo, useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";

import { filterJobs } from "@/data/jobs";

export default function JobsScreen() {
  const [query, setQuery] = useState("");
  const jobs = useMemo(() => filterJobs(query), [query]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Review jobs</Text>
      <Text style={styles.subtitle}>
        Search by role, company, or location, then open a listing.
      </Text>

      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search jobs..."
        placeholderTextColor="#abb0b7"
        autoCapitalize="none"
        autoCorrect={false}
        style={styles.search}
      />

      <FlatList
        data={jobs}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.empty}>No jobs match “{query.trim()}”.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => router.push(`/details/${item.id}`)}
          >
            <Text style={styles.jobName}>{item.name}</Text>
            <Text style={styles.jobMeta}>
              {item.company} · {item.location}
            </Text>
            <Text style={styles.jobPreview} numberOfLines={2}>
              {item.description}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  backButtonText: {
    color: "#184a9e",
    fontSize: 14,
    fontWeight: "700",
  },
  title: {
    color: "#112033",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  subtitle: {
    color: "#5f6c7b",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
    marginBottom: 16,
  },
  search: {
    backgroundColor: "#ffffff",
    borderColor: "#d7e0ee",
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#112033",
    marginBottom: 12,
  },
  list: {
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#dfe7f4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3,
  },
  jobName: {
    color: "#112033",
    fontSize: 17,
    fontWeight: "800",
    marginBottom: 4,
  },
  jobMeta: {
    color: "#184a9e",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
  },
  jobPreview: {
    color: "#5f6c7b",
    fontSize: 13,
    lineHeight: 18,
  },
  empty: {
    color: "#5f6c7b",
    fontSize: 14,
    textAlign: "center",
    marginTop: 32,
  },
});
