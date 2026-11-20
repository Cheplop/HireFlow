import { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/common/PrimaryButton";
import StatusCard from "@/components/common/StatusCard";
import ProfileScreen from "../../screens/ProfileScreen";
import { useAuth } from "../../contexts/AuthContext";
import { useApplications } from "../../contexts/ApplicationsContext";
import { useJobs } from "../../contexts/JobsContext";
import { getApplicantStarterProfile } from "../../data/profileStorage";
import theme from "../../styles/theme";

export default function ApplicantDetails() {
  const { id, jobId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getApplicationById, setApplicationStatus } = useApplications();
  const { getJobById } = useJobs();
  const application = getApplicationById(id);
  const applicant = application?.applicant;
  const job = application && getJobById(application.jobId);
  const requestedJobId = Array.isArray(jobId) ? jobId[0] : jobId;
  const status = application?.status;
  const [error, setError] = useState("");
  const profileFallback = getApplicantStarterProfile(applicant);

  if (
    user?.role !== "employer" ||
    !applicant ||
    !application.employeeId ||
    !job ||
    job.employerId !== user.id ||
    (requestedJobId && Number(requestedJobId) !== job.id)
  ) {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.heading}>Applicant not found</Text>
      </SafeAreaView>
    );
  }

  function updateStatus(nextStatus) {
    try {
      setApplicationStatus(application.id, user.id, nextStatus);
      setError("");
    } catch (updateError) {
      setError(updateError.message);
    }
  }

  const headerContent = (
    <View style={styles.header}>
      <PrimaryButton
        title="Back"
        variant="inactive"
        onPress={() => router.back()}
        style={styles.backButton}
      />
      <Text style={styles.heading} numberOfLines={1}>
        Applicant Profile
      </Text>
    </View>
  );

  const footerContent = (
    <View style={styles.applicationFooter}>
      <View style={styles.statusRow}>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusLabel}>Application status</Text>
          <Text style={styles.statusJob}>{job.jobTitle}</Text>
        </View>
        <StatusCard status={status} />
      </View>
      <View style={styles.actions}>
        {["Pending", "Accepted", "Declined", "Completed"].map((nextStatus) => (
          <PrimaryButton
            key={nextStatus}
            title={nextStatus}
            variant={status === nextStatus ? "active" : "inactive"}
            onPress={() => updateStatus(nextStatus)}
            style={styles.actionButton}
          />
        ))}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );

  return (
    <ProfileScreen
      profileUserId={application.employeeId}
      profileFallback={profileFallback}
      readOnly
      headerContent={headerContent}
      footerContent={footerContent}
    />
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.medium,
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  },
  backButton: {
    width: 90,
    height: 36,
    paddingVertical: 6,
  },
  heading: {
    color: theme.fontColor.primary,
    fontSize: 22,
    fontWeight: "700",
    flex: 1,
  },
  applicationFooter: {
    gap: theme.spacing.medium,
    marginTop: theme.spacing.medium,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.cardBackground,
  },
  statusTextContainer: {
    flex: 1,
    gap: 3,
  },
  statusLabel: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
  statusJob: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: "700",
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.medium,
  },
  actionButton: {
    flexGrow: 1,
    flexBasis: "40%",
  },
  errorText: {
    color: "#B3261E",
    fontSize: theme.fontSize.small,
  },
});
