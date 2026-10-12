import { View, Text, StyleSheet, ScrollView} from "react-native";
import { AuthInput } from "@/components/AuthInput";
import { PrimaryButton } from "@/components/PrimaryButton";
import { router } from "expo-router";
import theme from "../../styles/theme";


import { ChevronLeft } from "lucide-react-native";


export default function BasicInformationScreen() {
  return (
            <ScrollView style>
                <View style={styles.card}>
                  <ChevronLeft size={30} color="black" style={{ marginBottom: 20 }} onPress={() => router.back() }/>
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
                
                        <PrimaryButton title="NEXT" onPress={() => router.push("/registration/birthDate")}/>
                    </View>
            </ScrollView>

  )}

  const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "start",
    alignItems: "stretch",
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  header: {
    marginBottom: 18,
  },
  brand: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.large,
    fontWeight: "500",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  title: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.xl,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  subtitle: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.medium,
    lineHeight: theme.spacing.large,
  },
  card: {
    backgroundColor: theme.colors.background,
    padding: 40,
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  registerText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
  },
  registerLink: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.small,
    fontWeight: "700",
  },
  description:{
    width: 250
  }
});
