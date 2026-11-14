import { useEffect, useState } from "react";
import { Alert, Platform, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import ProfileContent from "../components/profile/ProfileContent";
import ProfileMenu from "../components/profile/ProfileMenu";
import {
  ProfileEditorModal,
  ProfilePhotoModal,
} from "../components/profile/ProfileModals";
import { useAuth } from "../contexts/AuthContext";
import {
  FORMS,
  initialAbout,
  initialCertificates,
  initialEducation,
  initialExperience,
  initialProfile,
  makeId,
  PHOTO_STORAGE_KEY,
  sections,
} from "../data/ProfileScreen.data";
import theme from "../styles/theme";

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: 22,
  },
  scrollContent: {
    paddingBottom: 105,
  },
  profileActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
    marginTop: 10,
  },
  sectionContent: {
    gap: theme.spacing.small,
  },
  groupTitle: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 7,
  },
  emptyText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    paddingVertical: theme.spacing.large,
    textAlign: "center",
  },
  aboutCard: {
    gap: theme.spacing.small,
    padding: theme.spacing.medium,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.cardBackground,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2,
  },
  aboutTitle: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.bold,
    marginTop: 3,
  },
  aboutText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.small,
    lineHeight: 19,
  },
  skills: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  skillChip: {
    color: theme.actions.editPrimary,
    fontSize: theme.fontSize.xsmall,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.large,
    backgroundColor: theme.actions.editBg,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.radius.large,
    backgroundColor: theme.actions.editBg,
  },
  actionText: {
    color: theme.colors.primary,
    fontSize: theme.fontSize.xsmall,
    fontWeight: theme.fontWeight.semibold,
  },
  deleteButton: {
    backgroundColor: theme.actions.deleteBg,
  },
  deleteText: {
    color: theme.actions.deletePrimary,
  },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: theme.colors.overlaySubtle,
  },
  modalSheet: {
    maxHeight: "88%",
    paddingTop: theme.spacing.medium,
    borderTopLeftRadius: theme.radius.medium,
    borderTopRightRadius: theme.radius.medium,
    backgroundColor: theme.colors.background,
  },
  photoSheet: {
    gap: 8,
    paddingHorizontal: 22,
    paddingBottom: theme.spacing.large,
  },
  photoOption: {
    minHeight: 44,
  },
  removeOption: {
    backgroundColor: theme.actions.deleteBg,
    borderColor: theme.actions.deleteBg,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 22,
    paddingBottom: theme.spacing.small,
  },
  modalTitle: {
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.medium,
    fontWeight: theme.fontWeight.bold,
    textTransform: "capitalize",
  },
  modalBody: {
    gap: theme.spacing.small,
    paddingHorizontal: 22,
    paddingVertical: theme.spacing.small,
  },
  fieldLabel: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.xsmall,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 5,
  },
  sectionTab: {
    minHeight: 34,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.large,
    backgroundColor: theme.colors.cardBackground,
  },
  selectedSectionTab: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  sectionTabText: {
    color: theme.fontColor.secondary,
    fontSize: theme.fontSize.xsmall,
    fontWeight: theme.fontWeight.semibold,
  },
  selectedSectionTabText: {
    color: theme.fontColor.dark,
  },
  input: {
    minHeight: 44,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    backgroundColor: theme.colors.cardBackground,
    color: theme.fontColor.primary,
    fontSize: theme.fontSize.small,
  },
  inputMultiline: {
    minHeight: 96,
    textAlignVertical: "top",
  },
  errorText: {
    color: theme.actions.deletePrimary,
    fontSize: theme.fontSize.xsmall,
  },
  modalFooter: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 22,
    paddingTop: theme.spacing.small,
    paddingBottom: theme.spacing.large,
  },
  footerButton: {
    flex: 1,
    minHeight: 44,
  },
});

