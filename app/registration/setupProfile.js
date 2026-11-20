import { Redirect } from "expo-router";

// This legacy route is kept as an alias for the current registration step.
export default function SetupProfileRoute() {
  return <Redirect href="/registration/basicInformation" />;
}
