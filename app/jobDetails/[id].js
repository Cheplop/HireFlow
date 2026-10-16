import { StyleSheet, Text, SafeAreaView, View, Image } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import { ChevronLeft } from "lucide-react-native";
import Ionicons from '@expo/vector-icons/Ionicons';

import theme from "../../styles/theme";

import { work } from "../../data/jobs";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();

  const jobs = work.find((jobs) => jobs.id === Number(id));

  return (
    <SafeAreaView style={styles.container}>

      <View style = {styles.header}>
        <View style ={styles.back}>
          <ChevronLeft size={30} color="black" onPress={() => router.back() }/>
        </View>
        
        <View>
          <Text style = {styles.jobDetails}>Job Details</Text>
        </View>
      </View>

      <View style ={styles.card}>

        <View style = {styles.worksettingContainer}>
          <View style  = {styles.workSetting}>
            <Text>ON-SITE</Text>
            <Text>FULL TIME</Text>
          </View>
          <View style ={styles.fave}>
            <Ionicons name="bookmark-outline" size={24} color="black" />
          </View>
        </View>

        <View style = {styles.company}>
            <Image
              source={require("../../assets/images/google.png")}
              style={styles.image}
            />
          <Text style={styles.jobTitle}>UX/ UI Designer</Text>
          <Text>Google Incorporated</Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 22,
    backgroundColor: theme.colors.background,
    gap: theme.spacing.medium
  },

  header: {
    paddingHorizontal: 22,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },

  back: {
    width: "40%",
  },

  jobDetails: {
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.normal
  },

  card:{
    width: 350,
    height: 225,
    padding: theme.spacing.small,
    gap: theme.spacing.small,
    boxShadow: theme.boxShadow.default,
    borderRadius: theme.radius.medium
  },

  worksettingContainer: {
    width: "100%",
    padding: theme.spacing.medium,
    justifyContent: "space-between",
    flexDirection: "row",
    gap: theme.spacing.medium
  },

  workSetting: {
    flexDirection: "row",
    fontWeight: theme.fontWeight.muted,
    gap: theme.spacing.medium
  },

  fav: {
    alignItems: "flex-start"
  },

  company: {
    alignItems: "center",
    gap: theme.spacing.small
  },

  jobTitle: {
    fontSize: theme.fontSize.large ,
    fontWeight: theme.fontWeight.bold
  },

  image: {
    width: 50,
    height: 50,
    marginBottom: theme.spacing.small,
    resizeMode: 'contain',
  },
});