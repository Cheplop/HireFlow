import { useEffect, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { Stack, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Camera, UserRound } from "lucide-react-native";

import { AuthInput } from "../components/common/AuthInput";
import { PrimaryButton } from "../components/common/PrimaryButton";
import { useAuth } from "../contexts/AuthContext";
import { getStarterProfile, loadSavedProfile, saveProfileData } from "../data/profileStorage";
import { useNotifications } from "../contexts/NotificationsContext";
import { PHOTO_STORAGE_KEY } from "../data/ProfileScreen.data";
import theme from "../styles/theme";

const emptyDraft = {
  firstName: "", lastName: "", email: "", phone: "", address: "", summary: "", skills: "",
};

export default function ProfileEditScreen() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const router = useRouter();
  const [draft, setDraft] = useState(emptyDraft);
  const [avatarUri, setAvatarUri] = useState(null);
  const [pickedAvatarUri, setPickedAvatarUri] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      const [saved, photos] = await Promise.all([
        loadSavedProfile(user?.id),
        AsyncStorage.getItem(`${PHOTO_STORAGE_KEY}:${user?.id ?? "guest"}`).catch(() => null),
      ]);
      if (!active) return;
      const starter = getStarterProfile(user);
      const profile = { ...starter.profile, ...(saved?.profile ?? {}) };
      const fullName = profile.name || user?.username || "";
      const parts = fullName.trim().split(/\s+/).filter(Boolean);
      setDraft({
        firstName: saved?.firstName ?? (parts.slice(0, -1).join(" ") || fullName),
        lastName: saved?.lastName ?? (parts.length > 1 ? parts.at(-1) : ""),
        email: profile.email ?? user?.email ?? "",
        phone: profile.phone ?? saved?.contactNumber ?? "",
        address: saved?.address ?? profile.location ?? "",
        summary: saved?.about?.text ?? starter.about.text ?? "",
        skills: (saved?.about?.skills ?? starter.about.skills ?? []).join(", "),
      });
      try { setAvatarUri(JSON.parse(photos || "null")?.avatarUri ?? null); } catch { setAvatarUri(null); }
      setLoading(false);
    }
    load();
    return () => { active = false; };
  }, [user]);

  const setField = (key) => (value) => {
    setError("");
    setDraft((current) => ({ ...current, [key]: value }));
  };

  const choosePhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo access needed", "Allow photo library access to choose a profile picture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"], allowsEditing: true, aspect: [1, 1], quality: 0.8,
    });
    if (!result.canceled && result.assets?.[0]?.uri) setPickedAvatarUri(result.assets[0].uri);
  };

  const save = async () => {
    const firstName = draft.firstName.trim();
    const lastName = draft.lastName.trim();
    const email = draft.email.trim();
    if (!firstName || !lastName) { setError("First name and last name are required."); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { setError("Enter a valid email address."); return; }

    setSaving(true);
    try {
      const fullName = `${firstName} ${lastName}`;
      await saveProfileData(user.id, {
        firstName, lastName, address: draft.address.trim(), contactNumber: draft.phone.trim(),
        profile: { name: fullName, email, phone: draft.phone.trim(), location: draft.address.trim() },
        about: {
          text: draft.summary.trim(),
          skills: draft.skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        },
      });
      if (pickedAvatarUri) {
        let persistentUri = pickedAvatarUri;
        if (Platform.OS !== "web") {
          const source = new File(pickedAvatarUri);
          const destination = new File(Paths.document, `hireflow-avatar-${user.id}-${Date.now()}${source.extension || ".jpg"}`);
          await source.copy(destination);
          persistentUri = destination.uri;
        }
        const photoKey = `${PHOTO_STORAGE_KEY}:${user.id}`;
        const photos = JSON.parse(await AsyncStorage.getItem(photoKey) || "{}");
        await AsyncStorage.setItem(photoKey, JSON.stringify({ ...photos, avatarUri: persistentUri }));
      }
      addNotification({
        userId: user.id,
        recipientRole: user.role,
        type: "profile_updated",
        title: "Profile updated",
        message: "Your profile information was saved successfully.",
        route: "/(tabs)/profile",
      });
      Alert.alert("Profile updated", "Your changes have been saved.", [{ text: "OK", onPress: () => router.back() }]);
    } catch {
      setError("Could not save your changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== "employee") return null;
  const photo = pickedAvatarUri || avatarUri;

  return (
    <SafeAreaView style={styles.safe}>
      <Stack.Screen options={{ title: "Edit Profile", headerShown: true }} />
      <KeyboardAvoidingView style={styles.fill} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Pressable style={styles.photoButton} onPress={choosePhoto} accessibilityRole="button">
            {photo ? <Image source={{ uri: photo }} style={styles.photo} /> : <UserRound size={38} color={theme.colors.placeholder} />}
            <View style={styles.camera}><Camera size={16} color="white" /></View>
          </Pressable>
          <Text style={styles.hint}>Tap to choose a profile picture</Text>

          <AuthInput label="First name *" value={draft.firstName} onChangeText={setField("firstName")} autoCapitalize="words" />
          <AuthInput label="Last name *" value={draft.lastName} onChangeText={setField("lastName")} autoCapitalize="words" />
          <AuthInput label="Email address *" value={draft.email} onChangeText={setField("email")} keyboardType="email-address" autoCapitalize="none" />
          <AuthInput label="Contact number" value={draft.phone} onChangeText={setField("phone")} keyboardType="phone-pad" />
          <AuthInput label="Address" value={draft.address} onChangeText={setField("address")} />
          <AuthInput label="Professional summary" value={draft.summary} onChangeText={setField("summary")} multiline inputStyle={styles.multiline} />
          <AuthInput label="Skills (separate with commas)" value={draft.skills} onChangeText={setField("skills")} multiline inputStyle={styles.multilineShort} />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <View style={styles.actions}>
            <PrimaryButton title="Cancel" variant="secondary" style={styles.action} onPress={() => router.back()} />
            <PrimaryButton title={saving ? "Saving..." : "Save Changes"} style={styles.action} onPress={save} disabled={saving || loading} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: theme.colors.background },
  fill: { flex: 1 },
  content: { padding: 22, paddingBottom: 110 },
  photoButton: { alignSelf: "center", width: 104, height: 104, borderRadius: 52, backgroundColor: theme.colors.cardBackground, borderWidth: 2, borderColor: theme.colors.border, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  photo: { width: "100%", height: "100%" },
  camera: { position: "absolute", right: 1, bottom: 1, width: 30, height: 30, borderRadius: 15, backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center" },
  hint: { textAlign: "center", color: theme.fontColor.secondary, marginTop: 8, marginBottom: 22, fontSize: theme.fontSize.small },
  multiline: { minHeight: 100, textAlignVertical: "top" },
  multilineShort: { minHeight: 72, textAlignVertical: "top" },
  error: { color: theme.actions.deletePrimary, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 12, marginTop: 8 },
  action: { flex: 1 },
});
