import { useLocalSearchParams, useRouter } from "expo-router";
import {
    BookOpen,
    Briefcase,
    Mail,
    Phone,
    Sparkles
} from "lucide-react-native";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/PrimaryButton";
import StatusCard from "@/components/StatusCard";
import { useApplicants } from "../../contexts/ApplicantsContext";
import { getApplicantById } from "../../data/applicants";
import { work } from "../../data/jobs";
import theme from "../../styles/theme";

export default function ApplicantDetails() {
  const { id, jobId } = useLocalSearchParams();
  const router = useRouter();
  const { getStatus, updateApplicationStatus } = useApplicants();

  const applicant = getApplicantById(id);
  const job = work.find((item) => item.id === Number(jobId));
  const status = getStatus(Number(id), Number(jobId));

  if (!applicant) {
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.heading}>Applicant not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.header}>
        <PrimaryButton
          title="Back"
          variant="inactive"
          onPress={() => router.back()}
          style={styles.backButton}
        />
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
          <Text style={styles.about}>{applicant.about}</Text>
          <View style={styles.statusRow}>
            <Text style={styles.statusLabel}>Status for {job?.jobTitle}</Text>
            <StatusCard status={status} />
          </View>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.detailRow}>
            <Mail size={18} color={theme.fontColor.secondary} />
            <Text style={styles.detailText}>{applicant.contactEmail}</Text>
          </View>
          <View style={styles.detailRow}>
            <Phone size={18} color={theme.fontColor.secondary} />
            <Text style={styles.detailText}>{applicant.contactPhone}</Text>
          </View>
          <View style={styles.detailRow}>
            <BookOpen size={18} color={theme.fontColor.secondary} />
            <Text style={styles.detailText}>{applicant.education}</Text>
          </View>
          <View style={styles.detailRow}>
            <Briefcase size={18} color={theme.fontColor.secondary} />
            <Text style={styles.detailText}>{applicant.experience}</Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <View style={styles.skillsHeader}>
            <Sparkles size={18} color={theme.fontColor.secondary} />
            <Text style={styles.sectionHeading}>Skills</Text>
          </View>
          <View style={styles.skillsWrap}>
            {applicant.skills.map((skill) => (
              <View key={skill} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Accept"
            variant="active"
            onPress={() =>
              updateApplicationStatus(Number(id), Number(jobId), "Accepted")
            }
            style={styles.actionButton}
          />
          <PrimaryButton
            title="Decline"
            variant="inactive"
            onPress={() =>
              updateApplicationStatus(Number(id), Number(jobId), "Declined")
            }
            style={styles.actionButton}
          />
        </View>
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
    marginTop: 6,
    lineHeight: 19,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.small,
    marginTop: theme.spacing.medium,
  },
  statusLabel: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
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
    gap: theme.spacing.medium,
  },
  actionButton: {
    flex: 1,
  },
});
