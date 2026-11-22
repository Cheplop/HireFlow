import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";
import { Camera, ChevronLeft, UserRound } from "lucide-react-native";

import { PrimaryButton } from "@/components/common/PrimaryButton";
import EmployeeOnly from "../../components/EmployeeOnly";
import { useAuth } from "../../contexts/AuthContext";
import { pickAvatar, saveAvatar } from "../../data/avatarStorage";
import theme from "../../styles/theme";

// Last registration step. Both buttons end the flow on the employee profile,
// where "Edit profile" lets the person change anything afterwards.
const PROFILE_ROUTE = "/(tabs)/profile";

function SetupProfile() {
  const { user } = useAuth();
  const [asset, setAsset] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const choosePhoto = async (source) => {
    try {
      const picked = await pickAvatar(source);
      if (picked) setAsset(picked);
    } catch (error) {
      Alert.alert("Could not load photo", error instanceof Error ? error.message : "Please try again.");
    }
  };

  // Phones can take a photo or use the gallery; the web build only has the gallery.
  const openPhotoOptions = () => {
    if (Platform.OS === "web") {
      choosePhoto("library");
      return;
    }
    Alert.alert("Profile photo", "Choose where to get your photo from.", [
      { text: "Take a photo", onPress: () => choosePhoto("camera") },
      { text: "Choose from gallery", onPress: () => choosePhoto("library") },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const saveAndContinue = async () => {
    if (!asset) return;
    setIsSaving(true);
    try {
      await saveAvatar(user?.id, asset);
    } catch (error) {
      setIsSaving(false);
      Alert.alert("Could not save photo", error instanceof Error ? error.message : "Please try again.");
      return;
    }
    router.replace(PROFILE_ROUTE);
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <View style={styles.header}>
            <ChevronLeft size={30} color="black" style={styles.back} onPress={() => router.back()} />
            <Text style={styles.title}>Profile Photo</Text>
            <Text style={styles.subtitle}>Add a photo so employers can recognize you. You can skip this and change it anytime from your profile.</Text>
          </View>

          <View style={styles.photoWrap}>
            <Pressable
              style={styles.photo}
              onPress={openPhotoOptions}
              accessibilityRole="button"
              accessibilityLabel="Choose a profile photo"
            >
              {asset ? (
                <Image source={{ uri: asset.uri }} style={styles.photoImage} />
              ) : (
                <UserRound size={52} color={theme.colors.placeholder} />
              )}
              <View style={styles.badge}>
                <Camera size={16} color={theme.fontColor.dark} />
              </View>
            </Pressable>
            <Text style={styles.hint}>
              {asset ? "Tap to change photo" : "Tap to choose a photo"}
            </Text>
          </View>

          <PrimaryButton
            title={isSaving ? "SAVING..." : "SAVE AND CONTINUE"}
            onPress={saveAndContinue}
            disabled={!asset || isSaving}
            style={(!asset || isSaving) && styles.disabled}
          />
          <PrimaryButton
            title="SKIP FOR NOW"
            variant="secondary"
            style={styles.skip}
            onPress={() => router.replace(PROFILE_ROUTE)}
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default function SetupProfileRoute() {
  return (
    <EmployeeOnly>
      <SetupProfile />
    </EmployeeOnly>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.colors.background },
  container: {
    flexGrow: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
    paddingVertical: 36,
  },
  card: { backgroundColor: theme.colors.cardBackground, padding: 22 },
  header: { marginBottom: 18 },
  back: { marginBottom: 20 },
  title: {
    color: theme.colors.title,
    fontSize: theme.fontSize.title,
    fontWeight: "400",
    letterSpacing: -1,
    marginBottom: 8,
  },
  subtitle: {
    color: theme.colors.subtitle,
    fontSize: theme.fontSize.medium,
    lineHeight: 22,
  },
  photoWrap: { alignItems: "center", marginBottom: theme.spacing.large },
  photo: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.mutedBackground,
    alignItems: "center",
    justifyContent: "center",
  },
  photoImage: { width: "100%", height: "100%", borderRadius: 70 },
  badge: {
    position: "absolute",
    right: 2,
    bottom: 2,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  hint: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    marginTop: theme.spacing.small + 4,
  },
  disabled: { opacity: 0.5 },
  skip: { marginTop: theme.spacing.small + 4 },
});