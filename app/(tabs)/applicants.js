import ApplicantManagementScreen from "@/screens/ApplicantManagementScreen";
import EmployerOnly from "../../components/EmployerOnly";

export default function Applicants() {
  return (
    <EmployerOnly>
      <ApplicantManagementScreen />
    </EmployerOnly>
  );
}
