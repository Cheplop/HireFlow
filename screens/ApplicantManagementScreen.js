import { Menu, Search, Users } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ApplicantCard from "@/components/employer/ApplicantCard";
import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import ProfileMenu from "../components/profile/ProfileMenu";
import { useAuth } from "../contexts/AuthContext";
import { useApplicants } from "../contexts/ApplicantsContext";
import { useJobs } from "../contexts/JobsContext";
import { PHOTO_STORAGE_KEY } from "../data/ProfileScreen.data";
import theme from "../styles/theme";

const jobModes = ["All", "Full-time", "Part-time", "Contractual"];

function getSearchableNames(applicant) {
  const first = applicant?.firstName?.trim();
  const last = applicant?.lastName?.trim();
  const fullName = applicant?.name?.trim();
  const candidates = new Set();

  if (fullName) {
    candidates.add(fullName);
  }
  if (first || last) {
    candidates.add([first, last].filter(Boolean).join(" "));
    if (last && first) {
      candidates.add(`${last}, ${first}`);
      candidates.add(`${last} ${first}`);
    }
  }
  if (fullName) {
    const parts = fullName.split(/\s+/);
    if (parts.length > 1) {
      const lastName = parts.pop();
      const firstName = parts.join(" ");
      candidates.add(`${lastName}, ${firstName}`);
      candidates.add(`${lastName} ${firstName}`);
    }
  }

  return [...candidates];
}

