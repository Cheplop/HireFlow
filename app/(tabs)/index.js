import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { router } from "expo-router"; // Fixed: import lower-case router instance
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

        <Text style={styles.sectionTitle}>Job Listings</Text>

        {productItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.productRow}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: "/details/[id]",
                params: { id: (item.id) },
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
  backButton: {
    marginBottom: 16,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#184a9e",
    fontSize: 14,
    fontWeight: "700",
  },
  sectionTitle: {
    color: "#112033",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
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