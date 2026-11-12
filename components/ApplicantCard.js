import { useRouter } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
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
        <Text style={styles.statusLabel}>Application status</Text>
      </View>

      <View style={styles.rightSection}>
        <StatusCard status={status} />
        <ChevronRight size={18} color={theme.fontColor.secondary} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "100%",
    minHeight: 100,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.large,
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.medium,
    backgroundColor: theme.colors.cardBackground,
    boxShadow: theme.boxShadow.default,
  },
  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 56,
    height: 56,
    borderRadius: theme.radius.small,
    boxShadow: theme.boxShadow.default,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  image: {
    width: 56,
    height: 56,
  },
  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
    color: theme.fontColor.primary,
  },
  cardSubtitle: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
    marginTop: 3,
  },
  cardContent: {
    flex: 1,
    justifyContent: "center",
  },
  statusLabel: {
    color: theme.fontColor.secondary,
    fontSize: 11,
    marginTop: 7,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
  },
});
