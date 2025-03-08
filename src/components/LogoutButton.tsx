"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    // Remove the user data from localStorage (or clear your tokens/session)
    localStorage.removeItem("aiduser");
    localStorage.removeItem("accessToken");
    // Optionally, clear other stored authentication data here

    // Redirect the user to the login page (or home page)
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
    >
      Logout
    </button>
  );
}
