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
              <Stack.Screen
                name="registration"
                options={{ headerShown: false, animation: "simple_push" }}
              />
              <Stack.Screen
                name="jobDetails"
                options={{ headerShown: false, animation: "simple_push" }}
              />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            </Stack>
          </ApplicantsProvider>
        </ApplicationsProvider>
      </JobsProvider>
    </AuthProvider>
  );
}
