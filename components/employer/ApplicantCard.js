import { useRouter } from "expo-router";
import { ChevronRight, GraduationCap } from "lucide-react-native";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../../styles/theme";
import StatusCard from "../common/StatusCard";

export default function ApplicantCard({ applicant, jobId, status }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/applicants/${applicant.id}?jobId=${jobId}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={applicant.avatar}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.applyingFor} numberOfLines={1}>
          <Text style={styles.applyingForLabel}>Applying for: </Text>
          <Text style={styles.applyingForTitle}>{applicant.jobTitle}</Text>
        </Text>
        <Text style={styles.cardTitle} numberOfLines={1}>
          {applicant.name}
        </Text>
        <View style={styles.educationRow}>
          <GraduationCap size={16} color={theme.fontColor.primary} />
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {applicant.education || "Education not added"}
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <ChevronRight
          size={16}
          color={theme.fontColor.secondary}
          style={styles.chevron}
        />
        <StatusCard status={status} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 88,
    padding: 12,
    borderRadius: 22,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.cardBackground,
    borderWidth: 1,
    borderColor: "#F0F1F4",
    // Cross-platform shadow (replaces CSS-only boxShadow)
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      default: {
        boxShadow: theme.boxShadow?.default,
      },
    }),
  },
  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 44,
    height: 44,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
    minWidth: 0,
    gap: 4,
  },
  applyingFor: {
    fontSize: 11,
  },
  applyingForLabel: {
    color: theme.fontColor.secondary,
  },
  applyingForTitle: {
    color: theme.fontColor.primary,
  },
  educationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semibold,
    color: theme.fontColor.secondary,
  },
  cardSubtitle: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },
  rightSection: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    alignSelf: "stretch",
  },
  chevron: {
    position: "absolute",
    top: 0,
    right: -2,
  },
});