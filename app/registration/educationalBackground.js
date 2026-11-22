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
import { makeId } from "../../data/ProfileScreen.data";
import { saveProfileData } from "../../data/profileStorage";
import theme from "../../styles/theme";

const THIS_YEAR = new Date().getFullYear();

const newTertiary = () => ({
  key: makeId("tertiary"),
  institution: "",
  degree: "",
  start: "",
  end: "",
  isCurrent: false,
});
const newOther = () => ({ key: makeId("other"), name: "", details: "", start: "", end: "" });
const newSchool = () => ({ name: "", start: "", end: "" });

// Returns an error message for a start/end year pair, or "" when it is fine.
// Leaving both blank is allowed.
function checkYears(start, end, isCurrent, label) {
  const s = start.trim();
  const e = end.trim();
  if (!s && !e && !isCurrent) return "";

  if (!/^\d{4}$/.test(s) || Number(s) < 1950 || Number(s) > THIS_YEAR) {
    return `Enter a valid start year (YYYY) for ${label}.`;
  }
  if (isCurrent) return "";
  if (!/^\d{4}$/.test(e) || Number(e) < 1950 || Number(e) > THIS_YEAR + 10) {
    return `Enter a valid end year (YYYY) for ${label}.`;
  }
  if (Number(e) < Number(s)) return `The end year can't be before the start year for ${label}.`;
  return "";
}

// "2018 – 2022", "2020 – Present", or "" when no years were given.
const yearsText = (start, end, isCurrent) =>
  start.trim() ? `${start.trim()} – ${isCurrent ? "Present" : end.trim()}` : "";

