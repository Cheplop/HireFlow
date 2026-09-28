import {View, Text, StyleSheet, ScrollView, TouchableOpacity,} from "react-native";
import { router } from "expo-router";

import { ChevronLeft } from "lucide-react-native";


const productItems = [
  {
    id: 1,
    name: "Job 1",
    description: "This is the description for Product 1.",
  },
  {
    id: 2,
    name: "Job 2",
    description: "This is the description for Product 2.",
  },
  {
    id: 3,
    name: "Job 3",
    description: "This is the description for Product 3.",
  },
  {
    id: 4,
    name: "Job 4",
    description: "This is the description for Product 4.",
  },
  {
    id: 5,
    name: "Job 5",
    description: "This is the description for Product 5.",
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.sectionCard}>

        <ChevronLeft size={30} color="black" style={{ marginBottom: 20 }} onPress={() => router.back() }/>

        <Text style={styles.sectionTitle}>Job Listings</Text>

        {productItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productRow}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/details/[id]",
                params: { id: String(item.id) },
              })
            }
          >
            <View style={styles.productIconContainer}>
              <Text style={styles.productIcon}>{item.id}</Text>
            </View>
            <View style={styles.productTextWrap}>
              <Text style={styles.productName}>{item.name}</Text>
              <Text style={styles.productDescription}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7fb",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 18,
  },
  greeting: {
    color: "#5f6c7b",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.4,
    marginBottom: 6,
  },
  title: {
    color: "#112033",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.8,
  },
  heroCard: {
    backgroundColor: "#112033",
    borderRadius: 24,
    padding: 24,
    shadowColor: "#0d1b2a",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 20,
    elevation: 6,
  },
  heroEyebrow: {
    color: "#9ec5ff",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.7,
    marginBottom: 10,
  },
  heroText: {
    color: "#dfeafc",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 22,
  },
  primaryButton: {
    alignSelf: "flex-start",
    backgroundColor: "#7cc5ff",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: "#0d1b2a",
    fontSize: 14,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 14,
    alignItems: "center",
    shadowColor: "#cbd5e1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 2,
  },
  statValue: {
    color: "#112033",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    color: "#5f6c7b",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 20,
    marginTop: 22,
    shadowColor: "#dfe7f4",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 3,
  },
  sectionTitle: {
    color: "#112033",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  actionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#eaf4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  actionIcon: {
    color: "#184a9e",
    fontWeight: "700",
    fontSize: 12,
  },
  actionText: {
    color: "#1f2d3d",
    fontSize: 15,
    fontWeight: "600",
    flex: 1,
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#edf2f7",
  },
  productIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: "#eaf4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  productIcon: {
    color: "#184a9e",
    fontWeight: "800",
    fontSize: 13,
  },
  productTextWrap: {
    flex: 1,
  },
  productName: {
    color: "#1f2d3d",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 4,
  },
  productDescription: {
    color: "#5f6c7b",
    fontSize: 12,
    lineHeight: 18,
  },
});
