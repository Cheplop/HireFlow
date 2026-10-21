import { StyleSheet, View, Text, Image } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import theme from "../styles/theme";

export default function JobDetailsCard({
  jobMode,
  jobType,
  jobTitle,
  companyLogo,
  company
}) {
  return (
    <View>
      <View style={styles.card}>
        <View style={styles.worksettingContainer}>
          <View style={styles.workSetting}>
            <Text>{jobMode}</Text>
            <Text>{jobType}</Text>
          </View>

          <View style={styles.fav}>
            <Ionicons
              name="bookmark-outline"
              size={24}
              color="black"
            />
          </View>
        </View>

        <View style={styles.company}>
          <Image
            source={companyLogo}
            style={styles.image}
            resizeMode="contain"
          />

          <Text style={styles.jobTitle}>{jobTitle}</Text>
          <Text>{company}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 350,
    height: 225,
    padding: theme.spacing.small,
    gap: theme.spacing.small,
    borderRadius: theme.radius.medium,
    boxShadow: theme.boxShadow.default,
  },

  worksettingContainer: {
    width: "100%",
    padding: theme.spacing.medium,
    justifyContent: "space-between",
    flexDirection: "row",
    gap: theme.spacing.medium,
  },

  workSetting: {
    flexDirection: "row",
    gap: theme.spacing.medium,
  },

  fav: {
    alignItems: "flex-start",
  },

  company: {
    alignItems: "center",
    gap: theme.spacing.small,
  },

  jobTitle: {
    fontSize: theme.fontSize.large,
    fontWeight: theme.fontWeight.bold,
  },

  image: {
    width: 50,
    height: 50,
    marginBottom: theme.spacing.small,
  },
});