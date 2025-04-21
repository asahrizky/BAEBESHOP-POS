import { useRouter } from "next/router";
import { logout } from "@/utils/auth";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      router.push("/");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
