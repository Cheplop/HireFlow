import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import JobDetailsCard from "../components/JobDetailsCard";
import StatusCard from "../components/StatusCard";
import { useApplications } from "../contexts/ApplicationsContext";

import { work } from "../data/jobs";
import theme from "../styles/theme";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const job = work.find((item) => item.id === Number(id));
  const { applyForJob, getApplication } = useApplications();
  const application = job ? getApplication(job.id) : null;

  if (!job) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Job not found.</Text>

        <PrimaryButton
          title="GO BACK"
          onPress={() => router.back()}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.back}>
          <ChevronLeft
            size={30}
            color="black"
            onPress={() => router.back()}
          />
        </View>

        <Text style={styles.jobDetails}>Job Details</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Job Card */}
        <JobDetailsCard
          jobMode={job.jobMode}
          jobType={job.jobType}
          jobTitle={job.jobTitle}
          companyLogo={job.companyLogo}
          company={job.jobCompany}
        />

        {/* Job Description */}
        <View style={styles.detailsContainer}>
          <Text style={styles.subHeading}>
            Job Description
          </Text>

          <Text style={styles.bodyText}>
            {job.jobDescription || "No job description available."}
          </Text>

          <Text style={styles.subHeading}>
            Responsibilities
          </Text>

          {job.responsibilities && job.responsibilities.length > 0 ? (
            job.responsibilities.map((item, index) => (
              <View key={index} style={styles.bulletRow}>
                <Text style={styles.bulletIcon}>•</Text>
                <Text style={styles.bulletText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.fallbackText}>No responsibilities specified.</Text>
          )}

          <Text style={styles.subHeading}>
            Salary Information
          </Text>

          <Text style={styles.bodyText}>
            {job.salary != null
              ? `₱${job.salary.toLocaleString()}`
              : "Salary not specified."}
          </Text>

          <Text style={styles.subHeading}>About {job.jobCompany}</Text>
          <Text style={styles.bodyText}>
            {job.companyDescription || `${job.jobCompany} is hiring for this opportunity.`}
          </Text>
        </View>

        {application ? (
          <View style={styles.applicationState}>
            <Text style={styles.applicationMessage}>You have applied for this role.</Text>
            <StatusCard status={application.status} />
            <PrimaryButton
              title="VIEW APPLICATIONS"
              onPress={() => router.push('/(tabs)/applications')}
            />
          </View>
        ) : (
          <PrimaryButton
            title="SUBMIT APPLICATION"
            onPress={() => applyForJob(job.id)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 22,
    backgroundColor: theme.colors.background,
  },

  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.medium,
  },

  back: {
    width: "40%",
  },

  jobDetails: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.normal,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    alignItems: "center",
    gap: theme.spacing.medium,
    paddingBottom: theme.spacing.large,
  },

  detailsContainer: {
    width: "100%",
    gap: theme.spacing.medium,
  },

  subHeading: {
    fontSize: theme.fontSize.large,
    fontWeight: "700",
    color: theme.fontColor.primary,
  },

  bodyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.medium,
    lineHeight: 23,
  },

  applicationState: {
    width: "100%",
    alignItems: "center",
    gap: theme.spacing.small,
  },

  applicationMessage: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.medium,
  },

  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.small,
  },

  bulletIcon: {
    fontSize: theme.fontSize.large,
    lineHeight: 24,
    color: theme.colors.text,
  },

  bulletText: {
    flex: 1,
    fontSize: theme.fontSize.regular,
    lineHeight: 24,
    color: theme.colors.text,
  },

  fallbackText: {
    color: theme.colors.subtext || "#666",
  },
});