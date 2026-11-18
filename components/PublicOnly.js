import { Redirect } from "expo-router";
import LoadingScreen from "./common/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";

// For the login screen: logged-in users go straight to the app.
export default function PublicOnly({ children }) {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (user) return <Redirect href="/(tabs)" />;

  return children;
}