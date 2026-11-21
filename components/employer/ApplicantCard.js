import { useRouter } from "expo-router";
import { Briefcase, GraduationCap } from "lucide-react-native";
import { Image, StyleSheet, Text, View } from "react-native";

import theme from "../../styles/theme";
import { PrimaryButton } from "../common/PrimaryButton";
import StatusCard from "../common/StatusCard";

export default function ApplicantCard({ applicant, jobId, status, avatarSource }) {
  const router = useRouter();
  const image = avatarSource || applicant.avatar;
  const source =
    typeof image === "string"
      ? { uri: image }
      : image || require("../../assets/images/Hireflow.png");

  const handleOpenApplicant = () => {
    router.push(`/applicants/${applicant.id}?jobId=${jobId}`);
  };

  return (
    <View style={styles.card}>
      <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <Image source={source} style={styles.image} resizeMode="cover" />
        </View>

        <View style={styles.cardContent}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {applicant.name || "Applicant"}
          </Text>

          <Text style={styles.cardCompany} numberOfLines={1}>
            {applicant.jobTitle}
          </Text>

          <View style={styles.metaRow}>
            <GraduationCap size={14} color={theme.fontColor.secondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {applicant.education || "Education not added"}
            </Text>
          </View>

          {applicant.jobMode ? (
            <View style={styles.metaRow}>
              <Briefcase size={14} color={theme.fontColor.secondary} />
              <Text style={styles.metaText} numberOfLines={1}>
                {applicant.jobMode}
              </Text>
            </View>
          ) : null}

          {applicant.about ? (
            <View style={styles.cardDescriptionContainer}>
              <Text
                style={styles.cardDescription}
                numberOfLines={2}
                ellipsizeMode="tail"
              >
                {applicant.about}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <StatusCard status={status} />
        <PrimaryButton
          title="View"
          style={styles.primaryButton}
          onPress={handleOpenApplicant}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    alignSelf: "stretch",
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
    boxShadow: theme.boxShadow.default,
  },

  wrapper: {
    flexDirection: "row",
    gap: theme.spacing.medium,
    padding: 10,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.radius.large,
  },

  imageContainer: {
    backgroundColor: theme.colors.cardBackground,
    width: 64,
    height: 64,
    borderRadius: 12,
    boxShadow: theme.boxShadow.default,
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
    alignSelf: "flex-start",
  },

  cardTitle: {
    fontSize: theme.fontSize.medium,
    fontWeight: "bold",
    color: theme.fontColor.primary,
    marginBottom: 2,
  },

  cardCompany: {
    fontSize: theme.fontSize.small,
    color: theme.fontColor.primary,
    marginBottom: 5,
  },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },

  metaText: {
    flex: 1,
    fontSize: theme.fontSize.small,
    color: theme.fontColor.secondary,
  },

  cardDescriptionContainer: {
    width: "100%",
  },

  cardDescription: {
    fontSize: 11,
    lineHeight: 15,
    color: theme.fontColor.secondary,
    fontWeight: theme.fontWeight.muted,
  },

  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: theme.spacing.small,
    paddingHorizontal: 8,
    paddingBottom: 8,
  },

  primaryButton: {
    width: 75,
    height: 28,
    paddingVertical: 4,
  },
});