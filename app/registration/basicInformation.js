import { View, Text, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView} from "react-native";
import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { router } from "expo-router";

import { ChevronLeft } from "lucide-react-native";


export default function BasicInformationScreen() {
  return (
            <ScrollView style>
                <View style={styles.card}>
                  <ChevronLeft size={30} color="black" style={{ marginBottom: 20 }} onPress={() => router.replace("register") }/>
                        <View style={styles.header}>
                          <Text style={styles.brand}>Basic Information</Text>
                          <View style= {styles.description}>
                            <Text style={styles.subtitle}>
                            Please provide your basic information to get started.
                            </Text>
                          </View>
                        </View>
                
                        <AuthInput
                          label="Full name"
                          placeholder="Jane Doe"
                        />
                        <AuthInput label="Middle Name" placeholder="Ex: Cruz" />
                       <View style={{ flexDirection: "row", width: "100%", gap: 12 }}>
                        <AuthInput
                          style={{ flex: 3 }}
                          label="Last Name"
                          placeholder="Ex: Doe"
                        />
                        <AuthInput
                          style={{ flex: 1 }}
                          label="Suffix"
                          placeholder="Ex: Jr."
                        />
                      </View>
                
                
                        <AuthInput
                          label="Contact Number"
                          placeholder="Enter your phone number"
                          keyboardType="phone-pad"
                        />
                
                        <PrimaryButton title="NEXT" onPress={() => router.replace("/registration/birthDate")}/>
                    </View>
            </ScrollView>

  )}

  const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBFBFB",
    justifyContent: "center",
    alignItems: "stretch",
  },
  header: {
    marginBottom: 18,
  },
  brand: {
    color: "black",
    fontSize: 30,
    fontWeight: "500",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  title: {
    color: "#111827",
    fontSize: 30,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  subtitle: {
    color: "#5f6c7b",
    fontSize: 15,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 40,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  registerText: {
    color: "#667085",
    fontSize: 14,
  },
  registerLink: {
    color: "#1c5ce6",
    fontSize: 14,
    fontWeight: "700",
  },
  description:{
    width: 250
  }
});
