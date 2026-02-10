import { Dashboard } from "@/components/dashboard";
import { checkIsLogin } from "@/helper/checkAuth";

export default function DasHome() {
  const isLogin = checkIsLogin();
  return <Dashboard />;
}
