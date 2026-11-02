import { StyleSheet, View, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApplyCard } from "@/components/ApplyCard";
import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";


import { work } from "../data/jobs";

import { User } from "lucide-react-native";

import theme from "../styles/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.headerContainer}>
        <View style={styles.search}>
          <AuthInput placeholder="Search jobs..." />
        </View>

        <View style={styles.notification} />
      </View>

      <FlatList
          data={work}
          contentContainerStyle={styles.cards}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
              <ApplyCard
                  cardLogo={item.companyLogo}
                  cardTitle={item.jobTitle}
                  cardCompany={item.jobCompany}
                  cardLocation={item.jobLocation}
                  cardDescription={item.jobDescription}
                  onApply={() => router.push(`/jobDetails/${item.id}`)}
              />
          )}
          keyExtractor={(item) => String(item.id)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
safeAreaView: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
    gap: theme.spacing.small,
},

  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.medium,
    width: "100%",
  },

cards: {
    gap: theme.spacing.medium,
    paddingBottom: 110,
    paddingHorizontal: 5,
    paddingTop: 5,
},

  search: {
    flex: 1,
    height: 55,
    borderRadius: theme.radius.large,
  },

  notification: {
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
  },

  worktypeContainer: {
    width: "100%",
    flexDirection: "row",
    gap: theme.spacing.medium,
    justifyContent: "space-between"
  },

  partTime: {
    radius: theme.spacing.large,
    width: 150,
    height: 55
  },

  fullTime: {
    width: 150,
    height: 55
  }
});
