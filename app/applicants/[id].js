import { useMemo, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ChevronLeft } from "lucide-react-native";
import { Alert, Linking, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/common/PrimaryButton";
import StatusCard from "@/components/common/StatusCard";
import ProfileScreen from "../../screens/ProfileScreen";
import { useAuth } from "../../contexts/AuthContext";
import { useApplications } from "../../contexts/ApplicationsContext";
import { useJobs } from "../../contexts/JobsContext";
import { getApplicantStarterProfile } from "../../data/profileStorage";
import theme from "../../styles/theme";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  const [isUpdating, setIsUpdating] = useState(false);
  // Keep the fallback snapshot stable when returning from the external mail app.
  const profileFallback = useMemo(
    () => getApplicantStarterProfile(applicant),
    // The application id identifies the immutable applicant snapshot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [application?.id],
  );

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

  async function updateStatus(nextStatus) {
    setError("");
    setIsUpdating(true);
    try {
      await setApplicationStatus(application.id, user.id, nextStatus);
    } catch (updateError) {
      setError(
        updateError instanceof Error
          ? updateError.message
          : "Could not update this application. Please try again.",
      );
    } finally {
      setIsUpdating(false);
    }
  }

  async function openApplicantEmail(type) {
    const contactEmail = applicant.contactEmail || profileFallback?.profile?.email;
    if (!contactEmail || !EMAIL_PATTERN.test(contactEmail.trim())) {
      setError("This applicant must have a valid contact email before they can be contacted.");
      return;
    }

    const isOffer = type === "offer";
    const subject = encodeURIComponent(
      isOffer
        ? `Job Offer: ${job.jobTitle} at ${job.jobCompany}`
        : `Interview Invitation: ${job.jobTitle} at ${job.jobCompany}`,
    );
    const body = encodeURIComponent(
      isOffer
        ? `Hi ${applicant.name || "there"},\n\nCongratulations! We are pleased to offer you the position of ${job.jobTitle} at ${job.jobCompany}.\n\nPlease reply to this email to confirm your acceptance and discuss next steps.\n\nBest regards,\n${user.username || "The hiring team"}`
        : `Hi ${applicant.name || "there"},\n\nWe would like to invite you for an interview for the ${job.jobTitle} position at ${job.jobCompany}. Please reply with your available dates and times.\n\nBest regards,\n${user.username || "The hiring team"}`,
    );

    try {
      const mailtoUrl = `mailto:${contactEmail}?subject=${subject}&body=${body}`;
      if (!(await Linking.canOpenURL(mailtoUrl))) {
        setError("No email app (such as Gmail) is available on this device.");
        return;
      }
      await Linking.openURL(mailtoUrl);
      setError("");
    } catch {
      setError("Could not open email app.");
    }
  }

  function confirmStatus(nextStatus) {
    const commit = () => { void updateStatus(nextStatus); };
    const message = `Are you sure you want to ${nextStatus.toLowerCase()} ${applicant.name || "this application"}?`;
    if (Platform.OS === "web") {
      if (typeof window !== "undefined" && window.confirm(message)) commit();
      return;
    }
    Alert.alert(`${nextStatus} application`, message, [
      { text: "Cancel", style: "cancel" },
      { text: nextStatus, style: nextStatus === "Declined" ? "destructive" : "default", onPress: commit },
    ]);
  }

  const headerContent = (
    <View style={styles.header}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back to applicants"
        onPress={() => router.back()}
        style={styles.backButton}
      >
        <ChevronLeft size={24} color={theme.fontColor.primary} />
      </Pressable>
    </View>
  );

  const footerContent = (
    <View style={styles.applicationFooter}>
      <View style={styles.applicationInfo}>
        <Text style={styles.sectionTitle}>Application</Text>
        <Text style={styles.infoText}>Job: {job.jobTitle || "Job listing"}</Text>
        <Text style={styles.infoText}>
          Applied: {application.appliedAt ? new Date(application.appliedAt).toLocaleDateString() : "Date unavailable"}
        </Text>
        <Text style={styles.infoText}>Cover letter</Text>
        <Text style={styles.coverLetter}>{application.coverLetter || "No cover letter was submitted."}</Text>
        <PrimaryButton
          title="View job listing"
          variant="inactive"
          onPress={() => router.push(`/jobDetails/${job.id}`)}
          style={styles.jobButton}
        />
      </View>
      <View style={styles.statusRow}>
        <View style={styles.statusTextContainer}>
          <Text style={styles.statusLabel}>Application status</Text>
          <Text style={styles.statusJob}>{status}</Text>
        </View>
        <StatusCard status={status} />
      </View>
      {status === "Pending" || status === "Accepted" ? (
        <View style={styles.actions}>
          {(status === "Pending" ? ["Accepted", "Declined"] : ["Completed"]).map((nextStatus) => (
            <PrimaryButton
              key={nextStatus}
              title={isUpdating ? "Saving…" : nextStatus === "Accepted" ? "Accept" : nextStatus === "Declined" ? "Decline" : "Mark completed"}
              variant={nextStatus === "Declined" ? "secondary" : "active"}
              onPress={() => confirmStatus(nextStatus)}
              disabled={isUpdating}
              style={styles.actionButton}
            />
          ))}
        </View>
      ) : null}
      {status === "Pending" ? (
        <PrimaryButton
          title="Invite to Interview via Gmail"
          variant="inactive"
          onPress={() => openApplicantEmail("interview")}
        />
      ) : null}
      {status === "Accepted" ? (
        <PrimaryButton
          title="Send Job Offer via Gmail"
          onPress={() => openApplicantEmail("offer")}
        />
      ) : null}
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
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    backgroundColor: theme.colors.cardBackground,
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
  applicationInfo: {
    gap: 8,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.cardBackground,
  },
  sectionTitle: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: "700",
  },
  infoText: { color: theme.fontColor.secondary, fontSize: theme.fontSize.small },
  coverLetter: { color: theme.fontColor.primary, fontSize: theme.fontSize.small, lineHeight: 20 },
  jobButton: { marginTop: 4 },
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
