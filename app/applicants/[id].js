import { useLocalSearchParams, useRouter } from "expo-router";
import {
  BookOpen,
  Briefcase,
  ChevronLeft,
  Mail,
  Phone,
  Sparkles,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/common/PrimaryButton";
import StatusCard from "@/components/common/StatusCard";
import { useApplications } from "../../contexts/ApplicationsContext";
import { useAuth } from "../../contexts/AuthContext";
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
  const [isUpdating, setIsUpdating] = useState(false);
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

  const contactEmail = applicant.contactEmail || profileFallback?.contactEmail;
  const contactPhone = applicant.contactPhone || profileFallback?.contactPhone;
  const education = applicant.education || profileFallback?.education;
  const experience = applicant.experience || profileFallback?.experience;
  const about = applicant.about || profileFallback?.about;
  const skills = applicant.skills?.length
    ? applicant.skills
    : profileFallback?.skills || [];

  async function updateStatus(nextStatus) {
    if (isUpdating) return;
    setError("");
    setIsUpdating(true);
    try {
      await setApplicationStatus(application.id, user.id, nextStatus);
    } catch (updateError) {
      setError(updateError.message);
    } finally {
      setIsUpdating(false);
    }
  }

  async function sendJobOfferEmail() {
    if (!contactEmail) {
      setError("This applicant does not have a contact email on file.");
      return;
    }

    const subject = encodeURIComponent(
      `Job Offer: ${job.jobTitle} at ${job.jobCompany}`,
    );
    const body = encodeURIComponent(
      `Hi ${applicant.name},\n\n` +
        `Congratulations! We are pleased to offer you the position of ${job.jobTitle} at ${job.jobCompany} (${job.jobMode} · ${job.jobType}).\n\n` +
        `Salary: ₱${Number(job.salary || 0).toLocaleString()}\n\n` +
        `Please reply to this email to confirm your acceptance and discuss next steps.\n\n` +
        `Best regards,\n${user.username}\n${job.jobCompany}`,
    );

    const mailtoUrl = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    try {
      const supported = await Linking.canOpenURL(mailtoUrl);
      if (supported) {
        await Linking.openURL(mailtoUrl);
        setError("");
      } else {
        setError("No email app (such as Gmail) is available on this device.");
      }
    } catch {
      setError("Could not open email app.");
    }
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ChevronLeft size={22} color={theme.fontColor.primary} />
        </Pressable>
        <Text style={styles.heading} numberOfLines={1}>
          Applicant Details
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.profileCard}>
          <Image
            source={applicant.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          <Text style={styles.name}>{applicant.name}</Text>
          {about ? <Text style={styles.about}>{about}</Text> : null}
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

        {application.coverLetter ? (
          <View style={styles.applicationInfo}>
            <Text style={styles.sectionTitle}>Cover Letter</Text>
            <Text style={styles.coverLetter}>{application.coverLetter}</Text>
          </View>
        ) : null}

        <View style={styles.detailCard}>
          {contactEmail ? (
            <View style={styles.detailRow}>
              <Mail size={18} color={theme.fontColor.secondary} />
              <Text style={styles.detailText}>{contactEmail}</Text>
            </View>
          ) : null}
          {contactPhone ? (
            <View style={styles.detailRow}>
              <Phone size={18} color={theme.fontColor.secondary} />
              <Text style={styles.detailText}>{contactPhone}</Text>
            </View>
          ) : null}
          {education ? (
            <View style={styles.detailRow}>
              <BookOpen size={18} color={theme.fontColor.secondary} />
              <Text style={styles.detailText}>{education}</Text>
            </View>
          ) : null}
          {experience ? (
            <View style={styles.detailRow}>
              <Briefcase size={18} color={theme.fontColor.secondary} />
              <Text style={styles.detailText}>{experience}</Text>
            </View>
          ) : null}
        </View>

        {skills.length > 0 ? (
          <View style={styles.detailCard}>
            <View style={styles.skillsHeader}>
              <Sparkles size={18} color={theme.fontColor.secondary} />
              <Text style={styles.sectionHeading}>Skills</Text>
            </View>
            <View style={styles.skillsWrap}>
              {skills.map((skill) => (
                <View key={skill} style={styles.skillBadge}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <View style={styles.actions}>
          {["Pending", "Accepted", "Declined", "Completed"].map(
            (nextStatus) => (
              <PrimaryButton
                key={nextStatus}
                title={nextStatus}
                variant={status === nextStatus ? "active" : "inactive"}
                onPress={() => updateStatus(nextStatus)}
                style={styles.actionButton}
              />
            ),
          )}
        </View>

        {status === "Accepted" && (
          <PrimaryButton
            title="Send Job Offer via Gmail"
            onPress={sendJobOfferEmail}
          />
        )}

        {error ? <Text style={styles.errorText}>{error}</Text> : null}
      </ScrollView>
    </SafeAreaView>
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
  content: {
    paddingBottom: 110,
    gap: theme.spacing.medium,
  },
  profileCard: {
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    alignItems: "center",
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
    gap: 6,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    marginBottom: theme.spacing.small,
  },
  name: {
    fontSize: theme.fontSize.large,
    fontWeight: "bold",
    color: theme.fontColor.primary,
  },
  about: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
    textAlign: "center",
    lineHeight: 19,
  },
  jobButton: {
    marginTop: 8,
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
  coverLetter: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.small,
    lineHeight: 20,
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
  detailCard: {
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
    gap: theme.spacing.small,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.small,
  },
  detailText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.primary,
    lineHeight: 19,
  },
  skillsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeading: {
    fontSize: theme.fontSize.medium,
    fontWeight: "700",
    color: theme.fontColor.primary,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.small,
  },
  skillBadge: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.radius.large,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderColor: theme.colors.border,
    borderWidth: 1,
  },
  skillText: {
    fontSize: 12,
    color: theme.fontColor.primary,
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
