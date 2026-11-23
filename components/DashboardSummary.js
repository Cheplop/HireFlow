import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

import StatTile from "./common/StatTile";
import { useApplications } from "../contexts/ApplicationsContext";
import { useAuth } from "../contexts/AuthContext";
import { useJobs } from "../contexts/JobsContext";
import theme from "../styles/theme";

// Shared dashboard header: same layout for every role, different numbers.
export default function DashboardSummary() {
  const { user } = useAuth();
  const { jobs, getJobsForEmployer } = useJobs();
  const { applications, getApplicationsForEmployee } = useApplications();

  if (!user) return null;

  const isEmployer = user.role === "employer";
  let tiles;

  if (isEmployer) {
    const myJobs = getJobsForEmployer(user.id);
    const myJobIds = new Set(myJobs.map((job) => job.id));
    const received = applications.filter((item) => myJobIds.has(item.jobId));

    // Same rule the Jobs tab uses for "Closed": unpublished, or already filled.
    const filledJobIds = new Set(
      received
        .filter((item) => ["Accepted", "Completed"].includes(item.status))
        .map((item) => item.jobId),
    );
    const activePosts = myJobs.filter(
      (job) => job.isPublished && !filledJobIds.has(job.id),
    );
    const pending = received.filter((item) => item.status === "Pending");
    // Still in the pipeline: waiting for a decision, or accepted but not completed yet.
    const inProgress = received.filter((item) =>
      ["Pending", "Accepted"].includes(item.status),
    );

    tiles = [
      {
        label: "Active posts",
        value: activePosts.length,
        onPress: () => router.push("/(tabs)/posts"),
      },
      {
        label: "Applicants",
        value: inProgress.length,
        onPress: () => router.push("/(tabs)/applicants"),
      },
      {
        label: "Pending",
        value: pending.length,
        onPress: () => router.push("/(tabs)/applicants"),
      },
    ];
  } else {
    const mine = getApplicationsForEmployee(user.id);

    tiles = [
      {
        label: "Open jobs",
        value: jobs.filter((job) => job.isPublished).length,
      },
      {
        label: "Applied",
        value: mine.length,
        onPress: () => router.push("/(tabs)/applications"),
      },
      {
        label: "Accepted",
        value: mine.filter((item) =>
          ["Accepted", "Completed"].includes(item.status),
        ).length,
        onPress: () => router.push("/(tabs)/applications"),
      },
    ];
  }
  return (
    <View style={styles.container}>
      <View style={styles.tiles}>
        {tiles.map((tile) => (
          <StatTile key={tile.label} {...tile} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: theme.spacing.small + 4,
    marginBottom: theme.spacing.small,
  },
  tiles: {
    flexDirection: "row",
    gap: theme.spacing.small,
  },
});
