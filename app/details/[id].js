import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { productItems } from "../../data/jobs";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const productId = Number(id);
  const product = productItems.find((item) => item.id === productId) || {
    id: productId,
    name: "Unknown Product",
    description: "No details available for this item.",
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Item Details</Text>
      <Text style={styles.label}>ID: {product.id}</Text>
      <Text style={styles.label}>Name: {product.name}</Text>
      <Text style={styles.description}>Description: {product.description}</Text>

      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#f4f7fb",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#112033",
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    color: "#1f2d3d",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: "#1f2d3d",
    marginBottom: 30,
    lineHeight: 26,
  },
  backButton: {
    alignSelf: "flex-start",
    backgroundColor: "#112033",
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },
});