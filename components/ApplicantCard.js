import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import theme from "../styles/theme";
import StatusCard from "./StatusCard";

export default function ApplicantCard({ applicant, jobId, status }) {
  const router = useRouter();

  return (
    <TouchableOpacity
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
        <Text style={styles.cardTitle} numberOfLines={1}>
          {applicant.name}
        </Text>
        <Text style={styles.cardSubtitle} numberOfLines={1}>
          {applicant.experience}
        </Text>
        <View style={styles.statusWrapper}>
          <StatusCard status={status} />
        </View>
      </View>

      <View style={styles.rightSection}>
        <ChevronRight size={20} color={theme.fontColor.secondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
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
    width: 56,
    height: 56,
    borderRadius: theme.radius.small,
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
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
    color: theme.fontColor.primary,
  },
  cardSubtitle: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
    marginTop: 2,
  },
  statusWrapper: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  rightSection: {
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 4,
  },
});