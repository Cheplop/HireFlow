import { router } from "expo-router";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/common/PrimaryButton";
import SearchRow from "@/components/common/SearchRow";
import DashboardSummary from "@/components/DashboardSummary";
import { ApplyCard } from "@/components/employee/ApplyCard";
import { useApplications } from "../contexts/ApplicationsContext";
import { useAuth } from "../contexts/AuthContext";
import { useJobs } from "../contexts/JobsContext";
import theme from "../styles/theme";

const employmentTypes = ["All", "Full-time", "Part-time", "Contractual"];

function normalizeType(type) {
  return type.toLowerCase().replace(/[\s-]/g, "");
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { jobs, getJobsForEmployer } = useJobs();
  const { applications } = useApplications();
  const isEmployer = user?.role === "employer";

  const filledJobIds = useMemo(
    () =>
      new Set(
        applications
          .filter((application) =>
            ["Accepted", "Completed"].includes(application.status),
          )
          .map((application) => String(application.jobId)),
      ),
    [applications],
  );
  const visibleJobs = useMemo(() => {
    const availableJobs = isEmployer
      ? getJobsForEmployer(user.id)
      : jobs.filter((job) => job.isPublished);

    return availableJobs.filter((job) => !filledJobIds.has(String(job.id)));
  }, [filledJobIds, getJobsForEmployer, isEmployer, jobs, user]);
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return visibleJobs.filter((job) => {
      const matchesType =
        selectedType === "All" ||
        normalizeType(job.jobMode) === normalizeType(selectedType);
      const searchableText = [
        job.jobTitle,
        job.jobCompany,
        job.jobLocation,
        job.jobDescription,
      ]
        .join(" ")
        .toLowerCase();

      return matchesType && (!query || searchableText.includes(query));
    });
  }, [search, selectedType, visibleJobs]);

  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <SearchRow
        placeholder="Search jobs..."
        value={search}
        onChangeText={setSearch}
        notificationLabel="View notifications"
        onNotificationPress={() => router.push("/notifications")}
      />

      {/* Job Type Filters */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterScroll}
        contentContainerStyle={styles.filters}
      >
        {employmentTypes.map((type) => (
          <PrimaryButton
            key={type}
            title={type}
            variant={selectedType === type ? "active" : "inactive"}
            onPress={() => setSelectedType(type)}
            style={styles.filterButton}
          />
        ))}
      </ScrollView>

      <DashboardSummary />

      <FlatList
        data={filteredJobs}
        style={styles.jobList}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ApplyCard
            cardLogo={item.companyLogo}
            cardTitle={item.jobTitle}
            cardCompany={item.jobCompany}
            cardLocation={item.jobLocation}
            cardMode={`${item.jobMode} · ${item.jobType}`}
            cardDescription={item.jobDescription}
            actionTitle={isEmployer ? "View" : "Apply"}
            onApply={() => router.push(`/jobDetails/${item.id}`)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyState}>
            No jobs match your search. Try another keyword or filter.
          </Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },

  filterScroll: {
    flexGrow: 0,
    flexShrink: 0,
  },

  filters: {
    gap: 8,
    paddingBottom: theme.spacing.medium,
  },

  filterButton: {
    width: "auto",
    minWidth: 84,
    height: 34,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
    borderColor: theme.colors.border,
  },

  jobList: {
    flex: 1,
  },

  cards: {
    gap: 12,
    paddingBottom: 130,
    paddingHorizontal: 2,
    paddingTop: 2,
    flexGrow: 1,
  },

  emptyState: {
    color: theme.fontColor.secondary,
    textAlign: "center",
    padding: theme.spacing.large,
    marginTop: theme.spacing.medium,
  },
});
