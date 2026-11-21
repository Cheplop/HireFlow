import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";

import { PHOTO_STORAGE_KEY } from "./ProfileScreen.data";

// Same key ProfileScreen reads, so a photo saved here shows up on the profile.
const photoKey = (userId) => `${PHOTO_STORAGE_KEY}:${userId ?? "guest"}`;

// Opens the gallery or camera and returns the picked asset, or null if the
// person cancelled or denied permission.
export async function pickAvatar(source) {
  const options = {
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
    base64: Platform.OS === "web",
  };

  if (source === "camera") {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Camera access needed", "Allow camera access in your settings to take a photo.");
      return null;
    }
    const result = await ImagePicker.launchCameraAsync(options);
    return result.canceled ? null : (result.assets?.[0] ?? null);
  }

  if (Platform.OS !== "web") {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Photo library access needed", "Allow photo library access in your settings to choose a photo.");
      return null;
    }
  }
  const result = await ImagePicker.launchImageLibraryAsync(options);
  return result.canceled ? null : (result.assets?.[0] ?? null);
}

// Makes the picked photo permanent (picker URIs are temporary) and records it
// as this account's avatar. Returns the stored URI.
export async function saveAvatar(userId, asset) {
  let uri;

  if (Platform.OS === "web") {
    if (!asset?.base64) throw new Error("The selected photo could not be saved.");
    uri = `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`;
  } else {
    const source = new File(asset.uri);
    if (!source.exists) throw new Error("The selected photo is no longer available.");
    const copy = new File(
      Paths.document,
      `hireflow-avatar-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${source.extension || ".jpg"}`,
    );
    await source.copy(copy);
    uri = copy.uri;
  }

  let photos = {};
  try {
    photos = JSON.parse((await AsyncStorage.getItem(photoKey(userId))) || "{}") ?? {};
  } catch {
    photos = {};
  }
  await AsyncStorage.setItem(photoKey(userId), JSON.stringify({ ...photos, avatarUri: uri }));
  return uri;
}