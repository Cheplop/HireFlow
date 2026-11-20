import { Redirect } from "expo-router";
import ProfileScreen from '../../screens/ProfileScreen';
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const { user } = useAuth();

  if (user?.role === "employer") {
    return <Redirect href="/applicants" />;
  }

  return <ProfileScreen />;
}