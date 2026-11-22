import { Stack } from "expo-router";
import { AuthProvider } from "../contexts/AuthContext";
import { ApplicantsProvider } from "../contexts/ApplicantsContext";
import { ApplicationsProvider } from "../contexts/ApplicationsContext";
import { JobsProvider } from "../contexts/JobsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <JobsProvider>
        <ApplicationsProvider>
          <ApplicantsProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="login" options={{ headerShown: false }} />
              <Stack.Screen
                name="registration"
                options={{ headerShown: false, animation: "simple_push" }}
              />
              <Stack.Screen
                name="jobDetails"
                options={{ headerShown: false, animation: "simple_push" }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="applicants" options={{ headerShown: false }} />
              <Stack.Screen name="profile-edit" options={{ headerShown: true, title: "Edit Profile" }} />
            </Stack>
          </ApplicantsProvider>
        </ApplicationsProvider>
      </JobsProvider>
    </AuthProvider>
  );
}
