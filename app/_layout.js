import { Stack } from "expo-router";
import { ApplicantsProvider } from "../contexts/ApplicantsContext";
import { ApplicationsProvider } from "../contexts/ApplicationsContext";
import { AuthProvider } from "../contexts/AuthContext";
import { JobsProvider } from "../contexts/JobsContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <NotificationsProvider>
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
                <Stack.Screen
                  name="applicants"
                  options={{ headerShown: false, animation: "simple_push" }}
                />
                <Stack.Screen
                  name="notifications"
                  options={{ headerShown: false, animation: "simple_push" }}
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              </Stack>
            </ApplicantsProvider>
          </ApplicationsProvider>
        </JobsProvider>
      </NotificationsProvider>
    </AuthProvider>
  );
}
