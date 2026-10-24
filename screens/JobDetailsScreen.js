import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { ChevronLeft } from "lucide-react-native";

import { PrimaryButton } from "../components/PrimaryButton";
import JobDetailsCard from "../components/JobDetailsCard";

import { work } from "../data/jobs";
import theme from "../styles/theme";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  const job = work.find((item) => item.id === Number(id));

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

          <Text>
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

          <Text>
            {job.salary != null
              ? `₱${job.salary}`
              : "Salary not specified."}
          </Text>
        </View>

        <PrimaryButton title="SUBMIT APPLICATION" />
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