import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Award,
  Bell,
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
import { useNotifications } from "../../contexts/NotificationsContext";
import { getApplicantStarterProfile } from "../../data/profileStorage";
import theme from "../../styles/theme";

const profileTabs = ["Education", "Job Experience", "Licenses & Cert"];

export default function ApplicantDetails() {
  const { id, jobId } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const { getApplicationById, setApplicationStatus } = useApplications();
  const { getJobById } = useJobs();
  const { getUnreadCount } = useNotifications();
  const unreadCount = user ? getUnreadCount(user.id) : 0;

  const application = getApplicationById(id);
  const applicant = application?.applicant;
  const job = application && getJobById(application.jobId);
  const requestedJobId = Array.isArray(jobId) ? jobId[0] : jobId;
  const status = application?.status;

  const [showFullProfile, setShowFullProfile] = useState(false);
  const [selectedProfileTab, setSelectedProfileTab] = useState("Education");
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
      <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
        <View style={styles.notFound}>
          <Text style={styles.emptyState}>Applicant not found.</Text>
          <PrimaryButton title="GO BACK" onPress={() => router.back()} />
        </View>
      </SafeAreaView>
    );
  }

  const contactEmail = applicant.contactEmail || profileFallback?.contactEmail;
  const contactPhone = applicant.contactPhone || profileFallback?.contactPhone;
  const education = applicant.education || profileFallback?.education;
  const experience = applicant.experience || profileFallback?.experience;
  const certifications =
    applicant.certifications || profileFallback?.certifications || "";
  const about = applicant.about || profileFallback?.about;
  const skills = applicant.skills?.length
    ? applicant.skills
    : profileFallback?.skills || [];

  const coverLetterText =
    typeof application.coverLetter === "string"
      ? application.coverLetter
      : application.coverLetter?.text || "";

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

  async function openApplicantEmail(type) {
    if (!contactEmail) {
      setError("This applicant does not have a contact email on file.");
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
        ? `Hi ${applicant.name},\n\n` +
            `Congratulations! We are pleased to offer you the position of ${job.jobTitle} at ${job.jobCompany} (${job.jobMode} · ${job.jobType}).\n\n` +
            `Salary: ₱${Number(job.salary || 0).toLocaleString()}\n\n` +
            `Please reply to this email to confirm your acceptance and discuss next steps.\n\n` +
            `Best regards,\n${user.username}\n${job.jobCompany}`
        : `Hi ${applicant.name},\n\n` +
            `Thank you for applying for the ${job.jobTitle} position at ${job.jobCompany} (${job.jobMode} · ${job.jobType}).\n\n` +
            `We reviewed your application and would like to invite you for an interview. Please reply to this email with your available dates and times this week.\n\n` +
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
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.headerContainer}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          onPress={() => router.back()}
          style={styles.circleButton}
        >
          <ChevronLeft size={22} color={theme.fontColor.primary} />
        </Pressable>

        <Text style={styles.heading} numberOfLines={1}>
          Applicant Details
        </Text>

        <Pressable
          accessibilityLabel="View notifications"
          accessibilityRole="button"
          onPress={() => router.push("/notifications")}
          style={styles.circleButton}
        >
          <Bell size={20} color={theme.fontColor.primary} />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {unreadCount > 9 ? "9+" : unreadCount}
              </Text>
            </View>
          )}
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top Applicant Summary Card */}
        <View style={styles.card}>
          <View style={styles.wrapper}>
            <View style={styles.imageContainer}>
              <Image
                source={applicant.avatar}
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>

            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{applicant.name}</Text>
              <Text style={styles.cardCompany}>{job.jobTitle}</Text>

              {education ? (
                <View style={styles.metaRow}>
                  <BookOpen size={14} color={theme.fontColor.secondary} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {education}
                  </Text>
                </View>
              ) : null}

              {experience ? (
                <View style={styles.metaRow}>
                  <Briefcase size={14} color={theme.fontColor.secondary} />
                  <Text style={styles.metaText} numberOfLines={1}>
                    {experience}
                  </Text>
                </View>
              ) : null}

              {about ? (
                <Text style={styles.cardDescription} numberOfLines={2}>
                  {about}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <PrimaryButton
              title={showFullProfile ? "Hide Profile" : "View Profile"}
              variant="inactive"
              style={styles.compactButton}
              onPress={() => setShowFullProfile((prev) => !prev)}
            />
            <PrimaryButton
              title="View Job"
              style={styles.compactButton}
              onPress={() => router.push(`/jobDetails/${job.id}`)}
            />
          </View>
        </View>

        {/* Expandable Leader-Style Profile Tabs (Education, Job Experience, Licenses & Cert) */}
        {showFullProfile && (
          <View style={styles.sectionCard}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.tabRow}
            >
              {profileTabs.map((tab) => (
                <PrimaryButton
                  key={tab}
                  title={tab}
                  variant={selectedProfileTab === tab ? "active" : "inactive"}
                  onPress={() => setSelectedProfileTab(tab)}
                  style={styles.tabButton}
                />
              ))}
            </ScrollView>

            {selectedProfileTab === "Education" && (
              <View style={styles.detailRow}>
                <BookOpen size={16} color={theme.colors.primary} />
                <Text style={styles.detailText}>
                  {education || "No education added."}
                </Text>
              </View>
            )}

            {selectedProfileTab === "Job Experience" && (
              <View style={styles.detailRow}>
                <Briefcase size={16} color={theme.colors.primary} />
                <Text style={styles.detailText}>
                  {experience || "No job experience added."}
                </Text>
              </View>
            )}

            {selectedProfileTab === "Licenses & Cert" && (
              <View style={styles.detailRow}>
                <Award size={16} color={theme.colors.primary} />
                <Text style={styles.detailText}>
                  {certifications || "No licenses or certifications added."}
                </Text>
              </View>
            )}

            <View style={styles.divider} />

            {contactEmail ? (
              <View style={styles.detailRow}>
                <Mail size={16} color={theme.fontColor.secondary} />
                <Text style={styles.detailText}>{contactEmail}</Text>
              </View>
            ) : null}
            {contactPhone ? (
              <View style={styles.detailRow}>
                <Phone size={16} color={theme.fontColor.secondary} />
                <Text style={styles.detailText}>{contactPhone}</Text>
              </View>
            ) : null}

            {skills.length > 0 ? (
              <>
                <View style={styles.skillsHeader}>
                  <Sparkles size={16} color={theme.colors.primary} />
                  <Text style={styles.sectionTitle}>Skills</Text>
                </View>
                <View style={styles.skillsWrap}>
                  {skills.map((skill) => (
                    <View key={skill} style={styles.skillPill}>
                      <Text style={styles.skillText}>{skill}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : null}
          </View>
        )}

        {/* Cover Letter */}
        {coverLetterText ? (
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>Cover Letter</Text>
            <Text style={styles.bodyText}>{coverLetterText}</Text>
          </View>
        ) : null}

        {/* Application Status Card */}
        <View style={styles.sectionCard}>
          <View style={styles.statusRow}>
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Application status</Text>
              <Text style={styles.statusValue}>{status}</Text>
            </View>
            <StatusCard status={status} />
          </View>
        </View>

        {/* Step 1: Pending -> Accept / Decline + Email for Interview */}
        {status === "Pending" && (
          <>
            <View style={styles.twoButtonRow}>
              <PrimaryButton
                title="Accept"
                variant="active"
                onPress={() => updateStatus("Accepted")}
                style={styles.halfButton}
              />
              <PrimaryButton
                title="Decline"
                variant="inactive"
                onPress={() => updateStatus("Declined")}
                style={styles.halfButton}
              />
            </View>

            <PrimaryButton
              title="Invite to Interview via Gmail"
              variant="inactive"
              onPress={() => openApplicantEmail("interview")}
            />
          </>
        )}

        {/* Step 2: Accepted -> Send Job Offer + Completed */}
        {status === "Accepted" && (
          <>
            <PrimaryButton
              title="Send Job Offer via Gmail"
              onPress={() => openApplicantEmail("offer")}
            />
            <PrimaryButton
              title="Completed"
              variant="inactive"
              onPress={() => updateStatus("Completed")}
            />
          </>
        )}

        {/* Step 2b: Declined -> Completed */}
        {status === "Declined" && (
          <PrimaryButton
            title="Completed"
            variant="inactive"
            onPress={() => updateStatus("Completed")}
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
  },
  notFound: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 22,
    gap: theme.spacing.medium,
  },
  emptyState: {
    color: theme.fontColor.secondary,
    textAlign: "center",
    padding: theme.spacing.large,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.small,
    paddingHorizontal: 22,
    paddingVertical: theme.spacing.small,
  },
  circleButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    backgroundColor: theme.colors.cardBackground,
    borderColor: theme.colors.border,
    borderWidth: 1,
    borderRadius: theme.radius.large,
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    paddingHorizontal: 4,
    borderRadius: 8,
    backgroundColor: "#B3261E",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "700",
  },
  heading: {
    flex: 1,
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.large,
    fontWeight: "700",
    marginLeft: 4,
  },
  content: {
    paddingHorizontal: 22,
    paddingTop: 2,
    paddingBottom: 130,
    gap: 12,
  },
  card: {
    flexDirection: "column",
    alignSelf: "stretch",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
    boxShadow: theme.boxShadow.default,
  },
  wrapper: {
    flexDirection: "row",
    gap: theme.spacing.medium,
    padding: 10,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
  },
  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 64,
    height: 64,
    borderRadius: 12,
    boxShadow: theme.boxShadow.default,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: {
    width: 64,
    height: 64,
  },
  cardContent: {
    flex: 1,
    alignSelf: "flex-start",
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
    color: theme.fontColor.primary,
    marginBottom: 2,
  },
  cardCompany: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.primary,
    marginBottom: 5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  metaText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },
  cardDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: theme.fontColor.secondary,
    fontWeight: theme.fontWeight.muted,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: theme.spacing.small,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  compactButton: {
    width: 105,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  sectionCard: {
    padding: 14,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
    gap: 10,
  },
  tabRow: {
    gap: theme.spacing.small,
  },
  tabButton: {
    width: "auto",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 17,
    borderColor: theme.colors.border,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.mutedBackground,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: theme.spacing.small,
  },
  statusTextContainer: {
    flex: 1,
    gap: 2,
  },
  statusLabel: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
  statusValue: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
  },
  sectionTitle: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
  },
  bodyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 19,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },
  skillsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  skillsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.small,
  },
  skillPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
    backgroundColor: theme.colors.mutedBackground,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: "center",
    alignItems: "center",
  },
  skillText: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.primary,
  },
  twoButtonRow: {
    flexDirection: "row",
    gap: theme.spacing.small,
  },
  halfButton: {
    flex: 1,
  },
  errorText: {
    color: theme.actions.deletePrimary,
    fontSize: theme.fontSize.small,
    textAlign: "center",
  },
});