import { useState } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ApplyCard } from "@/components/ApplyCard";
import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";

import { Search, Bell } from "lucide-react-native";

import { work } from "../data/jobs";
import theme from "../styles/theme";

export default function HomeScreen() {
    const [selectedType, setSelectedType] = useState("FULL TIME");

    return (
        <SafeAreaView style={styles.safeAreaView}>
            <View style={styles.headerContainer}>
                <View style={styles.search}>
                    <AuthInput
                        placeholder="Search jobs..."
                        icon={<Search size={20} color="#abb0b7" />}
                    />
                </View>

                <View style={styles.notification} >
                  icon={<Bell size={20} color="black" />}
                </View>
            </View>

            <View style={styles.worktypeContainer}>
                {["FULL TIME", "PART TIME", "CONTRACTUAL"].map((type) => (
                    <PrimaryButton
                        key={type}
                        title={type}
                        fontSize={theme.fontSize.small}
                        variant={selectedType === type ? "active" : "inactive"}
                        onPress={() => setSelectedType(type)}
                        style={styles.PrimaryButton}
                    />
                ))}
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
    },

    headerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: theme.spacing.small,
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
        alignItems: "center",
        justifyContent: "center",
        width: 40,
        height: 40,
        borderRadius: 25,
        borderWidth: 1,
    },

    worktypeContainer: {
        width: "100%",
        flexDirection: "row",
        gap: theme.spacing.small,
        marginBottom: theme.spacing.small,

    },

    partTime: {
        radius: theme.spacing.large,
        width: 150,
        height: 55,
    },

    fullTime: {
        width: 150,
        height: 55,
    },

    PrimaryButton: {
        flex: 1,
        height: 30,
        paddingVertical: 5,
      },
});