import { FlatList, StyleSheet, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { AuthInput } from "@/components/AuthInput";
import ApplicationsCard from "@/components/ApplicationsCard";

import { Bell, Search } from "lucide-react-native";

import { work } from "../data/jobs";
import theme from "../styles/theme";

export default function ApplicationScreen() {
  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.headerContainer}>
        <View style={styles.search}>
          <AuthInput
            placeholder="Search jobs..."
            icon={<Search size={20} color="#abb0b7" />}
          />
        </View>

        <View style={styles.notification}>
          <Bell size={20} color="black" />
        </View>
      </View>

      <FlatList
        data={work}
        contentContainerStyle={styles.cards}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ApplicationsCard
            cardLogo={item.companyLogo}
            cardTitle={item.jobTitle}
            cardCompany={item.jobCompany}
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
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: theme.spacing.small,
    width: "100%",
  },

  search: {
    flex: 1,
    height: 55,
    borderRadius: theme.radius.large,
  },

  notification: {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
  },
cards: {
  gap: theme.spacing.medium,
  paddingBottom: 110,
  paddingHorizontal: 5,
  paddingTop: 10,
},

});
