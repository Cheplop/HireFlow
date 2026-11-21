import { useRouter } from "expo-router";
import { ChevronRight, GraduationCap } from "lucide-react-native";
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import theme from "../../styles/theme";
import StatusCard from "../common/StatusCard";
import { getHighestEducationInstitution, loadSavedProfile } from "../../data/profileStorage";

function formatLastFirstName(applicant) {
  const first = applicant?.firstName?.trim();
  const last = applicant?.lastName?.trim();

  if (last && first) {
    return `${first} ${last}`;
  }
  if (last || first) {
    return last || first;
  }

  const fullName = applicant?.name?.trim();
  if (!fullName) {
    return "Applicant";
  }

  const parts = fullName.split(/\s+/);
  if (parts.length === 1) {
    return parts[0];
  }

  const lastName = parts.pop();
  const firstName = parts.join(" ");
  return `${firstName} ${lastName}`;
}

export default function ApplicantCard({ applicant, jobId, status, avatarSource }) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(formatLastFirstName(applicant));
  const [highestEducation, setHighestEducation] = useState(
    getHighestEducationInstitution(applicant.education),
  );
  const image = avatarSource || applicant.avatar;
  const source = typeof image === "string"
    ? { uri: image }
    : image || require("../../assets/images/Hireflow.png");

  useEffect(() => {
    let active = true;

    if (!applicant.employeeId) return () => { active = false; };

    loadSavedProfile(applicant.employeeId).then((savedProfile) => {
      if (!active) return;
      const firstName = savedProfile?.firstName?.trim() || savedProfile?.profile?.firstName?.trim();
      const lastName = savedProfile?.lastName?.trim() || savedProfile?.profile?.lastName?.trim();
      if (firstName || lastName) {
        setDisplayName([firstName, lastName].filter(Boolean).join(" "));
      } else if (savedProfile?.profile?.name?.trim()) {
        setDisplayName(savedProfile.profile.name.trim());
      }
      setHighestEducation(
        getHighestEducationInstitution(savedProfile?.education) ||
          getHighestEducationInstitution(applicant.education),
      );
    });

    return () => { active = false; };
  }, [applicant.employeeId, applicant.education]);

  return (
    <TouchableOpacity
      accessibilityRole="button"
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => router.push(`/applicants/${applicant.id}?jobId=${jobId}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={source}
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
          {displayName}
        </Text>
        <View style={styles.educationRow}>
          <GraduationCap size={16} color={theme.fontColor.primary} />
          <Text style={styles.cardSubtitle} numberOfLines={1}>
            {highestEducation || "Education not added"}
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
  appliedDate: {
    color: theme.fontColor.secondary,
    fontSize: 11,
  },
  rightSection: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    gap: 12,
    alignSelf: "stretch",
  },
  chevron: {
    flexShrink: 0,
  },
});
