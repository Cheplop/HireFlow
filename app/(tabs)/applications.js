import ApplicationScreen from "@/screens/ApplicationScreen";
import EmployeeOnly from "../../components/EmployeeOnly";

export default function Applications() {
  return (
    <EmployeeOnly>
      <ApplicationScreen />
    </EmployeeOnly>
  );
}