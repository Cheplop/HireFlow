import { router } from "expo-router";
import { Bell, Search } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthInput } from "@/components/common/AuthInput";
import { PrimaryButton } from "@/components/common/PrimaryButton";
import { ApplyCard } from "@/components/employee/ApplyCard";
import { useAuth } from "../contexts/AuthContext";
import { useJobs } from "../contexts/JobsContext";
import { useNotifications } from "../contexts/NotificationsContext";
import theme from "../styles/theme";

const employmentTypes = ["All", "Full-time", "Part-time", "Contractual"];

function normalizeType(type) {
  return type.toLowerCase().replace(/[\s-]/g, "");
}

export default function HomeScreen() {
  const { user } = useAuth();
  const { jobs, getJobsForEmployer } = useJobs();
  const { getUnreadCount } = useNotifications();
  const isEmployer = user?.role === "employer";
  const unreadCount = user ? getUnreadCount(user.id) : 0;
  const visibleJobs = isEmployer
    ? getJobsForEmployer(user.id)
    : jobs.filter((job) => job.isPublished);
  const [selectedType, setSelectedType] = useState("All");
  const [search, setSearch] = useState("");

  const filteredJobs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return visibleJobs.filter((job) => {
      const matchesType =
        selectedType === "All" ||
        normalizeType(job.jobMode) === normalizeType(selectedType);
      const searchableText = [
        job.jobTitle,
        job.jobCompany,
        job.jobLocation,
        job.jobDescription,
      ]
        .join(" ")
        .toLowerCase();

      return matchesType && (!query || searchableText.includes(query));
    });
  }, [search, selectedType, visibleJobs]);

  return (
    <SafeAreaView style={styles.safeAreaView} edges={["top"]}>
      <View style={styles.headerContainer}>
        <View style={styles.search}>
          <AuthInput
            placeholder="Search jobs..."
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
          style={styles.notification}
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

      <View style={styles.filterWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.worktypeContainer}
        >
          {employmentTypes.map((type) => (
            <PrimaryButton
              key={type}
              title={type}
              variant={selectedType === type ? "active" : "inactive"}
              onPress={() => setSelectedType(type)}
              style={styles.filterButton}
            />
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredJobs}
        style={styles.jobList}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ApplyCard
            cardLogo={item.companyLogo}
            cardTitle={item.jobTitle}
            cardCompany={item.jobCompany}
            cardLocation={item.jobLocation}
            cardMode={`${item.jobMode} · ${item.jobType}`}
            cardDescription={item.jobDescription}
            actionTitle={isEmployer ? "View" : "Apply"}
            onApply={() => router.push(`/jobDetails/${item.id}`)}
          />
        )}
        keyExtractor={(item) => String(item.id)}
        ListEmptyComponent={
          <Text style={styles.emptyState}>
            No jobs match your search. Try another keyword or filter.
          </Text>
        }
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
  notification: {
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
  jobList: {
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
    color: theme.fontColor.secondary,
    textAlign: "center",
    padding: theme.spacing.large,
    marginTop: theme.spacing.medium,
  },
});
