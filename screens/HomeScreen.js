import { StyleSheet, View, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApplyCard } from "@/components/ApplyCard";
import { AuthInput } from "@/components/AuthInput";

import { work } from "../data/jobs";

import { User } from "lucide-react-native";

import theme from "../styles/theme";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.headerContainer}>
        <View style={styles.search}>
          <AuthInput placeholder="Search jobs..." icon={<User size={20} />} />
        </View>

        <View style={styles.notification} />
      </View>

      <FlatList
        data={work}
        contentContainerStyle={styles.cards}
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
    flexGrow: 1,
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
  },

  search: {
    flex: 1,
    borderRadius: theme.radius.large,
  },

  notification: {
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 1,
  },
});