export default function ProfileScreen() {
  const { setUser } = useAuth();
  const [activeSection, setActiveSection] = useState("Education");
  const [isEditing, setIsEditing] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [profile, setProfile] = useState(initialProfile);
  const [education, setEducation] = useState(initialEducation);
  const [experience, setExperience] = useState(initialExperience);
  const [certificates, setCertificates] = useState(initialCertificates);
  const [about, setAbout] = useState(initialAbout);
  const [avatarUri, setAvatarUri] = useState(null);
  const [coverUri, setCoverUri] = useState(null);
  const [photoTarget, setPhotoTarget] = useState(null);
  const [editor, setEditor] = useState(null);
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadPhotos = async () => {
      try {
        const savedPhotos = await AsyncStorage.getItem(PHOTO_STORAGE_KEY);
        if (!savedPhotos) return;

        const photos = JSON.parse(savedPhotos);
        if (isMounted) {
          setAvatarUri(typeof photos.avatarUri === "string" ? photos.avatarUri : null);
          setCoverUri(typeof photos.coverUri === "string" ? photos.coverUri : null);
        }
      } catch (loadError) {
        if (isMounted) {
          Alert.alert(
            "Could not load photos",
            loadError instanceof Error ? loadError.message : "Please try again."
          );
        }
      }
    };

    loadPhotos();
    return () => {
      isMounted = false;
    };
  }, []);

  const openEditor = (type, item = null) => {
    let values = {};

    if (type === "profile") {
      values = { ...profile };
    } else if (type === "about") {
      values = {
        text: about.text,
        skills: about.skills.join(", "),
        availability: about.availability,
      };
    } else if (type === "experience") {
      values = item
        ? {
            title: item.title,
            subtitle: item.subtitle,
            date: item.date,
            location: item.details?.[0] ?? "",
            type: item.details?.[1] ?? "",
            description: item.description ?? "",
          }
        : {};
    } else if (type === "education") {
      values = item ? { ...item } : { group: "Tertiary" };
    } else {
      values = item ? { ...item } : {};
    }

    setForm(values);
    setError("");
    setEditor({ type, id: item?.id ?? null });
  };

  const closeEditor = () => {
    setEditor(null);
    setForm({});
    setError("");
  };

  const saveEditor = () => {
    const config = FORMS[editor.type];
    const missing = config.fields.find((field) => field.required && !form[field.key]?.trim());
    if (missing) {
      setError(`${missing.label} is required.`);
      return;
    }

    const clean = (key) => (form[key] ?? "").trim();
    if (editor.type === "profile") {
      setProfile({ name: clean("name"), location: clean("location") });
    } else if (editor.type === "about") {
      setAbout({
        text: clean("text"),
        skills: clean("skills").split(",").map((skill) => skill.trim()).filter(Boolean),
        availability: clean("availability"),
      });
    } else {
      const setters = {
        education: setEducation,
        experience: setExperience,
        certificates: setCertificates,
      };
      const setList = setters[editor.type];
      let record;

      if (editor.type === "experience") {
        record = {
          title: clean("title"),
          subtitle: clean("subtitle"),
          date: clean("date"),
          details: [clean("location"), clean("type")],
          description: clean("description"),
        };
      } else if (editor.type === "education") {
        record = {
          group: form.group || "Other",
          title: clean("title"),
          subtitle: clean("subtitle"),
          date: clean("date"),
        };
      } else {
        record = {
          title: clean("title"),
          subtitle: clean("subtitle"),
          date: clean("date"),
        };
      }

      if (editor.id) {
        setList((previous) => previous.map((entry) => (
          entry.id === editor.id ? { ...entry, ...record } : entry
        )));
      } else {
        setList((previous) => [...previous, { id: makeId(editor.type), ...record }]);
      }
    }

    closeEditor();
  };

  const confirmDelete = (type, item) => {
    const setters = {
      education: setEducation,
      experience: setExperience,
      certificates: setCertificates,
    };
    Alert.alert("Delete entry", `Remove "${item.title}" from your profile?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setters[type]((previous) => previous.filter((entry) => entry.id !== item.id)),
      },
    ]);
  };

  const confirmClearAbout = () => {
    Alert.alert("Clear about section", "This removes your about text, skills and availability.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Clear",
        style: "destructive",
        onPress: () => setAbout({ text: "", skills: [], availability: "" }),
      },
    ]);
  };

  const pickPhoto = async (target, source) => {
    setPhotoTarget(null);

    try {
      const options = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: target === "avatar" ? [1, 1] : [3, 1],
        quality: 0.8,
        base64: Platform.OS === "web",
      };
      let result;

      if (source === "camera") {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Camera access needed", "Allow camera access in your settings to take a photo.");
          return;
        }
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (result.canceled) return;
      const asset = result.assets?.[0];
      if (!asset?.uri) {
        throw new Error("The selected photo is unavailable. Please try another photo.");
      }

      const photoKey = target === "avatar" ? "avatarUri" : "coverUri";
      const previousUri = target === "avatar" ? avatarUri : coverUri;
      let uri;
      let copiedFile;

      if (Platform.OS === "web") {
        if (!asset.base64) {
          throw new Error("The selected photo could not be saved. Please try another photo.");
        }
        uri = `data:${asset.mimeType || "image/jpeg"};base64,${asset.base64}`;
      } else {
        const sourceFile = new File(asset.uri);
        if (!sourceFile.exists) {
          throw new Error("The selected photo is no longer available. Please try again.");
        }
        copiedFile = new File(
          Paths.document,
          `hireflow-${target}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${sourceFile.extension || ".jpg"}`
        );
        await sourceFile.copy(copiedFile);
        uri = copiedFile.uri;
      }

      const nextPhotos = { avatarUri, coverUri, [photoKey]: uri };
      try {
        await AsyncStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
      } catch (saveError) {
        try {
          if (copiedFile?.exists) copiedFile.delete();
        } catch (cleanupError) {
          console.error("Could not clean up an unsaved profile photo.", cleanupError);
        }
        throw saveError;
      }

      if (target === "avatar") setAvatarUri(uri);
      else setCoverUri(uri);

      if (previousUri && previousUri !== uri && Platform.OS !== "web") {
        try {
          const previousFile = new File(previousUri);
          if (previousFile.exists) previousFile.delete();
        } catch (cleanupError) {
          console.error("Could not remove the previous profile photo.", cleanupError);
        }
      }
    } catch (pickError) {
      Alert.alert(
        "Could not load photo",
        pickError instanceof Error ? pickError.message : "Something went wrong. Please try again."
      );
    }
  };

  const removePhoto = async (target) => {
    const photoKey = target === "avatar" ? "avatarUri" : "coverUri";
    const previousUri = target === "avatar" ? avatarUri : coverUri;
    const nextPhotos = { avatarUri, coverUri, [photoKey]: null };

    try {
      await AsyncStorage.setItem(PHOTO_STORAGE_KEY, JSON.stringify(nextPhotos));
    } catch (removeError) {
      Alert.alert(
        "Could not remove photo",
        removeError instanceof Error ? removeError.message : "Please try again."
      );
      return;
    }

    if (target === "avatar") setAvatarUri(null);
    else setCoverUri(null);
    setPhotoTarget(null);

    if (previousUri && Platform.OS !== "web") {
      try {
        const previousFile = new File(previousUri);
        if (previousFile.exists) previousFile.delete();
      } catch (cleanupError) {
        console.error("Could not remove the profile photo file.", cleanupError);
      }
    }
  };

  const editorConfig = editor ? FORMS[editor.type] : null;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ProfileContent
        profile={profile}
        coverUri={coverUri}
        avatarUri={avatarUri}
        isEditing={isEditing}
        onPhotoTarget={setPhotoTarget}
        onMenuPress={() => setIsMenuVisible(true)}
        onToggleEditing={() => setIsEditing((value) => !value)}
        onEditProfile={() => openEditor("profile")}
        sections={sections}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        filteredEducation={education}
        educationEmpty={education.length === 0}
        filteredExperience={experience}
        experienceEmpty={experience.length === 0}
        filteredCertificates={certificates}
        certificatesEmpty={certificates.length === 0}
        about={about}
        styles={styles}
        onAdd={(type) => openEditor(type)}
        onEdit={(type, item) => openEditor(type, item)}
        onDelete={confirmDelete}
        onClearAbout={confirmClearAbout}
      />
      <ProfileEditorModal
        editor={editor}
        config={editorConfig}
        form={form}
        setForm={setForm}
        error={error}
        setError={setError}
        styles={styles}
        onClose={closeEditor}
        onSave={saveEditor}
      />
      <ProfilePhotoModal
        photoTarget={photoTarget}
        hasPhoto={photoTarget === "avatar" ? !!avatarUri : !!coverUri}
        styles={styles}
        onPickPhoto={pickPhoto}
        onRemovePhoto={removePhoto}
        onClose={() => setPhotoTarget(null)}
      />
      <ProfileMenu
        visible={isMenuVisible}
        onClose={() => setIsMenuVisible(false)}
        onNotifications={() => Alert.alert("Notifications", "Notifications are not available yet.")}
        onLogout={() => {
          setUser(null);
          router.replace("/");
        }}
      />
    </SafeAreaView>
  );
}
