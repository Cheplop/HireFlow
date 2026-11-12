import { Redirect } from "expo-router";
import { useAuth } from "../contexts/AuthContext";

export default function EmployeeOnly({ children }) {
  const { user } = useAuth();

  if (user?.role !== "employee") {
    return <Redirect href="/" />;
  }

  return children;
}
