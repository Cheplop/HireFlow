import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initialAbout,
  initialCertificates,
  initialEducation,
  initialExperience,
  initialProfile,
} from "./ProfileScreen.data";

// One saved profile per account, so people never see each other's data.
const profileKey = (userId) => `hireflow.profile.${userId}`;

export async function loadSavedProfile(userId) {
  if (!userId) return null;

  try {
    const raw = await AsyncStorage.getItem(profileKey(userId));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Merges `patch` into whatever is already saved for this account.
export async function saveProfileData(userId, patch) {
  if (!userId) return;

  try {
    const current = (await loadSavedProfile(userId)) || {};
    await AsyncStorage.setItem(
      profileKey(userId),
      JSON.stringify({ ...current, ...patch }),
    );
  } catch {
    // Saving is best-effort; the screens still work without it.
  }
}

// What a profile looks like before anything has been saved.
// The sample data is kept only for the built-in demo job seeker.
export function getStarterProfile(user) {
  if (user?.id === "remiel") {
    return {
      profile: initialProfile,
      education: initialEducation,
      experience: initialExperience,
      certificates: initialCertificates,
      about: initialAbout,
    };
  }

  return {
    profile: { name: user?.username ?? "", location: "" },
    education: [],
    experience: [],
    certificates: [],
    about: { text: "", skills: [], availability: "" },
  };
}