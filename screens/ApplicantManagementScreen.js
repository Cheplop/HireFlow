import { Search, Users } from "lucide-react-native";
import { useMemo, useState } from "react";
import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ApplicantCard from "@/components/ApplicantCard";
import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useAuth } from "../contexts/AuthContext";
import { useApplicants } from "../contexts/ApplicantsContext";
import { useJobs } from "../contexts/JobsContext";
import theme from "../styles/theme";

const statusFilters = ["All", "Pending", "Accepted", "Declined", "Completed"];

export default function ApplicantManagementScreen() {
  const [search, setSearch] = useState("");
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const { user } = useAuth();
  const { getJobsForEmployer } = useJobs();
  const employerJobs = getJobsForEmployer(user.id);
  const { getApplicantsByJob } = useApplicants();
  const activeJobId = employerJobs.some((job) => job.id === selectedJobId)
    ? selectedJobId
    : employerJobs[0]?.id;

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!activeJobId) return [];

    return getApplicantsByJob(activeJobId, user.id).filter((applicant) => {
      const status = applicant.status;
      const matchesStatus =
        selectedStatus === "All" || status === selectedStatus;
      const matchesSearch = applicant.name.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [activeJobId, getApplicantsByJob, selectedStatus, search, user.id]);

  const selectedJob = employerJobs.find((job) => job.id === activeJobId);

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.search}>
        <AuthInput
          placeholder="Search applicants..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          icon={<Search size={20} color="#abb0b7" />}
        />
      </View>

      <Text style={styles.heading}>Applicant Management</Text>
      <Text style={styles.subheading}>
        Review and manage applications for your job postings.
      </Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.jobs}
      >
        {employerJobs.map((job) => (
          <PrimaryButton
            key={job.id}
            title={job.jobTitle}
            variant={activeJobId === job.id ? "active" : "inactive"}
            onPress={() => setSelectedJobId(job.id)}
            style={styles.jobButton}
          />
        ))}
      </ScrollView>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filters}
      >
        {statusFilters.map((status) => (
          <PrimaryButton
            key={status}
            title={status}
            variant={selectedStatus === status ? "active" : "inactive"}
            onPress={() => setSelectedStatus(status)}
            style={styles.filterButton}
          />
        ))}
      </ScrollView>

      <Text style={styles.sectionLabel}>
        {selectedJob
          ? `${filteredApplicants.length} applicant${filteredApplicants.length === 1 ? "" : "s"} — ${selectedJob.jobTitle}`
          : "No jobs yet"}
      </Text>

      <FlatList
        data={filteredApplicants}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ApplicantCard
            applicant={item}
            jobId={activeJobId}
            status={item.status}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Users size={40} color={theme.fontColor.secondary} />
            <Text style={styles.emptyTitle}>
              {selectedJob ? "No applicants found" : "Publish a job to get started"}
            </Text>
            <Text style={styles.emptyText}>
              {selectedJob
                ? "Try a different status filter or search term."
                : "Applicants will appear here when they apply to your listings."}
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
  },
  search: {
    height: 55,
  },
  heading: {
    color: theme.fontColor.primary,
    fontSize: 22,
    fontWeight: "700",
    marginTop: theme.spacing.small,
  },
  subheading: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 18,
    marginTop: 4,
    marginBottom: theme.spacing.medium,
  },
  jobs: {
    gap: theme.spacing.small,
    paddingBottom: theme.spacing.small,
  },
  jobButton: {
    width: "auto",
    minWidth: 110,
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.large,
    borderColor: theme.colors.border,
  },
  filters: {
    gap: theme.spacing.small,
    paddingBottom: theme.spacing.small,
  },
  filterButton: {
    width: "auto",
    minWidth: 75,
    height: 36,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.large,
    borderColor: theme.colors.border,
  },
  sectionLabel: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    marginTop: 4,
    marginBottom: theme.spacing.small,
  },
  cards: {
    gap: theme.spacing.medium,
    paddingBottom: 110,
    paddingHorizontal: 2,
    paddingTop: theme.spacing.small,
    flexGrow: 1,
  },
  emptyState: {
    alignItems: "center",
    gap: theme.spacing.small,
    paddingHorizontal: theme.spacing.large,
    paddingTop: 64,
  },
  emptyTitle: {
    color: theme.fontColor.primary,
    fontWeight: "700",
    fontSize: theme.fontSize.large,
    textAlign: "center",
  },
  emptyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 19,
    textAlign: "center",
  },
});
