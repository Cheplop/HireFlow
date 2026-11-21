import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Bell, Menu, Search, Users } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import ApplicantCard from "@/components/employer/ApplicantCard";
import ProfileMenu from "../components/profile/ProfileMenu";
import { useApplicants } from "../contexts/ApplicantsContext";
import { useAuth } from "../contexts/AuthContext";
import { useJobs } from "../contexts/JobsContext";
import { useNotifications } from "../contexts/NotificationsContext";
import { PHOTO_STORAGE_KEY } from "../data/ProfileScreen.data";
import theme from "../styles/theme";

const jobModes = ["All", "Full-time", "Part-time", "Contractual"];

export default function ApplicantManagementScreen() {
  const [search, setSearch] = useState("");
  const [selectedJobMode, setSelectedJobMode] = useState(jobModes[0]);
  const [profilePhotos, setProfilePhotos] = useState({});
  const [photoLoadError, setPhotoLoadError] = useState("");
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const { user, logout } = useAuth();
  const router = useRouter();
  const { getJobsForEmployer } = useJobs();
  const { getUnreadCount } = useNotifications();
  const unreadCount = user ? getUnreadCount(user.id) : 0;
  const employerJobs = user?.id ? getJobsForEmployer(user.id) : [];
  const {
    getApplicantsByJob,
    hasLoadedApplications,
    loadError,
    saveError,
  } = useApplicants();

  const applications = employerJobs.flatMap((job) =>
    getApplicantsByJob(job.id, user?.id).map((applicant) => ({
      ...applicant,
      jobTitle: job.jobTitle,
      jobMode: job.jobMode,
    })),
  );

  const filteredApplicants = useMemo(() => {
    const query = search.trim().toLowerCase();

    return applications.filter((applicant) => {
      const matchesMode =
        selectedJobMode === "All" || applicant.jobMode === selectedJobMode;

      const matchesSearch = [
        applicant.name,
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
    const employeeIds = [
      ...new Set(
        applications.map((applicant) => applicant.employeeId).filter(Boolean),
      ),
    ];

    async function loadPhotos() {
      if (!employeeIds.length) {
        if (active) {
          setProfilePhotos({});
          setPhotoLoadError("");
        }
        return;
      }

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
          hasInvalidPhotoData
            ? "Some applicant profile photos could not be loaded."
            : "",
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
    return () => {
      active = false;
    };
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
    setIsMenuVisible(false);

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
      {/* Home-style Search + Notification Bell + Triple-line Menu */}
      <View style={styles.headerContainer}>
        <View style={styles.search}>
          <AuthInput
            placeholder="Search applicants..."
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            icon={<Search size={20} color="#abb0b7" />}
          />
        </View>

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

        <Pressable
          accessibilityLabel="Open menu"
          accessibilityRole="button"
          onPress={() => setIsMenuVisible(true)}
          style={styles.circleButton}
        >
          <Menu size={20} color={theme.fontColor.primary} />
        </Pressable>
      </View>

      {/* Home-style Job Type Filters */}
      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.worktypeContainer}
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
              {[loadError, saveError, photoLoadError]
                .filter(Boolean)
                .join("\n")}
            </Text>
          ) : null
        }
        ListEmptyComponent={
          !hasLoadedApplications ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={theme.colors.primary} />
              <Text style={styles.emptyText}>Loading applications…</Text>
            </View>
          ) : (
            <View style={styles.emptyState}>
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
          )
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
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: theme.spacing.small,
    width: "100%",
    paddingHorizontal: 22,
  },
  search: {
    flex: 1,
    height: 55,
  },
  circleButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 48,
    height: 48,
    padding: 0,
    marginTop: 1,
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
  filterWrapper: {
    marginTop: theme.spacing.small,
  },
  worktypeContainer: {
    gap: theme.spacing.small,
    paddingHorizontal: 22,
    paddingBottom: theme.spacing.small,
  },
  filterButton: {
    width: "auto",
    minWidth: 78,
    height: 36,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 17,
    borderColor: theme.colors.border,
  },
  applicantList: {
    flex: 1,
  },
  cards: {
    gap: 12,
    paddingBottom: 130,
    paddingHorizontal: 22,
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
    color: theme.actions.deletePrimary,
    fontSize: theme.fontSize.small,
    paddingVertical: theme.spacing.small,
  },
});