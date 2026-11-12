import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function EmployerOnly({ children }) {
  const { user } = useAuth();

  if (user?.role !== "employer") {
    return <Redirect href="/" />;
  }

  return children;
}