export default function ApplicantManagementScreen() {
  const [search, setSearch] = useState("");
  const [selectedJobMode, setSelectedJobMode] = useState(jobModes[0]);
  const [profilePhotos, setProfilePhotos] = useState({});
  const [photoLoadError, setPhotoLoadError] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();
  const { getJobsForEmployer } = useJobs();
  const employerJobs = user?.id ? getJobsForEmployer(user.id) : [];
  const {
    getApplicantsByJob,
    hasLoadedApplications,
    loadError,
    saveError,
  } = useApplicants();

  const applications = useMemo(
    () =>
      employerJobs.flatMap((job) =>
        getApplicantsByJob(job.id, user.id).map((applicant) => ({
          ...applicant,
          jobTitle: job.jobTitle,
          jobMode: job.jobMode,
        })),
      ),
    [employerJobs, getApplicantsByJob, user?.id],
  );

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((applicant) => {
      const matchesMode =
        selectedJobMode === "All" || applicant.jobMode === selectedJobMode;

      const matchesSearch = !query || [
        ...getSearchableNames(applicant),
        applicant.jobTitle,
        applicant.education,
      ].some((value) =>
        String(value ?? "").toLowerCase().includes(query),
      );

      return matchesMode && matchesSearch;
    });
  }, [applications, search, selectedJobMode]);

  useEffect(() => {
    if (!hasLoadedApplications) return undefined;
    let active = true;
    const employeeIds = [...new Set(
      applications.map((applicant) => applicant.employeeId).filter(Boolean),
    )];

    if (!employeeIds.length) {
      setProfilePhotos({});
      setPhotoLoadError("");
      return () => { active = false; };
    }

    async function loadPhotos() {
      try {
        const savedEntries = await AsyncStorage.multiGet(
          employeeIds.map((id) => `${PHOTO_STORAGE_KEY}:${id}`),
        );
        if (!active) return;
        const photos = {};
        let hasInvalidPhotoData = false;
        savedEntries.forEach(([key, value]) => {
          if (!value) return;
          try {
            const avatarUri = JSON.parse(value)?.avatarUri;
            const employeeId = key.slice(`${PHOTO_STORAGE_KEY}:`.length);
            if (typeof avatarUri === "string") photos[employeeId] = { uri: avatarUri };
          } catch {
            hasInvalidPhotoData = true;
          }
        });
        setProfilePhotos(photos);
        setPhotoLoadError(
          hasInvalidPhotoData ? "Some applicant profile photos could not be loaded." : "",
        );
      } catch (error) {
        if (active) {
          setPhotoLoadError(
            error instanceof Error
              ? `Applicant photos could not be loaded: ${error.message}`
              : "Applicant photos could not be loaded.",
          );
        }
      }
    }

    void loadPhotos();
    return () => { active = false; };
  }, [applications, hasLoadedApplications]);

  const performLogout = async () => {
    try {
      await logout();
      router.replace("/login");
    } catch (logoutError) {
      Alert.alert(
        "Could not log out",
        logoutError instanceof Error
          ? logoutError.message
          : "Please try again.",
      );
    }
  };

  const handleLogout = () => {
    if (Platform.OS === "web") {
      if (
        typeof window !== "undefined" &&
        !window.confirm("Are you sure you want to log out?")
      ) {
        return;
      }

      void performLogout();
      return;
    }

    Alert.alert("Log out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: () => void performLogout(),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.searchRow}>
        <AuthInput
          placeholder="Search keywords here..."
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          style={styles.searchInput}
          inputStyle={styles.searchInputField}
          rightIcon={<Search size={20} color={theme.fontColor.primary} />}
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={() => setIsMenuVisible(true)}
          style={styles.menuButton}
        >
          <Menu size={24} color={theme.fontColor.primary} />
        </Pressable>
      </View>

      {/* Job Type Filters & Logout */}
      <View style={styles.toolbarRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filters}
        >
          {jobModes.map((mode) => (
            <PrimaryButton
              key={mode}
              title={mode}
              variant={selectedJobMode === mode ? "active" : "inactive"}
              onPress={() => setSelectedJobMode(mode)}
              style={styles.filterButton}
            />
          ))}
        </ScrollView>

      </View>

      {/* Applicant List */}
      <FlatList
        data={hasLoadedApplications ? filteredApplicants : []}
        style={styles.applicantList}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <ApplicantCard
            applicant={item}
            jobId={item.jobId}
            status={item.status}
            avatarSource={profilePhotos[item.employeeId] ?? item.avatar}
          />
        )}
        ListHeaderComponent={
          loadError || saveError || photoLoadError ? (
            <Text style={styles.errorText}>
              {[loadError, saveError, photoLoadError].filter(Boolean).join("\n")}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          !hasLoadedApplications ? <View style={styles.emptyState}>
            <ActivityIndicator color={theme.colors.primary} />
            <Text style={styles.emptyText}>Loading applications…</Text>
          </View> : <View style={styles.emptyState}>
            <Users size={40} color={theme.fontColor.secondary} />

            <Text style={styles.emptyTitle}>
              {employerJobs.length
                ? applications.length
                  ? "No applications found"
                  : "No applications yet"
                : "No jobs yet"}
            </Text>

            <Text style={styles.emptyText}>
              {employerJobs.length
                ? applications.length
                  ? "Try another job type or search term."
                  : "Applicants will appear here when they apply to your listings."
                : "Applicants will appear here when they apply to your listings."}
            </Text>
          </View>
        }
      />

      <ProfileMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNotifications={() => {
          setIsMenuVisible(false);
          router.push("/notifications");
        }}
        onLogout={handleLogout}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 20,
  },

  toolbarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingBottom: theme.spacing.medium,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 12,
    marginBottom: theme.spacing.medium,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchInputField: {
    height: 44,
    paddingVertical: 0,
    paddingRight: 42,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    backgroundColor: theme.colors.cardBackground,
    fontSize: theme.fontSize.xsmall,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  menuButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 22,
    backgroundColor: theme.colors.cardBackground,
    flexShrink: 0,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },

  filterScroll: {
    flex: 1,
    flexGrow: 1,
    flexShrink: 1,
  },

  filters: {
    gap: 8,
  },

  filterButton: {
    width: "auto",
    minWidth: 84,
    height: 34,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
    borderColor: theme.colors.border,
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    height: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    backgroundColor: theme.actions?.deleteBg ?? "#FDECEC",
    flexShrink: 0,
  },

  logoutButtonPressed: {
    opacity: 0.85,
  },

  logoutText: {
    color: theme.actions?.deletePrimary ?? "#B3261E",
    fontSize: theme.fontSize.xsmall,
    fontWeight: theme.fontWeight?.semibold ?? "600",
  },

  applicantList: {
    flex: 1,
  },

  cards: {
    gap: 12,
    paddingBottom: 110,
    paddingHorizontal: 2,
    paddingTop: 2,
    flexGrow: 1,
  },

  emptyState: {
    alignItems: "center",
    gap: theme.spacing.small,
    paddingHorizontal: theme.spacing.large,
    paddingTop: 72,
  },

  emptyTitle: {
    color: theme.fontColor.primary,
    fontWeight: "700",
    fontSize: theme.fontSize.large,
    textAlign: "center",
  },

  emptyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 19,
    textAlign: "center",
  },
  errorText: {
    color: theme.actions?.deletePrimary ?? "#B3261E",
    fontSize: theme.fontSize.small,
    paddingVertical: theme.spacing.small,
  },
});