function EducationalBackground() {
  const { user } = useAuth();
  // Tertiary always has one block, so double-degree holders can add more.
  const [tertiary, setTertiary] = useState(() => [newTertiary()]);
  const [highSchool, setHighSchool] = useState(newSchool);
  const [elementary, setElementary] = useState(newSchool);
  // "Others" starts empty: vocational courses, senior high track, short programs...
  const [others, setOthers] = useState([]);
  const [error, setError] = useState("");

  const patchItem = (setList) => (key, patch) => {
    setError("");
    setList((list) => list.map((item) => (item.key === key ? { ...item, ...patch } : item)));
  };
  const patchSchool = (setSchool) => (patch) => {
    setError("");
    setSchool((school) => ({ ...school, ...patch }));
  };
  const removeItem = (setList, key) =>
    setList((list) => list.filter((item) => item.key !== key));

  const patchTertiary = patchItem(setTertiary);
  const patchOther = patchItem(setOthers);
  const patchHighSchool = patchSchool(setHighSchool);
  const patchElementary = patchSchool(setElementary);

  const handleNext = async () => {
    // A block that has details but no school/title can't be shown on the profile.
    if (tertiary.some((t) => (t.degree.trim() || t.start.trim()) && !t.institution.trim())) {
      setError("Enter the school name for each degree you added.");
      return;
    }
    if (others.some((o) => (o.details.trim() || o.start.trim()) && !o.name.trim())) {
      setError("Enter a name for each item under Others.");
      return;
    }

    const yearError =
      tertiary
        .map((t, i) => checkYears(t.start, t.end, t.isCurrent, `Degree ${i + 1}`))
        .find(Boolean) ||
      checkYears(highSchool.start, highSchool.end, false, "High School") ||
      checkYears(elementary.start, elementary.end, false, "Elementary") ||
      others
        .map((o, i) => checkYears(o.start, o.end, false, `Other ${i + 1}`))
        .find(Boolean);

    if (yearError) {
      setError(yearError);
      return;
    }

    const entries = tertiary
      .filter((t) => t.institution.trim())
      .map((t) => ({
        id: makeId("edu-tertiary"),
        group: "Tertiary",
        title: t.institution.trim(),
        subtitle: t.degree.trim(),
        date: yearsText(t.start, t.end, t.isCurrent),
      }));

    if (highSchool.name.trim()) {
      entries.push({
        id: makeId("edu-secondary"),
        group: "Secondary",
        title: highSchool.name.trim(),
        subtitle: "High School",
        date: yearsText(highSchool.start, highSchool.end, false),
      });
    }
    if (elementary.name.trim()) {
      entries.push({
        id: makeId("edu-primary"),
        group: "Primary",
        title: elementary.name.trim(),
        subtitle: "Elementary Education",
        date: yearsText(elementary.start, elementary.end, false),
      });
    }
    others
      .filter((o) => o.name.trim())
      .forEach((o) =>
        entries.push({
          id: makeId("edu-other"),
          group: "Other",
          title: o.name.trim(),
          subtitle: o.details.trim(),
          date: yearsText(o.start, o.end, false),
        }),
      );

    await saveProfileData(user?.id, { education: entries });
    router.push("/registration/workExperience");
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
            <Text style={styles.title}>Educational Background</Text>
            <Text style={styles.subtitle}>A quick background from your alma mater</Text>
          </View>

          <Text style={styles.section}>Tertiary</Text>
          {tertiary.map((entry, index) => (
            <View key={entry.key}>
              {tertiary.length > 1 ? (
                <View style={styles.entryHeader}>
                  <Text style={styles.entryTitle}>Degree {index + 1}</Text>
                  <Pressable onPress={() => removeItem(setTertiary, entry.key)} hitSlop={8}>
                    <Text style={styles.remove}>Remove</Text>
                  </Pressable>
                </View>
              ) : null}
              <AuthInput
                label="Institution"
                placeholder="Enter the name of your school"
                value={entry.institution}
                onChangeText={(text) => patchTertiary(entry.key, { institution: text })}
              />
              <AuthInput
                label="Degree"
                placeholder="Enter your degree here"
                value={entry.degree}
                onChangeText={(text) => patchTertiary(entry.key, { degree: text })}
              />
              <View style={styles.dateRow}>
                <AuthInput
                  style={styles.dateInput}
                  label="Started"
                  placeholder="YYYY"
                  keyboardType="numeric"
                  maxLength={4}
                  value={entry.start}
                  onChangeText={(text) => patchTertiary(entry.key, { start: text })}
                />
                <AuthInput
                  style={styles.dateInput}
                  label="Ended"
                  placeholder={entry.isCurrent ? "Present" : "YYYY"}
                  keyboardType="numeric"
                  maxLength={4}
                  editable={!entry.isCurrent}
                  value={entry.isCurrent ? "" : entry.end}
                  onChangeText={(text) => patchTertiary(entry.key, { end: text })}
                />
              </View>
              <Pressable
                style={styles.currentRow}
                onPress={() =>
                  patchTertiary(entry.key, { isCurrent: !entry.isCurrent, end: "" })
                }
                accessibilityRole="checkbox"
                accessibilityState={{ checked: entry.isCurrent }}
              >
                <View style={[styles.checkbox, entry.isCurrent && styles.checkboxOn]}>
                  {entry.isCurrent ? <Check size={12} color={theme.fontColor.dark} /> : null}
                </View>
                <Text style={styles.currentText}>I currently study here</Text>
              </Pressable>
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => setTertiary((list) => [...list, newTertiary()])}
          >
            <Plus size={14} color={theme.actions.editPrimary} />
            <Text style={styles.addText}>Add another tertiary education</Text>
          </Pressable>

          <Text style={styles.section}>High School</Text>
          <AuthInput
            label="Institution"
            placeholder="Enter the name of your school"
            value={highSchool.name}
            onChangeText={(text) => patchHighSchool({ name: text })}
          />
          <View style={styles.dateRow}>
            <AuthInput
              style={styles.dateInput}
              label="Started"
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              value={highSchool.start}
              onChangeText={(text) => patchHighSchool({ start: text })}
            />
            <AuthInput
              style={styles.dateInput}
              label="Ended"
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              value={highSchool.end}
              onChangeText={(text) => patchHighSchool({ end: text })}
            />
          </View>

          <Text style={styles.section}>Elementary</Text>
          <AuthInput
            label="Institution"
            placeholder="Enter the name of your school"
            value={elementary.name}
            onChangeText={(text) => patchElementary({ name: text })}
          />
          <View style={styles.dateRow}>
            <AuthInput
              style={styles.dateInput}
              label="Started"
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              value={elementary.start}
              onChangeText={(text) => patchElementary({ start: text })}
            />
            <AuthInput
              style={styles.dateInput}
              label="Ended"
              placeholder="YYYY"
              keyboardType="numeric"
              maxLength={4}
              value={elementary.end}
              onChangeText={(text) => patchElementary({ end: text })}
            />
          </View>

          <Text style={styles.section}>Others</Text>
          {others.map((entry, index) => (
            <View key={entry.key}>
              <View style={styles.entryHeader}>
                <Text style={styles.entryTitle}>Other {index + 1}</Text>
                <Pressable onPress={() => removeItem(setOthers, entry.key)} hitSlop={8}>
                  <Text style={styles.remove}>Remove</Text>
                </Pressable>
              </View>
              <AuthInput
                label="Name"
                placeholder="Ex: TESDA, Online course, Bootcamp"
                value={entry.name}
                onChangeText={(text) => patchOther(entry.key, { name: text })}
              />
              <AuthInput
                label="Details"
                placeholder="Ex: Welding NC II"
                value={entry.details}
                onChangeText={(text) => patchOther(entry.key, { details: text })}
              />
              <View style={styles.dateRow}>
                <AuthInput
                  style={styles.dateInput}
                  label="Started"
                  placeholder="YYYY"
                  keyboardType="numeric"
                  maxLength={4}
                  value={entry.start}
                  onChangeText={(text) => patchOther(entry.key, { start: text })}
                />
                <AuthInput
                  style={styles.dateInput}
                  label="Ended"
                  placeholder="YYYY"
                  keyboardType="numeric"
                  maxLength={4}
                  value={entry.end}
                  onChangeText={(text) => patchOther(entry.key, { end: text })}
                />
              </View>
            </View>
          ))}
          <Pressable
            style={styles.addButton}
            onPress={() => setOthers((list) => [...list, newOther()])}
          >
            <Plus size={14} color={theme.actions.editPrimary} />
            <Text style={styles.addText}>Add other education</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <PrimaryButton title="NEXT" onPress={handleNext} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function EducationalBackgroundRoute() {
  return (
    <EmployeeOnly>
      <EducationalBackground />
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
  section: {
    color: theme.colors.label,
    fontSize: theme.fontSize.medium,
    fontWeight: "600",
    marginTop: theme.spacing.small,
    marginBottom: theme.spacing.small + 4,
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
  error: {
    color: theme.colors.error,
    fontSize: theme.fontSize.small,
    textAlign: "center",
    marginBottom: theme.spacing.small + 2,
  },
});