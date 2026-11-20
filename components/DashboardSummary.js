import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

import RoleBadge from "./common/RoleBadge";
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

    tiles = [
      {
        label: "Active posts",
        value: myJobs.length,
        onPress: () => router.push("/(tabs)/posts"),
      },
      {
        label: "Applicants",
        value: received.length,
        onPress: () => router.push("/(tabs)/applicants"),
      },
      {
        label: "Pending",
        value: received.filter((item) => item.status === "Pending").length,
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
        value: mine.filter((item) => item.status === "Accepted").length,
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
  greetingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.small,
  },
  tiles: {
    flexDirection: "row",
    gap: theme.spacing.small,
  },
});