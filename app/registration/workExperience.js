import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Check, ChevronLeft, Plus } from "lucide-react-native";

import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import EmployeeOnly from "../../components/EmployeeOnly";
import { useAuth } from "../../contexts/AuthContext";
import {
  formatDateRange,
  monthYearValue,
  parseMonthYear,
} from "../../data/dateFormat";
import { makeId } from "../../data/ProfileScreen.data";
import { saveProfileData } from "../../data/profileStorage";
import theme from "../../styles/theme";

const newJob = () => ({
  key: makeId("job"),
  position: "",
  company: "",
  startDate: "",
  endDate: "",
  isCurrent: false,
  error: "",
});

const isBlank = (job) =>
  !job.position.trim() && !job.company.trim() && !job.startDate.trim() && !job.endDate.trim();

// Returns an error message for one job, or "" when it is fine.
function validateJob(job) {
  if (!job.position.trim()) return "Enter the position for this job.";
  if (!job.company.trim()) return "Enter the company for this job.";

  const start = parseMonthYear(job.startDate);
  if (!start) return "Enter a valid start date (MM/YYYY).";
  if (job.isCurrent) return "";

  const end = parseMonthYear(job.endDate);
  if (!end) return "Enter a valid end date (MM/YYYY), or tick \"I currently work here\".";
  if (monthYearValue(end) < monthYearValue(start)) return "The end date can't be before the start date.";

  return "";
}

function WorkExperience() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState(() => [newJob()]);

  const updateJob = (key, patch) =>
    setJobs((list) =>
      list.map((job) => (job.key === key ? { ...job, ...patch, error: "" } : job)),
    );

  const handleNext = async () => {
    // Untouched blocks are ignored, so this step can simply be skipped.
    const filled = jobs.filter((job) => !isBlank(job));
    const checked = jobs.map((job) =>
      isBlank(job) ? job : { ...job, error: validateJob(job) },
    );

    if (checked.some((job) => job.error)) {
      setJobs(checked);
      return;
    }

    const experience = filled.map((job) => ({
      id: makeId("exp"),
      title: job.position.trim(),
      subtitle: job.company.trim(),
      date: formatDateRange(
        parseMonthYear(job.startDate),
        job.isCurrent ? null : parseMonthYear(job.endDate),
        job.isCurrent,
      ),
      details: ["", ""],
      description: "",
    }));

    await saveProfileData(user?.id, { experience });
    router.push("/registration/setupProfile");
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <ChevronLeft size={30} color="black" style={styles.back} onPress={() => router.back()} />
            <Text style={styles.title}>Work Experience</Text>
            <Text style={styles.subtitle}>Any work experience to add to your resume</Text>
          </View>

          {jobs.map((job, index) => (
            <View key={job.key}>
              {jobs.length > 1 ? (
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>Job {index + 1}</Text>
                  <Pressable
                    onPress={() => setJobs((list) => list.filter((item) => item.key !== job.key))}
                    hitSlop={8}
                  >
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
              ) : null}

              <AuthInput
                label="Company"
                placeholder="Ex: Meta"
                value={job.company}
                onChangeText={(text) => updateJob(job.key, { company: text })}
              />
              <AuthInput
                label="Position"
                placeholder="Ex: Senior UX Designer"
                value={job.position}
                onChangeText={(text) => updateJob(job.key, { position: text })}
              />

              <View style={styles.dateRow}>
                <AuthInput
                  style={styles.dateInput}
                  label="Started"
                  placeholder="MM/YYYY"
                  keyboardType="numbers-and-punctuation"
                  maxLength={7}
                  value={job.startDate}
                  onChangeText={(text) => updateJob(job.key, { startDate: text })}
                />
                <AuthInput
                  style={styles.dateInput}
                  label="Ended"
                  placeholder={job.isCurrent ? "Present" : "MM/YYYY"}
                  keyboardType="numbers-and-punctuation"
                  maxLength={7}
                  editable={!job.isCurrent}
                  value={job.isCurrent ? "" : job.endDate}
                  onChangeText={(text) => updateJob(job.key, { endDate: text })}
                />
              </View>

              <Pressable
                style={styles.currentRow}
                onPress={() => updateJob(job.key, { isCurrent: !job.isCurrent, endDate: "" })}
                accessibilityRole="checkbox"
                accessibilityState={{ checked: job.isCurrent }}
              >
                <View style={[styles.checkbox, job.isCurrent && styles.checkboxOn]}>
                  {job.isCurrent ? <Check size={12} color={theme.fontColor.dark} /> : null}
                </View>
                <Text style={styles.currentText}>I currently work here</Text>
              </Pressable>

              {job.error ? <Text style={styles.error}>{job.error}</Text> : null}
            </View>
          ))}

          <Pressable style={styles.addButton} onPress={() => setJobs((list) => [...list, newJob()])}>
            <Plus size={14} color={theme.actions.editPrimary} />
            <Text style={styles.addText}>Add another work experience</Text>
          </Pressable>

          <PrimaryButton title="NEXT" onPress={handleNext} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function WorkExperienceRoute() {
  return (
    <EmployeeOnly>
      <WorkExperience />
    </EmployeeOnly>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  card: { backgroundColor: theme.colors.cardBackground, padding: 22 },
  header: { marginBottom: 18 },
  back: { marginBottom: 20 },
  title: {
    color: theme.colors.title,
    fontSize: theme.fontSize.title,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.subtitle,
    fontSize: theme.fontSize.medium,
    lineHeight: 22,
  },
  entryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.small,
  },
  entryTitle: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
  },
  remove: {
    color: theme.actions.deletePrimary,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
  },
  dateRow: { flexDirection: "row", gap: 12 },
  dateInput: { flex: 1 },
  currentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.small,
    marginBottom: theme.spacing.medium,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.cardBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxOn: { backgroundColor: theme.colors.primary },
  currentText: { color: theme.fontColor.primary, fontSize: theme.fontSize.small + 1 },
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    marginBottom: theme.spacing.medium,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: theme.spacing.large,
    borderRadius: theme.radius.large,
    backgroundColor: theme.actions.editBg,
  },
  addText: {
    color: theme.actions.editPrimary,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
  },
});