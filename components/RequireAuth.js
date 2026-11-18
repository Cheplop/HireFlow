import { Redirect } from "expo-router";
import LoadingScreen from "./common/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";

// Wrap any layout/screen that needs a logged-in user.
export default function RequireAuth({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!user) return <Redirect href="/login" />;

  return children;
}