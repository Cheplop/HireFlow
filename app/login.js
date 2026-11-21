import PublicOnly from "../components/PublicOnly";
import LoginScreen from "../screens/LoginScreen";

export default function Login() {
  return (
    <PublicOnly>
      <LoginScreen />
    </PublicOnly>
  );
}