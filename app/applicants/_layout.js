import { Stack } from "expo-router";
import EmployerOnly from "../../components/EmployerOnly";

export default function ApplicantLayout() {
  return (
    <EmployerOnly>
      <Stack screenOptions={{ headerShown: false }} />
    </EmployerOnly>
  );
}
