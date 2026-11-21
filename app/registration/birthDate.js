import { useMemo, useState } from "react";
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
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react-native";

import { PrimaryButton } from "@/components/common/PrimaryButton";
import EmployeeOnly from "../../components/EmployeeOnly";
import { useAuth } from "../../contexts/AuthContext";
import { saveProfileData } from "../../data/profileStorage";
import theme from "../../styles/theme";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];
const MIN_YEAR = 1900;
const YEARS_PER_PAGE = 12;

// Leading blanks for the weekday the month starts on, then 1..daysInMonth.
function buildMonthCells(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return [
    ...Array(firstWeekday).fill(null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
}

// "MM/DD/YYYY", the format the birthdate is saved in.
function formatBirthDate({ year, month, day }) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(month + 1)}/${pad(day)}/${year}`;
}

function BirthDateScreen() {
  const { user } = useAuth();

  const today = useMemo(() => new Date(), []);
  const maxYear = today.getFullYear();
  const maxMonth = today.getMonth();

  const [birthDate, setBirthDate] = useState(null); // { year, month (0-11), day }
  const [mode, setMode] = useState("days"); // "days" | "years"
  const [viewYear, setViewYear] = useState(maxYear);
  const [viewMonth, setViewMonth] = useState(maxMonth);

  const cells = useMemo(() => buildMonthCells(viewYear, viewMonth), [viewYear, viewMonth]);

  const yearPageStart = Math.floor(viewYear / YEARS_PER_PAGE) * YEARS_PER_PAGE;
  const years = Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i);

  const atMinMonth = viewYear <= MIN_YEAR && viewMonth === 0;
  const atMaxMonth = viewYear >= maxYear && viewMonth >= maxMonth;

  const shiftMonth = (delta) => {
    const next = new Date(viewYear, viewMonth + delta, 1);
    setViewYear(next.getFullYear());
    setViewMonth(next.getMonth());
  };

  const isFuture = (day) =>
    viewYear > maxYear ||
    (viewYear === maxYear &&
      (viewMonth > maxMonth || (viewMonth === maxMonth && day > today.getDate())));

  const isSelected = (day) =>
    birthDate &&
    birthDate.year === viewYear &&
    birthDate.month === viewMonth &&
    birthDate.day === day;

  const isToday = (day) =>
    viewYear === maxYear && viewMonth === maxMonth && day === today.getDate();

  const pickYear = (year) => {
    setViewYear(year);
    // Stay inside the allowed range when picking the current year.
    if (year === maxYear && viewMonth > maxMonth) setViewMonth(maxMonth);
    setMode("days");
  };

  const handleNext = async () => {
    // Saved as MM/DD/YYYY; empty if nothing was picked.
    await saveProfileData(user?.id, {
      birthDate: birthDate ? formatBirthDate(birthDate) : "",
    });
    router.push("/registration/educationalBackground");
  };

  const leftDisabled = mode === "days" ? atMinMonth : yearPageStart <= MIN_YEAR;
  const rightDisabled =
    mode === "days" ? atMaxMonth : yearPageStart + YEARS_PER_PAGE > maxYear;

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <ChevronLeft size={30} color="black" style={styles.back} onPress={() => router.back()} />
            <Text style={styles.title}>Birthdate</Text>
            <Text style={styles.subtitle}>Tell us when you were born.</Text>
          </View>

          {/* Calendar header: previous, "Month Year" (tap for years), next */}
          <View style={styles.calHeader}>
            <Pressable
              style={[styles.arrow, leftDisabled && styles.arrowDisabled]}
              disabled={leftDisabled}
              hitSlop={8}
              onPress={() =>
                mode === "days" ? shiftMonth(-1) : setViewYear(yearPageStart - YEARS_PER_PAGE)
              }
            >
              <ChevronLeft size={20} color={theme.colors.primary} />
            </Pressable>

            <Pressable
              style={styles.titleButton}
              onPress={() => setMode(mode === "days" ? "years" : "days")}
            >
              <Text style={styles.calTitle}>
                {mode === "days"
                  ? `${MONTHS[viewMonth]} ${viewYear}`
                  : `${years[0]} – ${years[years.length - 1]}`}
              </Text>
              <ChevronDown size={16} color={theme.fontColor.secondary} />
            </Pressable>

            <Pressable
              style={[styles.arrow, rightDisabled && styles.arrowDisabled]}
              disabled={rightDisabled}
              hitSlop={8}
              onPress={() =>
                mode === "days" ? shiftMonth(1) : setViewYear(yearPageStart + YEARS_PER_PAGE)
              }
            >
              <ChevronRight size={20} color={theme.colors.primary} />
            </Pressable>
          </View>

          {mode === "days" ? (
            <>
              <View style={styles.row}>
                {WEEKDAYS.map((label, index) => (
                  <View key={`${label}-${index}`} style={styles.cell}>
                    <Text style={styles.weekday}>{label}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.row}>
                {cells.map((day, index) => {
                  if (day === null) return <View key={`blank-${index}`} style={styles.cell} />;

                  const disabled = isFuture(day);
                  const selected = isSelected(day);

                  return (
                    <Pressable
                      key={day}
                      style={styles.cell}
                      disabled={disabled}
                      onPress={() => setBirthDate({ year: viewYear, month: viewMonth, day })}
                    >
                      <View style={[styles.day, isToday(day) && styles.dayToday, selected && styles.daySelected]}>
                        <Text
                          style={[
                            styles.dayText,
                            disabled && styles.dayTextDisabled,
                            selected && styles.dayTextSelected,
                          ]}
                        >
                          {day}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={styles.row}>
              {years.map((year) => {
                const disabled = year > maxYear || year < MIN_YEAR;
                const selected = year === viewYear;

                return (
                  <Pressable
                    key={year}
                    style={styles.yearCell}
                    disabled={disabled}
                    onPress={() => pickYear(year)}
                  >
                    <View style={[styles.year, selected && styles.daySelected]}>
                      <Text
                        style={[
                          styles.dayText,
                          disabled && styles.dayTextDisabled,
                          selected && styles.dayTextSelected,
                        ]}
                      >
                        {year}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>
          )}

          <Text style={styles.summary}>
            {birthDate
              ? `Selected: ${MONTHS[birthDate.month]} ${birthDate.day}, ${birthDate.year}`
              : "Select your birth date"}
          </Text>

          <PrimaryButton title="NEXT" onPress={handleNext} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function BirthDateRoute() {
  return (
    <EmployeeOnly>
      <BirthDateScreen />
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

  calHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.medium,
  },
  arrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.actions.editBg,
  },
  arrowDisabled: { opacity: 0.35 },
  titleButton: { flexDirection: "row", alignItems: "center", gap: 6 },
  calTitle: {
    color: theme.colors.label,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semibold,
  },
  row: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  weekday: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    fontWeight: theme.fontWeight.semibold,
  },
  day: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  dayToday: { borderWidth: 1, borderColor: theme.colors.primary },
  daySelected: { backgroundColor: theme.colors.primary },
  dayText: { color: theme.colors.label, fontSize: theme.fontSize.medium },
  dayTextDisabled: { color: theme.colors.placeholder, opacity: 0.6 },
  dayTextSelected: { color: theme.fontColor.dark, fontWeight: theme.fontWeight.semibold },
  yearCell: {
    width: "33.333%",
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  year: {
    minWidth: 72,
    paddingHorizontal: 12,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    color: theme.colors.subtitle,
    fontSize: theme.fontSize.small + 1,
    textAlign: "center",
    marginTop: theme.spacing.medium,
    marginBottom: theme.spacing.large,
  },
});