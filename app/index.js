import { Redirect } from "expo-router";
import LoadingScreen from "../components/common/LoadingScreen";
import { useAuth } from "../contexts/AuthContext";

// "/" is only a doorway: it sends people to the app or to the login screen.
export default function Index() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <LoadingScreen />;

  return <Redirect href={user ? "/(tabs)" : "/login"} />;
}