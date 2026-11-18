import { Redirect } from "expo-router";
import LoadingScreen from "./common/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";

export default function EmployerOnly({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect href="/login" />;
  // Logged in with the wrong role: send them to their own home tab.
  if (user.role !== "employer") return <Redirect href="/(tabs)" />;

  return children;
}